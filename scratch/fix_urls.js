const fs = require('fs');
const path = 'backend/seed_pgs.js';
let content = fs.readFileSync(path, 'utf8');

// Replace the two broken URLs with known good ones
content = content.replace(/photo-1595526114101-11c97a89279a/g, 'photo-1522771739844-6a9f6d5f14af');
content = content.replace(/photo-1502672260266-1c1cd2cb936c/g, 'photo-1512918728675-ed5a9ecdebfd');

fs.writeFileSync(path, content);
console.log('Fixed broken image URLs in seed_pgs.js');
