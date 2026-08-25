import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { Users, ArrowRight, UserCheck } from 'lucide-react';

export const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setCurrentUser, setRoom } = useRoomStore();

  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !username.trim()) return;

    const code = roomCode.trim().toUpperCase();
    setIsLoading(true);

    try {
      const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
      const res = await fetch(`${serverUrl}/api/rooms/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setRoom(data.room);
        navigate(`/room/${code}`);
      } else {
        alert(data.message || 'Room not found');
      }
    } catch (err) {
      console.error('Join room failed', err);
      alert('Could not join room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">Join Photo Booth Room</h1>
        <p className="text-xs text-zinc-400">Enter the 6-character room code shared by your host.</p>
      </div>

      <form onSubmit={handleJoin} className="rounded-2xl glass-panel p-6 border border-zinc-800 space-y-5 shadow-2xl">
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Room Code *
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g. AB12CD"
            className="w-full text-center text-lg font-bold tracking-widest uppercase rounded-xl bg-zinc-900 px-3.5 py-3 text-white outline-none border border-zinc-800 focus:border-rose-500 transition-all"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Your Guest Display Name *
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Sam"
            className="w-full rounded-xl bg-zinc-900 px-3.5 py-2.5 text-xs text-white outline-none border border-zinc-800 focus:border-rose-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !roomCode.trim() || !username.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-500 shadow-xl shadow-rose-600/30 disabled:opacity-40 transition-all"
        >
          <UserCheck className="h-4 w-4" />
          <span>{isLoading ? 'Joining Room...' : 'JOIN PHOTO BOOTH'}</span>
        </button>
      </form>
    </div>
  );
};
