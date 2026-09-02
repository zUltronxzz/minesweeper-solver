const fs = require('fs');
const path = require('path');

const solverCode = fs.readFileSync(path.join(__dirname, 'src', 'solver.js'), 'utf8');

// Compact minification
let code = solverCode
  .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
  .replace(/\/\/.*$/gm, '')          // remove single-line comments
  .replace(/\r\n/g, '\n')
  .replace(/[ \t]+/g, ' ')           // collapse spaces
  .replace(/\s*([=+\-*/%<>{}:;,\(\)\[\]])\s*/g, '$1') // remove space around operators
  .replace(/;\}/g, '}')              // remove trailing semicolons
  .replace(/\n+/g, '')               // remove newlines
  .trim();

// Modern browsers support raw javascript:(function(){...})() with minimal encoding
const bookmarkletUrl = `javascript:(function(){${code}})();`;

fs.writeFileSync(path.join(__dirname, 'src', 'bookmarklet.js'), bookmarkletUrl, 'utf8');
console.log('Optimized Bookmarklet generated! Length:', bookmarkletUrl.length, 'characters (~' + (bookmarkletUrl.length / 1024).toFixed(1) + ' KB)');
