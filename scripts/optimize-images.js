import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function optimizeImages() {
  console.log('--- Optimizing static WebP images with Sharp ---');

  // 1. Pyramids Search BG (/images/pyramids-search-bg.webp)
  const pyramidsPath = path.join(projectRoot, 'public/images/pyramids-search-bg.webp');
  if (fs.existsSync(pyramidsPath)) {
    const inputBuffer = fs.readFileSync(pyramidsPath);
    const meta = await sharp(inputBuffer).metadata();
    console.log(`Original pyramids-search-bg.webp: ${meta.width}x${meta.height}`);
    const outBuffer = await sharp(inputBuffer)
      .webp({ quality: 78, reductionEffort: 6 })
      .toBuffer();
    fs.writeFileSync(pyramidsPath, outBuffer);
    console.log(`Optimized pyramids-search-bg.webp: ${fs.statSync(pyramidsPath).size} bytes`);
  }

  // 2. Egypt Hero (/imgs/egyothero.webp)
  const egyotheroPath = path.join(projectRoot, 'public/imgs/egyothero.webp');
  if (fs.existsSync(egyotheroPath)) {
    const inputBuffer = fs.readFileSync(egyotheroPath);
    const meta = await sharp(inputBuffer).metadata();
    console.log(`Original egyothero.webp: ${meta.width}x${meta.height}`);
    const outBuffer = await sharp(inputBuffer)
      .webp({ quality: 75, reductionEffort: 6 })
      .toBuffer();
    fs.writeFileSync(egyotheroPath, outBuffer);
    console.log(`Optimized egyothero.webp: ${fs.statSync(egyotheroPath).size} bytes`);
  }

  // 3. Cairo Night Photo (/images/cairo-night-photo.webp) - displayed at ~364x364
  const cairoNightPath = path.join(projectRoot, 'public/images/cairo-night-photo.webp');
  if (fs.existsSync(cairoNightPath)) {
    const inputBuffer = fs.readFileSync(cairoNightPath);
    const meta = await sharp(inputBuffer).metadata();
    console.log(`Original cairo-night-photo.webp: ${meta.width}x${meta.height}`);
    const outBuffer = await sharp(inputBuffer)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80, reductionEffort: 6 })
      .toBuffer();
    fs.writeFileSync(cairoNightPath, outBuffer);
    console.log(`Optimized cairo-night-photo.webp: ${fs.statSync(cairoNightPath).size} bytes`);
  }

  // 4. Logo (/dunas-travel-logo.webp) - displayed at ~173x85
  const logoPath = path.join(projectRoot, 'public/dunas-travel-logo.webp');
  if (fs.existsSync(logoPath)) {
    const inputBuffer = fs.readFileSync(logoPath);
    const meta = await sharp(inputBuffer).metadata();
    console.log(`Original dunas-travel-logo.webp: ${meta.width}x${meta.height}`);
    const outBuffer = await sharp(inputBuffer)
      .resize(200, 98, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 85, reductionEffort: 6 })
      .toBuffer();
    fs.writeFileSync(logoPath, outBuffer);
    console.log(`Optimized dunas-travel-logo.webp: ${fs.statSync(logoPath).size} bytes`);
  }

  // 5. Plane Icon (/images/plane-icon.webp) - displayed at ~80x42
  const planeIconPath = path.join(projectRoot, 'public/images/plane-icon.webp');
  if (fs.existsSync(planeIconPath)) {
    const inputBuffer = fs.readFileSync(planeIconPath);
    const meta = await sharp(inputBuffer).metadata();
    console.log(`Original plane-icon.webp: ${meta.width}x${meta.height}`);
    const outBuffer = await sharp(inputBuffer)
      .resize(100, 53, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 85, reductionEffort: 6 })
      .toBuffer();
    fs.writeFileSync(planeIconPath, outBuffer);
    console.log(`Optimized plane-icon.webp: ${fs.statSync(planeIconPath).size} bytes`);
  }

  console.log('--- Image Optimization Completed ---');
}

optimizeImages().catch(console.error);
