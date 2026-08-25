export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  isHost: boolean;
  readyStatus: boolean;
  socketId?: string;
}

export type EventCategory = 'wedding' | 'birthday' | 'graduation' | 'holiday' | 'minimalist' | 'y2k';

export type CaptureMode = 'turn_based' | 'synchronized_dual';

export interface Template {
  id: string;
  name: string;
  category: EventCategory;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerText: string;
  subText: string;
  badgeText: string;
  frameStyle: string;
  slots: number;
  aspectRatio: string;
  captureMode: CaptureMode;
}

export interface Room {
  id: string;
  roomCode: string;
  roomName: string;
  hostId: string;
  templateId: string;
  status: 'lobby' | 'capturing' | 'editing' | 'finished';
  maxPhotos: number;
  countdownSeconds: number;
  members: User[];
  capturedPhotos: { [slotIndex: number]: string };
  chatMessages: ChatMessage[];
  createdAt: string;
  activeTurn?: 'host' | 'joiner' | 'both';
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Sticker {
  id: string;
  emoji: string;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  scale: number;
  rotation: number;
}

export type PhotoFilter = 'normal' | 'vintage' | 'bw' | 'cyberpunk' | 'warm' | 'softglow' | 'contrast';

export interface FloatingReaction {
  id: string;
  userId: string;
  username: string;
  emoji: string;
}
