const fs = require('fs');
const path = 'backend/seed_pgs.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/contactPhone:\s*"(\d{2})\d{4}(\d{4})"/g, 'contactPhone: "+91 $1XX XX $2"');
fs.writeFileSync(path, content);
console.log('Phones masked successfully.');
