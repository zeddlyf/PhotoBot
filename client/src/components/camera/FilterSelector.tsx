import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { PhotoFilter } from '../../types';
import { Sliders } from 'lucide-react';

const FILTERS: { id: PhotoFilter; label: string; previewClass: string }[] = [
  { id: 'normal', label: 'Normal', previewClass: '' },
  { id: 'vintage', label: 'Vintage Sepia', previewClass: 'sepia contrast-125' },
  { id: 'bw', label: 'Noir B&W', previewClass: 'grayscale contrast-150' },
  { id: 'cyberpunk', label: 'Cyberpunk', previewClass: 'hue-rotate-270 saturate-200' },
  { id: 'warm', label: 'Golden Warmth', previewClass: 'sepia-50 saturate-150' },
  { id: 'softglow', label: 'Soft Glow', previewClass: 'brightness-110 blur-[0.3px]' },
  { id: 'contrast', label: 'High Contrast', previewClass: 'contrast-150 saturate-125' }
];

export const FilterSelector: React.FC = () => {
  const { activeFilter, setActiveFilter } = useRoomStore();

  return (
    <div className="space-y-3 rounded-2xl glass-panel p-4 border border-white/10">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Sliders className="h-4 w-4 text-rose-400" />
        <span>Live Camera Filters</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex flex-col items-center gap-1.5 shrink-0 rounded-2xl p-2.5 transition-all border ${
              activeFilter === f.id
                ? 'bg-rose-500/15 text-white border-rose-500/60 shadow-lg shadow-rose-500/10'
                : 'bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 border-white/5'
            }`}
          >
            <div className={`h-10 w-12 rounded-xl bg-zinc-800 overflow-hidden ${f.previewClass}`}>
              <div className="h-full w-full bg-gradient-to-tr from-rose-500/40 via-amber-500/40 to-indigo-500/40" />
            </div>
            <span className="text-[11px] font-semibold">{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
