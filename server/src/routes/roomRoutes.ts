import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryRooms, MemoryRoom } from '../config/supabase';

const router = Router();

// Generate a random 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/rooms - Create Room
router.post('/', (req, res) => {
  try {
    const { hostName, roomName, templateId, maxPhotos, countdownSeconds } = req.body;
    
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
      templateId: templateId || 'wedding_champagne',
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

    res.status(201).json({
      success: true,
      roomCode,
      roomId,
      hostId,
      room: newRoom
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rooms/:code - Verify / fetch room state
router.get('/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const room = memoryRooms.get(code);

  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  res.json({ success: true, room });
});

// POST /api/rooms/:code/join - Join room
router.post('/:code/join', (req, res) => {
  const code = req.params.code.toUpperCase();
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  const room = memoryRooms.get(code);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }

  const existingUser = room.members.find(m => m.username.toLowerCase() === username.toLowerCase());
  const userId = existingUser ? existingUser.id : uuidv4();

  if (!existingUser) {
    room.members.push({
      id: userId,
      username,
      isHost: false,
      readyStatus: false,
      socketId: ''
    });
  }

  res.json({
    success: true,
    user: { id: userId, username, isHost: existingUser?.isHost || false },
    room
  });
});

export default router;
