import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { TemplateSelector } from '../components/templates/TemplateSelector';
import { DEFAULT_TEMPLATES } from '../utils/templates';
import { Camera, User as UserIcon, Settings, Timer, Users, User } from 'lucide-react';

export const getApiUrl = (endpoint: string) => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (socketUrl) return `${socketUrl}${endpoint}`;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `http://localhost:3001${endpoint}`;
  }
  return endpoint;
};

export const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setRoom, setSelectedTemplate } = useRoomStore();

  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('life4cuts_korean');
  const [boothMode, setBoothMode] = useState<'solo' | 'duo'>('duo');
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTempObj = DEFAULT_TEMPLATES.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = getApiUrl('/api/rooms');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: hostName.trim(),
          roomName: roomName.trim() || `${hostName}'s Photo Booth`,
          templateId: selectedTemplateId,
          maxPhotos: selectedTempObj.slots,
          countdownSeconds,
          boothMode
        })
      });

      const data = await res.json();
      if (data.success) {
        const hostUser = data.room.members[0];
        setCurrentUser(hostUser);
        setRoom(data.room);
        setSelectedTemplate(selectedTempObj);
        navigate(`/room/${data.roomCode}`);
      } else {
        alert(data.message || 'Failed to create room');
      }
    } catch (err) {
      console.error('Create room failed', err);
      alert('Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">Create Studio Room</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">Set up your virtual photo booth room, select an event theme, and invite remote friends.</p>
      </div>

      <form onSubmit={handleCreateRoom} className="space-y-6">
        {/* Host & Event Info Card */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
            <UserIcon className="h-4 w-4 text-rose-400" />
            <span>Host & Event Info</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                Your Host Name *
              </label>
              <input
                type="text"
                required
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-xs text-white outline-none border border-white/10 focus:border-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                Room Event Name (Optional)
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Sarah & Mark's Wedding"
                className="w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-xs text-white outline-none border border-white/10 focus:border-rose-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Photobooth Mode Selector Card (Solo vs Duo) */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <Users className="h-4 w-4 text-rose-400" />
              <span>Select Photobooth Mode</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">Solo or Multiplayer Duo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setBoothMode('solo')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                boothMode === 'solo'
                  ? 'bg-rose-500/15 border-rose-500/80 text-white shadow-lg'
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 uppercase">Solo Mode</span>
                <User className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-[11px] text-zinc-300 font-medium">1 Player Solo Session</p>
              <p className="text-[10px] text-zinc-500 mt-1">Shoot all photos sequentially by yourself across any layout.</p>
            </div>

            <div
              onClick={() => setBoothMode('duo')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                boothMode === 'duo'
                  ? 'bg-rose-500/15 border-rose-500/80 text-white shadow-lg'
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase">Duo Mode</span>
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-[11px] text-zinc-300 font-medium">2 Players Multiplayer</p>
              <p className="text-[10px] text-zinc-500 mt-1">Turn-based alternating shots or synchronized dual camera sync.</p>
            </div>
          </div>
        </div>

        {/* Capture Settings Card */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
            <Settings className="h-4 w-4 text-rose-400" />
            <span>Capture Timer Preference</span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-amber-400" />
              <span>Countdown Duration</span>
            </label>
            <select
              value={countdownSeconds}
              onChange={(e) => setCountdownSeconds(Number(e.target.value))}
              className="w-full rounded-2xl bg-zinc-900/90 px-4 py-3 text-xs text-white outline-none border border-white/10 focus:border-rose-500 transition-all"
            >
              <option value={3}>3 Seconds (Quick)</option>
              <option value={5}>5 Seconds (Standard)</option>
              <option value={10}>10 Seconds (Relaxed)</option>
            </select>
          </div>
        </div>

        {/* Template Selector */}
        <TemplateSelector
          templates={DEFAULT_TEMPLATES}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={(t) => setSelectedTemplateId(t.id)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !hostName.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-rose-500 shadow-xl shadow-rose-600/25 disabled:opacity-40 transition-all"
        >
          <Camera className="h-4 w-4" />
          <span>{isLoading ? 'Creating Room...' : `LAUNCH ${boothMode.toUpperCase()} STUDIO ROOM`}</span>
        </button>
      </form>
    </div>
  );
};
