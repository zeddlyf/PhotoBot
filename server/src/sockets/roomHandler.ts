import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { memoryRooms } from '../config/supabase';

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

  // Handle synchronized session start countdown
  socket.on('start_session', ({ roomCode }) => {
    const code = roomCode.toUpperCase();
    const room = memoryRooms.get(code);
    if (!room) return;

    room.status = 'capturing';
    room.capturedPhotos = {}; // Reset photos
    io.to(`room:${code}`).emit('room_state_updated', { room });

    // Initiate countdown
    const duration = room.countdownSeconds || 3;
    const maxPhotos = room.maxPhotos || 8;

    io.to(`room:${code}`).emit('countdown_started', {
      seconds: duration,
      totalSlots: maxPhotos,
      currentSlot: 0
    });

    let currentSlot = 0;
    
    function runSlotCapture() {
      let timer = duration;
      
      const interval = setInterval(() => {
        io.to(`room:${code}`).emit('countdown_tick', {
          currentSecond: timer,
          currentSlot
        });

        if (timer <= 0) {
          clearInterval(interval);
          
          // Trigger shutter snap across clients
          io.to(`room:${code}`).emit('shutter_snap', { slotIndex: currentSlot });

          currentSlot++;
          if (currentSlot < maxPhotos) {
            setTimeout(() => {
              runSlotCapture();
            }, 2200);
          } else {
            setTimeout(() => {
              if (room) {
                room.status = 'editing';
                io.to(`room:${code}`).emit('session_completed', { room });
                io.to(`room:${code}`).emit('room_state_updated', { room });
              }
            }, 1500);
          }
        } else {
          timer--;
        }
      }, 1000);
    }

    runSlotCapture();
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
