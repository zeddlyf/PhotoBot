import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRoomStore } from '../store/useRoomStore';

const getSocketServerUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:3001';
  }
  return '';
};

export function useSocket(roomCode?: string) {
  const socketRef = useRef<Socket | null>(null);

  const {
    currentUser,
    setRoom,
    setCountdownActive,
    setCountdownValue,
    setCurrentSlotIndex,
    triggerShutterFlash,
    addFloatingReaction
  } = useRoomStore();

  useEffect(() => {
    const serverUrl = getSocketServerUrl();

    if (!serverUrl) {
      console.log('[Socket.IO] No socket server URL configured for production. Single-player mode active.');
      return;
    }

    // Initialize Socket Connection with Polling first for cloud load-balancers (Render / Railway)
    const socket = io(serverUrl, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to server:', socket.id);
      
      if (roomCode && currentUser) {
        socket.emit('join_room', {
          roomCode,
          userId: currentUser.id,
          username: currentUser.username
        });
      }
    });

    // Listen for room state updates
    socket.on('room_state_updated', ({ room }) => {
      setRoom(room);
    });

    // Listen for countdown start
    socket.on('countdown_started', ({ seconds, totalSlots, currentSlot }) => {
      setCountdownActive(true);
      setCountdownValue(seconds);
      setCurrentSlotIndex(currentSlot);
    });

    // Listen for countdown ticks
    socket.on('countdown_tick', ({ currentSecond, currentSlot }) => {
      setCountdownValue(currentSecond);
      setCurrentSlotIndex(currentSlot);
    });

    // Listen for shutter snap
    socket.on('shutter_snap', ({ slotIndex }) => {
      setCurrentSlotIndex(slotIndex);
      triggerShutterFlash();
    });

    // Listen for session completion
    socket.on('session_completed', ({ room }) => {
      setCountdownActive(false);
      setRoom(room);
    });

    // Listen for chat messages
    socket.on('chat_received', (message) => {
      useRoomStore.setState((state) => {
        if (!state.room) return state;
        const exists = state.room.chatMessages.some(m => m.id === message.id);
        if (exists) return state;
        return {
          room: {
            ...state.room,
            chatMessages: [...state.room.chatMessages, message]
          }
        };
      });
    });

    // Listen for floating reactions
    socket.on('reaction_received', (reaction) => {
      addFloatingReaction(reaction);
      setTimeout(() => {
        useRoomStore.getState().clearFloatingReaction(reaction.id);
      }, 3500);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, currentUser, setRoom, setCountdownActive, setCountdownValue, setCurrentSlotIndex, triggerShutterFlash, addFloatingReaction]);

  // Socket Emitters
  const toggleReady = useCallback((isReady: boolean) => {
    if (socketRef.current && roomCode && currentUser) {
      socketRef.current.emit('toggle_ready', {
        roomCode,
        userId: currentUser.id,
        readyStatus: isReady
      });
    }
  }, [roomCode, currentUser]);

  const updateTemplate = useCallback((templateId: string) => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('update_template', {
        roomCode,
        templateId
      });
    }
  }, [roomCode]);

  const startSession = useCallback(() => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('start_session', { roomCode });
    }
  }, [roomCode]);

  const sendPhotoCaptured = useCallback((slotIndex: number, photoDataUrl: string) => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('photo_captured', {
        roomCode,
        slotIndex,
        photoDataUrl
      });
    }
  }, [roomCode]);

  const sendChatMessage = useCallback((text: string) => {
    if (socketRef.current && roomCode && currentUser) {
      socketRef.current.emit('send_chat', {
        roomCode,
        userId: currentUser.id,
        username: currentUser.username,
        text
      });
    }
  }, [roomCode, currentUser]);

  const sendReaction = useCallback((emoji: string) => {
    if (socketRef.current && roomCode && currentUser) {
      const reaction = {
        id: Math.random().toString(36).substring(7),
        userId: currentUser.id,
        username: currentUser.username,
        emoji
      };
      addFloatingReaction(reaction);
      setTimeout(() => {
        useRoomStore.getState().clearFloatingReaction(reaction.id);
      }, 3500);

      socketRef.current.emit('send_reaction', {
        roomCode,
        userId: currentUser.id,
        username: currentUser.username,
        emoji
      });
    }
  }, [roomCode, currentUser, addFloatingReaction]);

  const retakeSession = useCallback(() => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('retake_session', { roomCode });
    }
  }, [roomCode]);

  return {
    socket: socketRef.current,
    toggleReady,
    updateTemplate,
    startSession,
    sendPhotoCaptured,
    sendChatMessage,
    sendReaction,
    retakeSession
  };
}
