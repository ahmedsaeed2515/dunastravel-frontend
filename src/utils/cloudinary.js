/**
 * Helper to ensure Cloudinary image URLs apply dynamic transformations:
 * - f_auto (auto WebP/AVIF format)
 * - q_auto:eco (smart compression)
 * - w_{width} (responsive max width constraint)
 */
export function getOptimizedCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;

  const { width = 800, quality = 'auto:eco', format = 'auto', crop } = options;

  // Build transformation string
  const transforms = [];
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (crop) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');

  // Check if URL already has transformations between /upload/ and /v... or public ID
  if (url.includes('/image/upload/')) {
    // If it already has transformations (e.g., /upload/v1234 or /upload/w_100/v1234)
    const parts = url.split('/image/upload/');
    const afterUpload = parts[1];

    // Check if afterUpload already starts with parameters like f_auto or v123
    if (afterUpload.startsWith('f_auto') || afterUpload.startsWith('q_auto') || afterUpload.startsWith('w_') || afterUpload.startsWith('e_')) {
      // Replace existing parameters if needed, or if it doesn't have w_, inject w_
      if (!afterUpload.includes('w_') && width) {
        return parts[0] + '/image/upload/' + transformString + '/' + afterUpload;
      }
      return url;
    }

    return parts[0] + '/image/upload/' + transformString + '/' + afterUpload;
  }

  return url;
}
