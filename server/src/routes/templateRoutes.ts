import { Router } from 'express';

const router = Router();

export const DEFAULT_TEMPLATES = [
  {
    id: 'life4cuts_korean',
    name: 'Life 4 Cuts (인생네컷 8-Cut)',
    category: 'minimalist',
    primaryColor: '#ffffff',
    secondaryColor: '#0a0a0a',
    accentColor: '#e11d48',
    fontFamily: 'sans-serif',
    headerText: '인생네컷',
    subText: 'JIEUN FOUR CUTS',
    badgeText: 'KOREAN 8-CUTS',
    frameStyle: 'life4cuts_grid',
    slots: 8,
    aspectRatio: '2x4'
  },
  {
    id: 'studio_clean_white',
    name: 'Clean Studio White',
    category: 'minimalist',
    primaryColor: '#09090b',
    secondaryColor: '#ffffff',
    accentColor: '#f43f5e',
    fontFamily: 'sans-serif',
    headerText: 'SNAP TOGETHER',
    subText: 'Studio Photo Booth',
    badgeText: 'STUDIO EDITION',
    frameStyle: 'clean_white',
    slots: 4,
    aspectRatio: '2x6'
  },
  {
    id: 'wedding_champagne',
    name: 'Wedding Elegance',
    category: 'wedding',
    primaryColor: '#e0c080',
    secondaryColor: '#1a1816',
    accentColor: '#d4af37',
    fontFamily: 'serif',
    headerText: 'Forever & Always',
    subText: 'Celebration of Love',
    badgeText: 'WEDDING DAY',
    frameStyle: 'gold_border',
    slots: 4,
    aspectRatio: '2x6'
  },
  {
    id: 'birthday_bash',
    name: 'Party Confetti',
    category: 'birthday',
    primaryColor: '#ff4081',
    secondaryColor: '#180028',
    accentColor: '#ffeb3b',
    fontFamily: 'sans-serif',
    headerText: 'Happy Birthday!',
    subText: 'Let\'s Celebrate',
    badgeText: 'PARTY TIME',
    frameStyle: 'vibrant_gradient',
    slots: 4,
    aspectRatio: '2x6'
  },
  {
    id: 'graduation_honors',
    name: 'Class Honors',
    category: 'graduation',
    primaryColor: '#1e3a8a',
    secondaryColor: '#0b1329',
    accentColor: '#f59e0b',
    fontFamily: 'serif',
    headerText: 'Class of 2026',
    subText: 'The Future is Ours',
    badgeText: 'GRADUATE',
    frameStyle: 'academic_badge',
    slots: 4,
    aspectRatio: '2x6'
  },
  {
    id: 'holiday_vibes',
    name: 'Holiday Festivities',
    category: 'holiday',
    primaryColor: '#15803d',
    secondaryColor: '#052e16',
    accentColor: '#ef4444',
    fontFamily: 'serif',
    headerText: 'Season\'s Greetings',
    subText: 'Warm Wishes & Joy',
    badgeText: 'HOLIDAY MEMORIES',
    frameStyle: 'pine_wreath',
    slots: 4,
    aspectRatio: '2x6'
  },
  {
    id: 'modern_minimal',
    name: 'Noir Minimalist',
    category: 'minimalist',
    primaryColor: '#ffffff',
    secondaryColor: '#09090b',
    accentColor: '#a1a1aa',
    fontFamily: 'sans-serif',
    headerText: 'SNAP TOGETHER',
    subText: 'Live Online Booth',
    badgeText: 'LIMITED EDITION',
    frameStyle: 'clean_polaroid',
    slots: 4,
    aspectRatio: '2x6'
  },
  {
    id: 'y2k_retro',
    name: 'Y2K Cyberpunk',
    category: 'y2k',
    primaryColor: '#00ffcc',
    secondaryColor: '#0d001a',
    accentColor: '#ff007f',
    fontFamily: 'monospace',
    headerText: 'CYBER_SNAP_2000',
    subText: 'SYNTHWAVE MEMORIES',
    badgeText: 'NEON MATRIX',
    frameStyle: 'neon_grid',
    slots: 4,
    aspectRatio: '2x6'
  }
];

router.get('/', (_req, res) => {
  res.json({ success: true, templates: DEFAULT_TEMPLATES });
});

router.get('/:id', (req, res) => {
  const template = DEFAULT_TEMPLATES.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ success: false, message: 'Template not found' });
  }
  res.json({ success: true, template });
});

export default router;
