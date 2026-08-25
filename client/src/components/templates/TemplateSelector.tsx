import React, { useState } from 'react';
import { Template, EventCategory } from '../../types';
import { TemplateCard } from './TemplateCard';
import { Layout, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplateId?: string;
  onSelectTemplate: (template: Template) => void;
}

const CATEGORIES: { id: EventCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'graduation', label: 'Graduation' },
  { id: 'holiday', label: 'Holiday' },
  { id: 'y2k', label: 'Y2K Retro' }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-4 rounded-2xl glass-panel p-5 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
          <Layout className="h-4 w-4 text-rose-400" />
          <span>Event Photo Strip Templates</span>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">Select Theme</span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all border ${
              activeCategory === cat.id
                ? 'bg-white text-zinc-950 font-bold border-white shadow-md'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/10 hover:text-white border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid with padding to prevent clipping */}
      <div className="p-1 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={template.id === selectedTemplateId}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
