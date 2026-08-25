import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Smile } from 'lucide-react';

const STICKER_SETS = [
  { category: 'Celebration', items: ['💍', '👑', '🎉', '🥂', '🍾', '💐', '🎂', '🎈', '🎁', '🎓'] },
  { category: 'Expressive', items: ['❤️', '🔥', '✨', '⭐', '😎', '🥳', '📸', '🕶️', '✌️', '💋'] },
  { category: 'Badges', items: ['💯', '🏆', '🌟', '💖', '🎀', '💎', '🚀', '⚡', '🌈', '🌸'] }
];

export const StickerPicker: React.FC = () => {
  const { addSticker } = useRoomStore();

  return (
    <div className="space-y-3 rounded-2xl glass-panel p-4 border border-zinc-800">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Smile className="h-4 w-4 text-rose-400" />
        <span>Add Stickers & Stamp Decorations</span>
      </div>

      <div className="space-y-3">
        {STICKER_SETS.map((set) => (
          <div key={set.category} className="space-y-1.5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">{set.category}</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {set.items.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900/60 text-lg hover:bg-zinc-800 hover:scale-125 transition-all"
                  title="Click to place on strip"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
