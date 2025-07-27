const axios = require('axios');
const { createCodeZip } = require('../utils/zipUtils');

exports.generateComponent = async (req, res) => {
  // Mocked response for testing
  res.json({ aiResult: JSON.stringify({
    jsx: `function MyComponent() { return <button style={{color: 'blue'}}>Hello World</button>; }
ReactDOM.createRoot(document.getElementById('root')).render(<MyComponent />);`,
    css: `button { font-size: 1.2rem; padding: 10px 20px; border-radius: 6px; }`
  }) });
};

exports.exportCode = async (req, res) => {
  try {
    const { jsx, css } = req.body;
    const zipBuffer = await createCodeZip(jsx, css);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=component.zip'
    });
    res.send(zipBuffer);
  } catch (err) {
    res.status(500).json({ message: 'Export error', error: err.message });
  }
}; 