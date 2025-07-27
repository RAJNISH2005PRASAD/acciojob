import React, { useContext, useRef, useEffect } from 'react';
import { SessionContext } from '../context/SessionContext';
import { Box, Paper, Typography } from '@mui/material';

const Preview = () => {
  const { currentSession } = useContext(SessionContext);
  const iframeRef = useRef();

  useEffect(() => {
    if (!currentSession || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    const jsx = currentSession.code?.jsx || '';
    const css = currentSession.code?.css || '';
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${jsx}
          </script>
        </body>
      </html>
    `);
    doc.close();
  }, [currentSession]);

  if (!currentSession || !currentSession.code?.jsx) {
    return (
      <Paper elevation={0} sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.10)' }}>
        <Typography color="text.secondary">No component generated yet. Start a chat to generate code!</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
      <iframe
        ref={iframeRef}
        title="Component Preview"
        style={{ width: '100%', height: '100%', border: 'none', background: 'white', borderRadius: 8 }}
        sandbox="allow-scripts"
      />
    </Box>
  );
};

export default Preview; 