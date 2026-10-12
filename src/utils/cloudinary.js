/**
 * Helper to ensure Cloudinary image URLs apply dynamic transformations:
 * - f_auto (auto WebP/AVIF format)
 * - q_auto:eco (smart compression)
 * - w_{width} (responsive max width constraint)
 */
export function getOptimizedCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  const { width = 600, quality = 'auto:eco', format = 'auto', crop = 'limit' } = options;

  // Handle Unsplash image optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url);
      u.searchParams.set('auto', format === 'auto' ? 'format' : format);
      u.searchParams.set('fit', crop === 'fill' ? 'crop' : 'crop');
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', quality === 'auto:eco' ? '80' : '85');
      return u.toString();
    } catch {
      return url;
    }
  }

  if (!url.includes('res.cloudinary.com')) return url;

  if (!url.includes('/image/upload/')) return url;

  const [prefix, afterUpload] = url.split('/image/upload/');
  if (!afterUpload) return url;

  const segments = afterUpload.split('/');
  const firstSegment = segments[0];

  // Check if the first segment is a version tag (e.g., v1783029636) or public ID (no transformation parameters)
  const isVersionOrPublicId = /^v\d+$/.test(firstSegment) || !firstSegment.includes('_');

  if (isVersionOrPublicId) {
    const transformStr = `f_${format},q_${quality},w_${width}${crop ? `,c_${crop}` : ''}`;
    return `${prefix}/image/upload/${transformStr}/${segments.join('/')}`;
  }

  // First segment contains transformations (e.g., "c_limit,q_auto,w_1920" or "f_auto,q_auto,w_1200,c_fill")
  let transformTokens = firstSegment.split(',');

  let hasWidth = false;
  let hasQuality = false;
  let hasFormat = false;

  transformTokens = transformTokens.map((token) => {
    if (token.startsWith('w_')) {
      hasWidth = true;
      return width ? `w_${width}` : token;
    }
    if (token.startsWith('q_')) {
      hasQuality = true;
      return quality ? `q_${quality}` : token;
    }
    if (token.startsWith('f_')) {
      hasFormat = true;
      return format ? `f_${format}` : token;
    }
    return token;
  });

  if (!hasWidth && width) transformTokens.push(`w_${width}`);
  if (!hasQuality && quality) transformTokens.push(`q_${quality}`);
  if (!hasFormat && format) transformTokens.push(`f_${format}`);

  segments[0] = transformTokens.join(',');
  return `${prefix}/image/upload/${segments.join('/')}`;
}
