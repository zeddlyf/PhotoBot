import React from 'react';
import { Template } from '../../types';
import { Check } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl p-3.5 transition-all duration-200 glass-card border ${
        isSelected
          ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/50'
          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      {/* Category Badge & Checkmark */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-300 border border-white/10">
          {template.category}
        </span>
        {isSelected && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Frame Visual Preview Mockup */}
      <div
        className="w-full rounded-xl p-2 flex flex-col justify-between items-center text-center shadow-inner relative overflow-hidden h-44"
        style={{
          backgroundColor: template.secondaryColor || '#09090b',
          border: `2px solid ${template.primaryColor || '#ffffff'}`
        }}
      >
        <div className="space-y-0.5">
          <span
            className="text-[8px] font-bold block"
            style={{ color: template.accentColor || '#f43f5e' }}
          >
            {template.badgeText}
          </span>
          <span
            className="text-[10px] font-bold block leading-tight truncate max-w-[110px]"
            style={{ color: template.primaryColor || '#ffffff' }}
          >
            {template.headerText}
          </span>
        </div>

        {/* Mock Slots */}
        <div className="w-full space-y-0.5 my-1">
          {[1, 2, 3, 4].map((slot) => (
            <div
              key={slot}
              className="h-5 w-full rounded bg-zinc-800/60 border border-white/10 flex items-center justify-center text-[7px] font-medium text-zinc-400"
            >
              SHOT #{slot}
            </div>
          ))}
        </div>

        <span
          className="text-[7px] font-medium opacity-70"
          style={{ color: template.primaryColor || '#ffffff' }}
        >
          SNAPTOGETHER
        </span>
      </div>

      <div className="mt-2.5 space-y-0.5">
        <h4 className="text-xs font-bold text-zinc-100 truncate">{template.name}</h4>
        <p className="text-[10px] text-zinc-400">{template.slots} Slots • Vertical 2×6"</p>
      </div>
    </div>
  );
};
