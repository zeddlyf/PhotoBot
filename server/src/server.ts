import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/roomRoutes';
import templateRoutes from './routes/templateRoutes';
import { setupRoomHandlers } from './sockets/roomHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// REST Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/templates', templateRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'SnapTogether Realtime Server', timestamp: new Date().toISOString() });
});

// HTTP & Socket.IO Server Setup
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e8 // 100 MB max for base64 photo bursts
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  setupRoomHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`🚀 SnapTogether Server running on port http://localhost:${PORT}`);
});
