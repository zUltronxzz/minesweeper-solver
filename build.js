const fs = require('fs');
const path = require('path');

const solverCode = fs.readFileSync(path.join(__dirname, 'src', 'solver.js'), 'utf8');

// Minify
const minified = solverCode
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '')
  .replace(/\r\n/g, '\n')
  .replace(/[ \t]+/g, ' ')
  .replace(/\s*([=+\-*/%<>{}:;,\(\)\[\]])\s*/g, '$1')
  .replace(/;\}/g, '}')
  .replace(/\n+/g, '')
  .trim();

const bookmarkletUrl = `javascript:(function(){${minified}})();`;
fs.writeFileSync(path.join(__dirname, 'src', 'bookmarklet.js'), bookmarkletUrl, 'utf8');

// Sync into index.html
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/id="bookmarklet-link" href=".*?"/m, `id="bookmarklet-link" href="${bookmarkletUrl.replace(/"/g, '&quot;')}"`);
  
  const inject = `const rawBookmarklet = ${JSON.stringify(bookmarkletUrl)};
      bookmarkletLink.href = rawBookmarklet;
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(rawBookmarklet).then(() => {
          copyBtn.innerHTML = '<span>✅ Copied Code!</span>';
          setTimeout(() => copyBtn.innerHTML = '<span>📋 Copy Bookmarklet Code</span>', 2000);
        });
      };`;

  html = html.replace(/const rawBookmarklet = [\s\S]*?copyBtn\.innerHTML = '<span>📋 Copy Bookmarklet Code<\/span>', 2000\);\n\s*\}\);\n\s*\};/m, inject);
  fs.writeFileSync(indexPath, html, 'utf8');
}

console.log(`Bookmarklet generated (${(bookmarkletUrl.length / 1024).toFixed(1)} KB) and synced with index.html.`);
