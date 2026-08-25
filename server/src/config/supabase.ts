import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// In-Memory Fallback DB for local development without Supabase setup
export interface MemoryUser {
  id: string;
  username: string;
  avatarUrl?: string;
  isHost: boolean;
  readyStatus: boolean;
  socketId: string;
}

export interface MemoryRoom {
  id: string;
  roomCode: string;
  roomName: string;
  hostId: string;
  templateId: string;
  status: 'lobby' | 'capturing' | 'editing' | 'finished';
  maxPhotos: number;
  countdownSeconds: number;
  members: MemoryUser[];
  capturedPhotos: { [slotIndex: number]: string };
  chatMessages: Array<{
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
  boothMode?: 'solo' | 'duo';
  activeTurn?: 'host' | 'joiner' | 'both' | 'solo';
}

export const memoryRooms: Map<string, MemoryRoom> = new Map();
