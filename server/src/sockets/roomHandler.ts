import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { memoryRooms } from '../config/supabase';
import { DEFAULT_TEMPLATES } from '../routes/templateRoutes';

export function setupRoomHandlers(io: Server, socket: Socket) {
  
  // Handle join room
  socket.on('join_room', ({ roomCode, userId, username }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);

    if (!room) {
      socket.emit('error_message', { message: 'Room not found' });
      return;
    }

    // Enforce 2-Player Maximum Constraint
    const isExisting = room.members.some(m => m.id === userId);
    if (!isExisting && room.members.length >= 2) {
      socket.emit('error_message', { message: 'Room is full (Maximum 2 players allowed)' });
      return;
    }

    socket.join(`room:${code}`);
    
    // Bind user socket
    let member = room.members.find(m => m.id === userId);
    if (!member) {
      member = {
        id: userId,
        username: username || 'Guest',
        isHost: room.members.length === 0,
        readyStatus: false,
        socketId: socket.id
      };
      room.members.push(member);
    } else {
      member.socketId = socket.id;
    }

    // Broadcast updated room state
    io.to(`room:${code}`).emit('room_state_updated', { room });
    
    // System message
    const sysMsg = {
      id: uuidv4(),
      userId: 'system',
      username: 'System',
      text: `${username || 'A friend'} joined the room!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    room.chatMessages.push(sysMsg);
    io.to(`room:${code}`).emit('chat_received', sysMsg);
  });

  // Handle ready status toggle
  socket.on('toggle_ready', ({ roomCode, userId, readyStatus }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    const member = room.members.find(m => m.id === userId);
    if (member) {
      member.readyStatus = readyStatus;
      io.to(`room:${code}`).emit('room_state_updated', { room });
    }
  });

  // Handle host template change
  socket.on('update_template', ({ roomCode, templateId }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    room.templateId = templateId;
    io.to(`room:${code}`).emit('room_state_updated', { room });
  });

  // Handle host settings update (countdown duration, max photos)
  socket.on('update_settings', ({ roomCode, countdownSeconds, maxPhotos }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    if (countdownSeconds !== undefined) room.countdownSeconds = Number(countdownSeconds);
    if (maxPhotos !== undefined) room.maxPhotos = Number(maxPhotos);

    io.to(`room:${code}`).emit('room_state_updated', { room });
  });

  // Handle synchronized session start countdown (Turn-Based vs Synchronized Dual)
  socket.on('start_session', ({ roomCode }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    const template = DEFAULT_TEMPLATES.find(t => t.id === room.templateId) || DEFAULT_TEMPLATES[0];
    const isDual = template.captureMode === 'synchronized_dual';

    room.status = 'capturing';
    room.capturedPhotos = {}; // Reset photos
    io.to(`room:${code}`).emit('room_state_updated', { room });

    const duration = room.countdownSeconds || 3;

    // Total shutter cycles:
    // Turn-based 4-Cut: 4 cycles
    // Dual 8-Cut (2x4): 4 cycles (captures 2 slots per cycle)
    // Dual 4-Cut (2x2): 2 cycles (captures 2 slots per cycle)
    const totalCycles = isDual ? (template.slots === 8 ? 4 : 2) : 4;

    let currentCycle = 0;

    function runCycleCapture() {
      // Determine active turn for current cycle
      let activeTurn: 'host' | 'joiner' | 'both' = 'both';
      let targetSlotIndex = currentCycle;

      if (isDual) {
        activeTurn = 'both';
        targetSlotIndex = currentCycle * 2; // Left slot index
      } else {
        // Turn-Based sequence: Cycle 0 = Host, Cycle 1 = Joiner, Cycle 2 = Host, Cycle 3 = Joiner
        activeTurn = currentCycle % 2 === 0 ? 'host' : 'joiner';
      }

      if (room) {
        room.activeTurn = activeTurn;
        io.to(`room:${code}`).emit('room_state_updated', { room });
      }

      io.to(`room:${code}`).emit('countdown_started', {
        seconds: duration,
        totalSlots: template.slots,
        currentSlot: targetSlotIndex,
        activeTurn,
        isDual
      });

      let timer = duration;
      
      const interval = setInterval(() => {
        io.to(`room:${code}`).emit('countdown_tick', {
          currentSecond: timer,
          currentSlot: targetSlotIndex,
          activeTurn,
          isDual
        });

        if (timer <= 0) {
          clearInterval(interval);
          
          // Trigger shutter snap across clients
          io.to(`room:${code}`).emit('shutter_snap', {
            slotIndex: targetSlotIndex,
            activeTurn,
            isDual
          });

          currentCycle++;
          if (currentCycle < totalCycles) {
            setTimeout(() => {
              runCycleCapture();
            }, 2500);
          } else {
            setTimeout(() => {
              if (room) {
                room.status = 'editing';
                room.activeTurn = undefined;
                io.to(`room:${code}`).emit('session_completed', { room });
                io.to(`room:${code}`).emit('room_state_updated', { room });
              }
            }, 1800);
          }
        } else {
          timer--;
        }
      }, 1000);
    }

    runCycleCapture();
  });

  // Handle photo captured data url upload from client
  socket.on('photo_captured', ({ roomCode, slotIndex, photoDataUrl }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    room.capturedPhotos[slotIndex] = photoDataUrl;
    io.to(`room:${code}`).emit('photo_synced', {
      slotIndex,
      capturedPhotos: room.capturedPhotos
    });
  });

  // Handle retake request
  socket.on('retake_session', ({ roomCode }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    room.status = 'lobby';
    room.capturedPhotos = {};
    room.activeTurn = undefined;
    io.to(`room:${code}`).emit('room_state_updated', { room });
  });

  // Handle live chat message
  socket.on('send_chat', ({ roomCode, userId, username, text }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room || !text.trim()) return;

    const chatMsg = {
      id: uuidv4(),
      userId,
      username,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    room.chatMessages.push(chatMsg);
    io.to(`room:${code}`).emit('chat_received', chatMsg);
  });

  // Handle floating emoji reactions
  socket.on('send_reaction', ({ roomCode, userId, username, emoji }) => {
    const code = roomCode.toUpperCase();
    socket.to(`room:${code}`).emit('reaction_received', {
      id: uuidv4(),
      userId,
      username,
      emoji
    });
  });

  // Handle WebRTC Peer Signaling (Offer, Answer, ICE Candidate)
  socket.on('webrtc_signal', ({ roomCode, targetSocketId, signal, senderUserId }) => {
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc_signal', {
        senderSocketId: socket.id,
        senderUserId,
        signal
      });
    } else {
      socket.to(`room:${roomCode.toUpperCase()}`).emit('webrtc_signal', {
        senderSocketId: socket.id,
        senderUserId,
        signal
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    memoryRooms.forEach((room, code) => {
      const index = room.members.findIndex(m => m.socketId === socket.id);
      if (index !== -1) {
        const member = room.members[index];
        room.members.splice(index, 1);
        if (room.members.length > 0) {
          if (member.isHost && room.members.length > 0) {
            room.members[0].isHost = true;
          }
          io.to(`room:${code}`).emit('room_state_updated', { room });
        }
      }
    });
  });
}
