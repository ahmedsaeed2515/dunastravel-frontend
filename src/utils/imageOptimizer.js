/**
 * imageOptimizer.js — Intelligent Responsive Image URL Transformer
 * 
 * Automatically ensures CDN images (Cloudinary, Unsplash) request optimal dimensions,
 * WebP/AVIF auto-formatting, and quality compression without requiring manual asset regeneration.
 */

export function optimizeImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  const width = options.width || 800;
  const quality = options.quality || 75;

  // 1. Unsplash: optimize width, quality and WebP format
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url);
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', String(quality));
      return u.toString();
    } catch {
      return url;
    }
  }

  // 2. Cloudinary: insert f_auto,q_auto,w_{width},c_limit into upload path
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    // Skip if already explicitly transformed with f_auto or specific dimensions
    if (url.includes('/f_auto') || url.includes('/w_')) {
      return url;
    }
    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  // 3. Lexica: convert full_webp or full_jpg to md2 when width <= 1280
  if (url.includes('image.lexica.art/') && (url.includes('/full_webp/') || url.includes('/full_jpg/'))) {
    if (width <= 1280) {
      return url.replace(/\/full_(webp|jpg)\//, '/md2/');
    }
  }

  return url;
}

export default optimizeImageUrl;
