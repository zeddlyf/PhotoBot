import { create } from 'zustand';
import { User, Room, Template, PhotoFilter, Sticker, FloatingReaction } from '../types';

interface RoomStore {
  currentUser: User | null;
  room: Room | null;
  selectedTemplate: Template | null;
  availableTemplates: Template[];
  
  // Camera & Video
  isCameraActive: boolean;
  isMuted: boolean;
  activeFilter: PhotoFilter;
  mirrorCamera: boolean;
  usingVirtualCamera: boolean;

  // Countdown & Session
  isCountdownActive: boolean;
  countdownValue: number;
  currentSlotIndex: number;
  isShutterFlashing: boolean;

  // Photo Strip Studio Customization
  headerText: string;
  subText: string;
  eventDate: string;
  stickers: Sticker[];
  
  // Realtime Effects
  floatingReactions: FloatingReaction[];

  // Actions
  setCurrentUser: (user: User | null) => void;
  setRoom: (room: Room | null) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setAvailableTemplates: (templates: Template[]) => void;
  setCameraActive: (active: boolean) => void;
  setMuted: (muted: boolean) => void;
  setActiveFilter: (filter: PhotoFilter) => void;
  setMirrorCamera: (mirror: boolean) => void;
  setUsingVirtualCamera: (virtual: boolean) => void;
  setCountdownActive: (active: boolean) => void;
  setCountdownValue: (val: number) => void;
  setCurrentSlotIndex: (slot: number) => void;
  triggerShutterFlash: () => void;
  setHeaderText: (text: string) => void;
  setSubText: (text: string) => void;
  setEventDate: (date: string) => void;
  addSticker: (emoji: string) => void;
  updateSticker: (id: string, updates: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  addFloatingReaction: (reaction: FloatingReaction) => void;
  clearFloatingReaction: (id: string) => void;
  resetStore: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentUser: null,
  room: null,
  selectedTemplate: null,
  availableTemplates: [],

  isCameraActive: false,
  isMuted: false,
  activeFilter: 'normal',
  mirrorCamera: true,
  usingVirtualCamera: false,

  isCountdownActive: false,
  countdownValue: 3,
  currentSlotIndex: 0,
  isShutterFlashing: false,

  headerText: 'PHOTO BOTH',
  subText: 'Live Online Booth',
  eventDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  stickers: [],

  floatingReactions: [],

  setCurrentUser: (currentUser) => set({ currentUser }),
  setRoom: (room) => set({ room }),
  setSelectedTemplate: (selectedTemplate) => {
    if (selectedTemplate) {
      set({
        selectedTemplate,
        headerText: selectedTemplate.headerText || 'PHOTO BOTH',
        subText: selectedTemplate.subText || 'Live Online Booth'
      });
    } else {
      set({ selectedTemplate });
    }
  },
  setAvailableTemplates: (availableTemplates) => set({ availableTemplates }),
  setCameraActive: (isCameraActive) => set({ isCameraActive }),
  setMuted: (isMuted) => set({ isMuted }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setMirrorCamera: (mirrorCamera) => set({ mirrorCamera }),
  setUsingVirtualCamera: (usingVirtualCamera) => set({ usingVirtualCamera }),
  setCountdownActive: (isCountdownActive) => set({ isCountdownActive }),
  setCountdownValue: (countdownValue) => set({ countdownValue }),
  setCurrentSlotIndex: (currentSlotIndex) => set({ currentSlotIndex }),
  triggerShutterFlash: () => {
    set({ isShutterFlashing: true });
    setTimeout(() => set({ isShutterFlashing: false }), 600);
  },
  setHeaderText: (headerText) => set({ headerText }),
  setSubText: (subText) => set({ subText }),
  setEventDate: (eventDate) => set({ eventDate }),
  addSticker: (emoji) => set((state) => ({
    stickers: [
      ...state.stickers,
      {
        id: Math.random().toString(36).substring(7),
        emoji,
        x: 50,
        y: 50,
        scale: 1,
        rotation: 0
      }
    ]
  })),
  updateSticker: (id, updates) => set((state) => ({
    stickers: state.stickers.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  removeSticker: (id) => set((state) => ({
    stickers: state.stickers.filter(s => s.id !== id)
  })),
  addFloatingReaction: (reaction) => set((state) => ({
    floatingReactions: [...state.floatingReactions, reaction]
  })),
  clearFloatingReaction: (id) => set((state) => ({
    floatingReactions: state.floatingReactions.filter(r => r.id !== id)
  })),
  resetStore: () => set({
    currentUser: null,
    room: null,
    selectedTemplate: null,
    isCameraActive: false,
    isCountdownActive: false,
    stickers: [],
    floatingReactions: []
  })
}));
