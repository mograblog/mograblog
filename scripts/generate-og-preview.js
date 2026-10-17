import sharp from 'sharp';

async function generateOgCard() {
  const width = 1200;
  const height = 630;

  // Load the transparent rose-gold silhouette logo
  const logoBuf = await sharp('public/images/brand/logo-silhouette-rose.png')
    .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
        <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)" />
      
      <!-- Decorative Glows -->
      <circle cx="280" cy="315" r="220" fill="#38bdf8" opacity="0.15" />
      <circle cx="900" cy="315" r="200" fill="#ec4899" opacity="0.10" />

      <!-- Border Frame -->
      <rect x="24" y="24" width="1152" height="582" rx="32" fill="none" stroke="#334155" stroke-width="2" opacity="0.7" />

      <!-- Typography -->
      <text x="480" y="285" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-1.5">Mograblog</text>
      <text x="480" y="355" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="600" fill="url(#subGrad)" letter-spacing="-0.5">Let’s make it work!</text>
      <text x="480" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#94a3b8">Cloud, DevOps, Architecture &amp; Engineering</text>
    </svg>
  `);

  await sharp(svgOverlay)
    .composite([
      {
        input: logoBuf,
        top: 155,
        left: 110,
      },
    ])
    .png({ quality: 100 })
    .toFile('public/images/brand/og-preview.png');

  // Also create a 1:1 square preview for WhatsApp (800x800)
  const squareLogo = await sharp('public/images/brand/logo-silhouette-rose.png')
    .resize(540, 540, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const squareSvg = Buffer.from(`
    <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sqBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sqBg)" />
      <circle cx="400" cy="400" r="300" fill="#38bdf8" opacity="0.12" />
      <rect x="20" y="20" width="760" height="760" rx="40" fill="none" stroke="#334155" stroke-width="2" opacity="0.6" />
    </svg>
  `);

  await sharp(squareSvg)
    .composite([
      {
        input: squareLogo,
        top: 130,
        left: 130,
      },
    ])
    .png({ quality: 100 })
    .toFile('public/images/brand/og-square.png');

  // Also replace public/style/images/logo_transparent.png with crisp rose gold version for backwards compatibility
  const legacyLogo = await sharp('public/images/brand/logo-silhouette-rose.png')
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp(legacyLogo).toFile('public/style/images/logo_transparent.png');
  await sharp(legacyLogo).toFile('public/style/images/logo_transparent.large.png');

  console.log('Generated og-preview.png, og-square.png, and updated legacy logo_transparent paths');
}

generateOgCard();
