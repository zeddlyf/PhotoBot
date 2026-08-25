import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryRooms, MemoryRoom } from '../config/supabase';

const router = Router();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/rooms - Create Room OR Join Room
router.post('/', (req, res) => {
  try {
    const { hostName, roomName, templateId, maxPhotos, countdownSeconds, action, code, username } = req.body;

    // Handle Join Room request if action === 'join' or code is provided
    if (action === 'join' || code) {
      const roomCode = (code || '').toUpperCase();
      if (!roomCode) {
        return res.status(400).json({ success: false, message: 'Room code is required' });
      }

      let room = memoryRooms.get(roomCode);

      // On-demand serverless / multi-instance fallback recovery if room in memory was cold-started
      if (!room) {
        const roomId = uuidv4();
        const hostId = uuidv4();
        room = {
          id: roomId,
          roomCode,
          roomName: `Photo Booth (${roomCode})`,
          hostId,
          templateId: 'studio_clean_white',
          status: 'lobby',
          maxPhotos: 4,
          countdownSeconds: 3,
          members: [],
          capturedPhotos: {},
          chatMessages: [
            {
              id: uuidv4(),
              userId: 'system',
              username: 'System',
              text: `Welcome to SnapTogether room ${roomCode}!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          createdAt: new Date().toISOString()
        };
        memoryRooms.set(roomCode, room);
      }

      const existingUser = room.members.find(m => m.username.toLowerCase() === (username || '').toLowerCase());
      const userId = existingUser ? existingUser.id : uuidv4();

      if (!existingUser && username) {
        room.members.push({
          id: userId,
          username,
          isHost: room.members.length === 0,
          readyStatus: false,
          socketId: ''
        });
      }

      return res.json({
        success: true,
        user: { id: userId, username, isHost: room.members.length === 1 || existingUser?.isHost || false },
        room
      });
    }

    // Handle Create Room
    if (!hostName) {
      return res.status(400).json({ success: false, message: 'Host name is required' });
    }

    const roomCode = generateRoomCode();
    const roomId = uuidv4();
    const hostId = uuidv4();

    const newRoom: MemoryRoom = {
      id: roomId,
      roomCode,
      roomName: roomName || `${hostName}'s Photo Booth`,
      hostId,
      templateId: templateId || 'studio_clean_white',
      status: 'lobby',
      maxPhotos: Number(maxPhotos) || 4,
      countdownSeconds: Number(countdownSeconds) || 3,
      members: [
        {
          id: hostId,
          username: hostName,
          isHost: true,
          readyStatus: true,
          socketId: ''
        }
      ],
      capturedPhotos: {},
      chatMessages: [
        {
          id: uuidv4(),
          userId: 'system',
          username: 'System',
          text: `Welcome to ${roomName || 'SnapTogether'}! Share room code ${roomCode} with your friends!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      createdAt: new Date().toISOString()
    };

    memoryRooms.set(roomCode, newRoom);

    return res.status(201).json({
      success: true,
      roomCode,
      roomId,
      hostId,
      room: newRoom
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rooms/:code - Verify / fetch room state
router.get('/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  let room = memoryRooms.get(code);

  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  res.json({ success: true, room });
});

// POST /api/rooms/:code/join - Join room legacy endpoint
router.post('/:code/join', (req, res) => {
  const code = req.params.code.toUpperCase();
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  let room = memoryRooms.get(code);

  if (!room) {
    const roomId = uuidv4();
    const hostId = uuidv4();
    room = {
      id: roomId,
      roomCode: code,
      roomName: `Photo Booth (${code})`,
      hostId,
      templateId: 'studio_clean_white',
      status: 'lobby',
      maxPhotos: 4,
      countdownSeconds: 3,
      members: [],
      capturedPhotos: {},
      chatMessages: [
        {
          id: uuidv4(),
          userId: 'system',
          username: 'System',
          text: `Welcome to SnapTogether room ${code}!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      createdAt: new Date().toISOString()
    };
    memoryRooms.set(code, room);
  }

  const existingUser = room.members.find(m => m.username.toLowerCase() === username.toLowerCase());
  const userId = existingUser ? existingUser.id : uuidv4();

  if (!existingUser) {
    room.members.push({
      id: userId,
      username,
      isHost: room.members.length === 0,
      readyStatus: false,
      socketId: ''
    });
  }

  res.json({
    success: true,
    user: { id: userId, username, isHost: room.members.length === 1 || existingUser?.isHost || false },
    room
  });
});

export default router;
