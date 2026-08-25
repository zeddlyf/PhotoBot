import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import { TemplateSelector } from '../components/templates/TemplateSelector';
import { DEFAULT_TEMPLATES } from '../utils/templates';
import { Camera, Sparkles, User as UserIcon, Settings, Layers, Timer } from 'lucide-react';

export const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setRoom, setSelectedTemplate } = useRoomStore();

  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('wedding_champagne');
  const [maxPhotos, setMaxPhotos] = useState(4);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTempObj = DEFAULT_TEMPLATES.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    setIsLoading(true);
    try {
      const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
      const res = await fetch(`${serverUrl}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: hostName.trim(),
          roomName: roomName.trim() || `${hostName}'s Photo Booth`,
          templateId: selectedTemplateId,
          maxPhotos,
          countdownSeconds
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

        {/* Capture Settings Card */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
            <Settings className="h-4 w-4 text-rose-400" />
            <span>Capture Preferences</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-rose-400" />
                <span>Strip Frame Slots</span>
              </label>
              <select
                value={maxPhotos}
                onChange={(e) => setMaxPhotos(Number(e.target.value))}
                className="w-full rounded-2xl bg-zinc-900/90 px-4 py-3 text-xs text-white outline-none border border-white/10 focus:border-rose-500 transition-all"
              >
                <option value={3}>3 Photos</option>
                <option value={4}>4 Photos (Standard Vertical Strip)</option>
                <option value={6}>6 Photos (Full Collage)</option>
              </select>
            </div>
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
          <span>{isLoading ? 'Creating Room...' : 'LAUNCH STUDIO ROOM'}</span>
        </button>
      </form>
    </div>
  );
};
