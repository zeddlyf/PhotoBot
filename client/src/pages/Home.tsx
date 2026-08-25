import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Users, Sparkles, ArrowRight, Play, Film } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      navigate(`/join?code=${joinCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Minimalist Hero Section */}
      <section className="relative pt-12 pb-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-rose-300 border border-white/10 shadow-sm backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" />
          <span>Real-Time Multiplayer Online Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Capture Synchronized Moments <br />
          <span className="text-rose-500">With Remote Friends</span>
        </h1>

        <p className="text-sm sm:text-lg text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          Create a virtual photo booth room, sync webcam countdowns across participants, and render stunning high-DPI event photo strips in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-full bg-rose-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20 hover:scale-[1.02] transition-all duration-300"
          >
            <Camera className="h-4 w-4" />
            <span>Create Studio Room</span>
          </button>

          <form onSubmit={handleQuickJoin} className="w-full sm:w-auto flex items-center gap-2 rounded-full glass-panel p-1.5 border border-white/10">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE"
              maxLength={6}
              className="w-36 bg-transparent px-4 py-2 text-xs font-bold tracking-widest text-center text-white placeholder-zinc-500 outline-none uppercase"
            />
            <button
              type="submit"
              disabled={!joinCode.trim()}
              className="flex items-center justify-center rounded-full bg-zinc-800 px-5 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 transition-all"
            >
              <span>Join</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </form>
        </div>
      </section>

      {/* Feature Highlights Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl glass-panel p-7 border border-white/10 space-y-4 glass-card-hover">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-100">Live Video Lobby</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Multi-user room lobby with live webcam feeds, ready toggles, in-room chat, and real-time floating emoji reactions.
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-7 border border-white/10 space-y-4 glass-card-hover">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Play className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-100">Synchronized Burst Snap</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Synchronized 3.. 2.. 1 shutter flash sequence across all participant webcams simultaneously in multi-shot burst mode.
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-7 border border-white/10 space-y-4 glass-card-hover">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Film className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-zinc-100">HTML5 Canvas Engine</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Customizable photo strips for Wedding, Birthday, Graduation, & Y2K themes with custom text, stickers, and mobile QR downloads.
          </p>
        </div>
      </section>

      {/* Aesthetic Event Themes Showcase */}
      <section className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 space-y-6 text-center relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">CURATED THEMES</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Professional Event Layouts
          </h2>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto">
            Choose from elegant wedding champagne gold, birthday party confetti, class honors, pine holiday, and noir minimalist layouts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {[
            { label: 'Wedding', desc: 'Champagne Gold' },
            { label: 'Birthday', desc: 'Party Confetti' },
            { label: 'Graduation', desc: 'Class Honors' },
            { label: 'Holiday', desc: 'Festive Pine' },
            { label: 'Minimalist', desc: 'Noir Dark' },
            { label: 'Y2K Retro', desc: 'Neon Cyberpunk' }
          ].map((theme) => (
            <div key={theme.label} className="rounded-2xl bg-white/[0.03] p-3 text-center border border-white/5 space-y-1 hover:border-rose-500/30 transition-all">
              <div className="text-xs font-bold text-zinc-200">{theme.label}</div>
              <div className="text-[10px] text-zinc-500">{theme.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
