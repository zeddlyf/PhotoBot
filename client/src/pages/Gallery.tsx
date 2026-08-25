import React from 'react';
import { Film, Download, Sparkles, Heart, Share2 } from 'lucide-react';

const SAMPLE_GALLERY_STRIPS = [
  {
    id: '1',
    title: 'Sarah & Mark\'s Wedding',
    category: 'Wedding',
    date: 'AUG 25, 2026',
    bgColor: '#1c1917',
    primaryColor: '#e0c080',
    slots: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b']
  },
  {
    id: '2',
    title: 'Alex 25th Birthday Bash',
    category: 'Birthday',
    date: 'AUG 24, 2026',
    bgColor: '#2e1065',
    primaryColor: '#ff4081',
    slots: ['#8b5cf6', '#ec4899', '#f43f5e', '#eab308']
  },
  {
    id: '3',
    title: 'Class of 2026 Honors',
    category: 'Graduation',
    date: 'AUG 20, 2026',
    bgColor: '#0b1329',
    primaryColor: '#1e3a8a',
    slots: ['#1d4ed8', '#0284c7', '#0f766e', '#d97706']
  }
];

export const Gallery: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
          <Film className="h-3.5 w-3.5 text-rose-400" />
          <span>Event Gallery & Guestbook</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-100">Saved Photo Strips</h1>
        <p className="text-xs text-zinc-400">Explore memories captured by photo booth rooms.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_GALLERY_STRIPS.map((strip) => (
          <div
            key={strip.id}
            className="rounded-3xl glass-panel p-5 border border-zinc-800 space-y-4 glass-card-hover"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-300 uppercase border border-zinc-700">
                {strip.category}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">{strip.date}</span>
            </div>

            {/* Visual Strip Mockup */}
            <div
              className="aspect-[1/2.8] w-full max-w-[200px] mx-auto rounded-2xl p-3 flex flex-col justify-between items-center text-center shadow-2xl"
              style={{
                backgroundColor: strip.bgColor,
                border: `3px solid ${strip.primaryColor}`
              }}
            >
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-rose-400">SNAP TOGETHER</span>
                <h4 className="text-xs font-bold text-white truncate max-w-[140px]">{strip.title}</h4>
              </div>

              <div className="w-full space-y-1.5 my-2">
                {strip.slots.map((color, idx) => (
                  <div
                    key={idx}
                    className="h-10 w-full rounded-lg bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    PHOTO #{idx + 1}
                  </div>
                ))}
              </div>

              <span className="text-[8px] text-zinc-400 font-mono">• {strip.date} •</span>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-zinc-200">{strip.title}</h3>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>4 Captured Shots</span>
                <span className="flex items-center gap-1 text-rose-400">
                  <Heart className="h-3.5 w-3.5 fill-rose-400" /> 12
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
