const JSZip = require('jszip');

async function createCodeZip(jsx, css) {
  const zip = new JSZip();
  zip.file('Component.jsx', jsx);
  zip.file('styles.css', css);
  return await zip.generateAsync({ type: 'nodebuffer' });
}

module.exports = { createCodeZip }; 