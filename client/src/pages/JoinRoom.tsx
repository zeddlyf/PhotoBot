import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { UserCheck } from 'lucide-react';
import { getApiUrl } from './CreateRoom';

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
      const apiUrl = getApiUrl('/api/rooms');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', code, username: username.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setRoom(data.room);
        navigate(`/room/${code}`);
      } else {
        alert(data.message || 'Room not found. Please check your room code.');
      }
    } catch (err) {
      console.error('Join room failed', err);
      alert('Could not join room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">Join Studio Room</h1>
        <p className="text-xs text-zinc-400">Enter the 6-character room code shared by your host.</p>
      </div>

      <form onSubmit={handleJoin} className="rounded-3xl glass-panel p-6 border border-white/10 space-y-5 shadow-2xl">
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
            Room Code *
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g. AB12CD"
            className="w-full text-center text-lg font-bold tracking-widest uppercase rounded-2xl bg-white/[0.04] px-4 py-3 text-white outline-none border border-white/10 focus:border-rose-500 transition-all"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
            Your Display Name *
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Sam"
            className="w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-xs text-white outline-none border border-white/10 focus:border-rose-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !roomCode.trim() || !username.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-500 shadow-xl shadow-rose-600/25 disabled:opacity-40 transition-all"
        >
          <UserCheck className="h-4 w-4" />
          <span>{isLoading ? 'Joining Room...' : 'JOIN PHOTO BOOTH'}</span>
        </button>
      </form>
    </div>
  );
};
