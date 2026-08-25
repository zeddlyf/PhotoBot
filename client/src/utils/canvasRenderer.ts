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

  const is8CutGrid = template.slots === 8 || template.aspectRatio === '2x4' || template.id === 'life4cuts_korean';
  const isDual4Cut = template.aspectRatio === '2x2' || template.id === 'dual_4cuts';

  const canvas = document.createElement('canvas');
  if (is8CutGrid) {
    canvas.width = 1200;
    canvas.height = 1800;
  } else if (isDual4Cut) {
    canvas.width = 1200;
    canvas.height = 1350;
  } else {
    canvas.width = 800;
    canvas.height = 2400;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2d canvas context');

  const secBg = (template.secondaryColor || '#09090b').toLowerCase();
  const isLightBg = secBg === '#ffffff' || secBg === '#f8fafc' || secBg === '#fafafa';

  const primaryTextColor = template.primaryColor || (isLightBg ? '#09090b' : '#ffffff');
  const secondaryTextColor = isLightBg ? 'rgba(9, 9, 11, 0.65)' : 'rgba(255, 255, 255, 0.7)';
  const footerSubTextColor = isLightBg ? 'rgba(9, 9, 11, 0.45)' : 'rgba(255, 255, 255, 0.5)';

  // 1. Render Background Fills
  ctx.fillStyle = template.secondaryColor || (is8CutGrid || isDual4Cut ? '#0a0a0a' : '#09090b');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative Theme Backgrounds
  if (template.category === 'wedding') {
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 1200);
    gradient.addColorStop(0, '#1c1917');
    gradient.addColorStop(1, '#0c0a09');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (template.category === 'birthday') {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2e1065');
    gradient.addColorStop(0.5, '#581c87');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Dual Grid Renderer (2 Columns: Left = Host, Right = Joiner)
  if (is8CutGrid || isDual4Cut) {
    const outerMargin = 40;
    const footerHeight = 200;
    const gridWidth = canvas.width - 2 * outerMargin;
    const gridHeight = canvas.height - outerMargin - footerHeight;

    const cols = 2;
    const rows = is8CutGrid ? 4 : 2;
    const gapX = 30;
    const gapY = 30;

    const slotWidth = (gridWidth - (cols - 1) * gapX) / cols;
    const slotHeight = (gridHeight - (rows - 1) * gapY) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const slotX = outerMargin + c * (slotWidth + gapX);
        const slotY = outerMargin + r * (slotHeight + gapY);

        // Slot Frame Box
        ctx.fillStyle = isLightBg ? '#f4f4f5' : '#18181b';
        ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

        const photoSrc = photos[i];
        if (photoSrc) {
          try {
            const img = await loadImage(photoSrc);
            ctx.save();
            ctx.beginPath();
            ctx.rect(slotX, slotY, slotWidth, slotHeight);
            ctx.clip();

            applyCanvasFilter(ctx, filter);

            // Aspect-fill crop (Center Cover)
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
          // Role Placeholder Text (Left Column = Host, Right Column = Joiner)
          const roleLabel = c === 0 ? `HOST (SLOT #${i + 1})` : `JOINER (SLOT #${i + 1})`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(roleLabel, slotX + slotWidth / 2, slotY + slotHeight / 2);
        }
      }
    }

    // Grid Footer Section
    const footerY = canvas.height - footerHeight / 2 - 10;
    ctx.save();
    ctx.textAlign = 'center';

    ctx.fillStyle = primaryTextColor;
    ctx.font = 'bold 52px "Outfit", "Inter", sans-serif';
    ctx.fillText(headerText || template.headerText || (is8CutGrid ? '인생네컷' : 'DUAL 4 CUTS'), canvas.width / 2, footerY - 20);

    ctx.fillStyle = secondaryTextColor;
    ctx.font = '600 22px "Space Grotesk", sans-serif';
    ctx.fillText((subText || template.subText || 'PAIR PHOTO BOOTH').toUpperCase(), canvas.width / 2, footerY + 28);

    ctx.fillStyle = footerSubTextColor;
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText(`• ${eventDate.toUpperCase()} • STAGE STUDIO`, canvas.width / 2, footerY + 62);
    ctx.restore();

  } else {
    // 4-Slot Vertical Polaroid Strip Renderer (Turn-Based Alternating Host & Joiner)
    const borderWidth = 30;
    ctx.strokeStyle = primaryTextColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

    const headerHeight = 240;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (template.badgeText) {
      ctx.fillStyle = template.accentColor || '#f43f5e';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(template.badgeText.toUpperCase(), 400, 70);
    }

    ctx.fillStyle = primaryTextColor;
    ctx.font = template.fontFamily === 'serif' 
      ? 'bold 54px "Cinzel", "Playfair Display", serif'
      : 'bold 52px "Outfit", "Inter", sans-serif';
    ctx.fillText(headerText || template.headerText || 'SNAP TOGETHER', 400, 130);

    ctx.fillStyle = secondaryTextColor;
    ctx.font = '500 26px "Inter", sans-serif';
    ctx.fillText(subText || template.subText || 'Studio Photo Booth', 400, 185);
    ctx.restore();

    const slotCount = template.slots || 4;
    const slotMargin = 40;
    const availableHeight = canvas.height - headerHeight - 160;
    const slotHeight = (availableHeight - (slotCount - 1) * slotMargin) / slotCount;
    const slotWidth = canvas.width - 2 * slotMargin;

    for (let i = 0; i < slotCount; i++) {
      const slotX = slotMargin;
      const slotY = headerHeight + i * (slotHeight + slotMargin);

      ctx.fillStyle = isLightBg ? '#f4f4f5' : '#18181b';
      ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

      ctx.strokeStyle = isLightBg ? 'rgba(9, 9, 11, 0.15)' : (template.accentColor || 'rgba(255, 255, 255, 0.2)');
      ctx.lineWidth = 4;
      ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);

      const photoSrc = photos[i];
      if (photoSrc) {
        try {
          const img = await loadImage(photoSrc);
          ctx.save();
          ctx.beginPath();
          ctx.rect(slotX, slotY, slotWidth, slotHeight);
          ctx.clip();

          applyCanvasFilter(ctx, filter);

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
        const turnLabel = i % 2 === 0 ? `HOST (SHOT #${i + 1})` : `JOINER (SHOT #${i + 1})`;
        ctx.fillStyle = isLightBg ? 'rgba(9, 9, 11, 0.35)' : 'rgba(255, 255, 255, 0.25)';
        ctx.font = '500 30px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(turnLabel, slotX + slotWidth / 2, slotY + slotHeight / 2);
      }
    }

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
  }

  // Draw Placed Stickers
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

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
