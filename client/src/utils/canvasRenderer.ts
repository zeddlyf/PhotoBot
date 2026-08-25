import { Template, PhotoFilter, Sticker } from '../types';

export interface CanvasRenderOptions {
  photos: { [slotIndex: number]: string };
  template: Template;
  headerText: string;
  subText: string;
  eventDate: string;
  filter: PhotoFilter;
  stickers: Sticker[];
}

/**
 * Draws a photo strip canvas and returns dataURL (PNG)
 */
export async function generatePhotoStripCanvas(
  options: CanvasRenderOptions
): Promise<string> {
  const { photos, template, headerText, subText, eventDate, filter, stickers } = options;

  // Standard High-Res Vertical Photo Strip (800 x 2400 px)
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 2400;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not create 2d canvas context');

  const secBg = (template.secondaryColor || '#09090b').toLowerCase();
  const isLightBg = secBg === '#ffffff' || secBg === '#ffffff' || secBg === '#f8fafc' || secBg === '#fafafa';

  const primaryTextColor = template.primaryColor || (isLightBg ? '#09090b' : '#ffffff');
  const secondaryTextColor = isLightBg ? 'rgba(9, 9, 11, 0.65)' : 'rgba(255, 255, 255, 0.7)';
  const footerSubTextColor = isLightBg ? 'rgba(9, 9, 11, 0.45)' : 'rgba(255, 255, 255, 0.5)';

  // 1. Render Background
  ctx.fillStyle = template.secondaryColor || '#09090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative frame backgrounds
  if (template.category === 'wedding') {
    // Elegant champagne gold background with subtle radial glow
    const gradient = ctx.createRadialGradient(400, 1200, 100, 400, 1200, 1200);
    gradient.addColorStop(0, '#1c1917');
    gradient.addColorStop(1, '#0c0a09');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (template.category === 'birthday') {
    // Vibrant confetti theme
    const gradient = ctx.createLinearGradient(0, 0, 800, 2400);
    gradient.addColorStop(0, '#2e1065');
    gradient.addColorStop(0.5, '#581c87');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw confetti dots
    ctx.fillStyle = template.accentColor || '#ffeb3b';
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * 800;
      const cy = Math.random() * 2400;
      const cr = 4 + Math.random() * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (template.category === 'y2k') {
    // Cyberpunk grid
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.15)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // 2. Render Outer Border
  const borderWidth = 30;
  ctx.strokeStyle = primaryTextColor;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

  // 3. Header Section
  const headerHeight = 240;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Badge Text
  if (template.badgeText) {
    ctx.fillStyle = template.accentColor || '#f43f5e';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(template.badgeText.toUpperCase(), 400, 70);
  }

  // Header Title (App Name / Custom Title)
  ctx.fillStyle = primaryTextColor;
  ctx.font = template.fontFamily === 'serif' 
    ? 'bold 54px "Cinzel", "Playfair Display", serif'
    : 'bold 52px "Outfit", "Inter", sans-serif';
  ctx.fillText(headerText || template.headerText || 'SNAP TOGETHER', 400, 130);

  // Subtitle
  ctx.fillStyle = secondaryTextColor;
  ctx.font = '500 26px "Inter", sans-serif';
  ctx.fillText(subText || template.subText || 'Studio Photo Booth', 400, 185);

  ctx.restore();

  // 4. Photo Slot Layout (4 Slots)
  const slotCount = template.slots || 4;
  const slotMargin = 40;
  const availableHeight = canvas.height - headerHeight - 160; // 160px footer reserved
  const slotHeight = (availableHeight - (slotCount - 1) * slotMargin) / slotCount;
  const slotWidth = canvas.width - 2 * slotMargin;

  for (let i = 0; i < slotCount; i++) {
    const slotX = slotMargin;
    const slotY = headerHeight + i * (slotHeight + slotMargin);

    // Slot Frame Border / Background
    ctx.fillStyle = isLightBg ? '#f4f4f5' : '#18181b';
    ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

    // Slot Inner Shadow / Border
    ctx.strokeStyle = isLightBg ? 'rgba(9, 9, 11, 0.15)' : (template.accentColor || 'rgba(255, 255, 255, 0.2)');
    ctx.lineWidth = 4;
    ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);

    const photoSrc = photos[i];
    if (photoSrc) {
      try {
        const img = await loadImage(photoSrc);
        
        ctx.save();
        // Clip to slot rectangle
        ctx.beginPath();
        ctx.rect(slotX, slotY, slotWidth, slotHeight);
        ctx.clip();

        // Apply Photo Filter Effects
        applyCanvasFilter(ctx, filter);

        // Aspect ratio cover draw
        const imgAspect = img.width / img.height;
        const slotAspect = slotWidth / slotHeight;
        let drawWidth = slotWidth;
        let drawHeight = slotHeight;
        let drawX = slotX;
        let drawY = slotY;

        if (imgAspect > slotAspect) {
          drawWidth = slotHeight * imgAspect;
          drawX = slotX - (drawWidth - slotWidth) / 2;
        } else {
          drawHeight = slotWidth / imgAspect;
          drawY = slotY - (drawHeight - slotHeight) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      } catch (err) {
        console.warn(`Failed to render image slot ${i}`, err);
      }
    } else {
      // Slot Placeholder Text
      ctx.fillStyle = isLightBg ? 'rgba(9, 9, 11, 0.35)' : 'rgba(255, 255, 255, 0.25)';
      ctx.font = '500 32px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`FRAME #${i + 1}`, slotX + slotWidth / 2, slotY + slotHeight / 2);
    }
  }

  // 5. Footer Timestamp Section
  const footerY = canvas.height - 90;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = primaryTextColor;
  ctx.font = '600 28px "Space Grotesk", monospace';
  ctx.fillText(`• ${eventDate.toUpperCase()} •`, 400, footerY);

  ctx.fillStyle = footerSubTextColor;
  ctx.font = '500 22px "Inter", sans-serif';
  ctx.fillText('SNAPTOGETHER.APP — CREATED WITH FRIENDS', 400, footerY + 40);
  ctx.restore();

  // 6. Draw Placed Stickers
  for (const sticker of stickers) {
    ctx.save();
    const sx = (sticker.x / 100) * canvas.width;
    const sy = (sticker.y / 100) * canvas.height;
    
    ctx.translate(sx, sy);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.scale(sticker.scale, sticker.scale);
    
    ctx.font = '72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, 0, 0);
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

/**
 * Load image helper
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Applies CSS Canvas Filter effects
 */
function applyCanvasFilter(ctx: CanvasRenderingContext2D, filter: PhotoFilter) {
  switch (filter) {
    case 'vintage':
      ctx.filter = 'sepia(0.5) contrast(1.1) brightness(0.95) saturate(1.3)';
      break;
    case 'bw':
      ctx.filter = 'grayscale(1) contrast(1.2) brightness(1.05)';
      break;
    case 'cyberpunk':
      ctx.filter = 'hue-rotate(290deg) saturate(1.8) contrast(1.2)';
      break;
    case 'warm':
      ctx.filter = 'sepia(0.2) saturate(1.4) brightness(1.05)';
      break;
    case 'softglow':
      ctx.filter = 'brightness(1.1) contrast(0.9) saturate(1.2)';
      break;
    case 'contrast':
      ctx.filter = 'contrast(1.4) saturate(1.2)';
      break;
    default:
      ctx.filter = 'none';
      break;
  }
}
