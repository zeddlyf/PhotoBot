import crypto from 'crypto';

const rooms = globalThis.__memory_rooms || new Map();
globalThis.__memory_rooms = rooms;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }
    body = body || {};

    if (req.method === 'POST') {
      const { hostName, roomName, templateId, maxPhotos, countdownSeconds, username, code, action } = body;

      // Handle Join Room request
      if (action === 'join' || code) {
        const roomCode = (code || req.query.code || '').toUpperCase();
        if (!roomCode) {
          return res.status(400).json({ success: false, message: 'Room code is required' });
        }

        let room = rooms.get(roomCode);

        // On-demand serverless fallback recovery if room cold-started
        if (!room) {
          const roomId = crypto.randomUUID();
          const hostId = crypto.randomUUID();
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
                id: crypto.randomUUID(),
                userId: 'system',
                username: 'System',
                text: `Welcome to SnapTogether room ${roomCode}!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ],
            createdAt: new Date().toISOString()
          };
          rooms.set(roomCode, room);
        }

        const existingUser = room.members.find(m => m.username.toLowerCase() === (username || '').toLowerCase());
        const userId = existingUser ? existingUser.id : crypto.randomUUID();

        if (!existingUser && username) {
          room.members.push({
            id: userId,
            username,
            isHost: room.members.length === 0,
            readyStatus: false,
            socketId: ''
          });
        }

        return res.status(200).json({
          success: true,
          user: { id: userId, username, isHost: room.members.length === 1 || existingUser?.isHost || false },
          room
        });
      }

      // Create Room
      if (!hostName) {
        return res.status(400).json({ success: false, message: 'Host name is required' });
      }

      const roomCode = generateRoomCode();
      const roomId = crypto.randomUUID();
      const hostId = crypto.randomUUID();

      const newRoom = {
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
            id: crypto.randomUUID(),
            userId: 'system',
            username: 'System',
            text: `Welcome to ${roomName || 'SnapTogether'}! Share code ${roomCode} with friends!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        createdAt: new Date().toISOString()
      };

      rooms.set(roomCode, newRoom);

      return res.status(201).json({
        success: true,
        roomCode,
        roomId,
        hostId,
        room: newRoom
      });
    }

    if (req.method === 'GET') {
      const code = (req.query.code || '').toUpperCase();
      if (code) {
        let room = rooms.get(code);
        if (!room) {
          return res.status(404).json({ success: false, message: 'Room not found' });
        }
        return res.json({ success: true, room });
      }
      return res.json({ success: true, rooms: Array.from(rooms.values()) });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
}
