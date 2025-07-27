import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/SessionContext';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-jsx'; // Fix: add JSX grammar
import { Tabs, Tab, Box, Paper, Typography } from '@mui/material';

const CodeTabs = () => {
  const { currentSession } = useContext(SessionContext);
  const [tab, setTab] = useState('jsx');
  if (!currentSession) return null;
  const jsx = currentSession.code?.jsx || '';
  const css = currentSession.code?.css || '';

  return (
    <Paper elevation={0} className="panel" sx={{ mb: 2 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ minHeight: 36 }}
      >
        <Tab label="JSX" value="jsx" sx={{ fontWeight: 600, minWidth: 80 }} />
        <Tab label="CSS" value="css" sx={{ fontWeight: 600, minWidth: 80 }} />
      </Tabs>
      <Box sx={{ p: 2, borderRadius: 2, maxHeight: 200, overflow: 'auto' }}>
        <pre style={{ margin: 0 }}>
          <code
            className={`language-${tab}`}
            dangerouslySetInnerHTML={{ __html: Prism.highlight(tab === 'jsx' ? jsx : css, Prism.languages[tab === 'jsx' ? 'jsx' : 'css'], tab) }}
          />
        </pre>
        {!(jsx || css) && (
          <Typography color="text.secondary" mt={2}>No code generated yet.</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CodeTabs; 