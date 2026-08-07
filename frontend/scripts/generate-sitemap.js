#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Gunakan URL backend lokal bila tersedia, fallback ke URL produksi
const API = process.env.API_URL || 'http://127.0.0.1:8001/api/sitemap';

(async () => {
  try {
    const response = await axios.get(API);
    const data = response.data;
    console.log('Response API:', data);

    if (!data || !Array.isArray(data.urls)) {
      console.error('⚠️ Data sitemap tidak sesuai format, harus { urls: [...] }');
      process.exit(1);
    }

    const urls = data.urls
      .map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    // Simpan ke folder public pada proyek frontend
    const outPath = path.resolve('public', 'sitemap.xml');
    fs.writeFileSync(outPath, xml.trim());
    console.log('✅ sitemap.xml berhasil digenerasi di', outPath);
  } catch (err) {
    console.error('❌ Gagal menghasilkan sitemap:', err.message);
    process.exit(1);
  }
})();
