import React, { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Box, Button, Stack, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MarkdownIcon from '@mui/icons-material/Description';
import jsPDF from 'jspdf';

const ExportButtons = () => {
  const { currentSession } = useContext(SessionContext);
  const { token } = useContext(AuthContext);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  if (!currentSession) return null;
  const jsx = currentSession.code?.jsx || '';
  const css = currentSession.code?.css || '';
  const chatHistory = currentSession.chatHistory || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(jsx + '\n\n' + css);
    setSnackbar({ open: true, message: 'Code copied!', severity: 'success' });
  };

  const handleDownload = async () => {
    try {
      const res = await axios.post('/ai/export', { jsx, css }, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'component.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setSnackbar({ open: true, message: 'ZIP downloaded!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Download failed', severity: 'error' });
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Session: ' + (currentSession.sessionName || 'Untitled'), 10, 10);
    doc.setFontSize(12);
    let y = 20;
    doc.text('Chat History:', 10, y);
    y += 8;
    chatHistory.forEach((msg, idx) => {
      doc.text(`${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`, 12, y);
      y += 8;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    y += 4;
    doc.text('JSX:', 10, y); y += 8;
    doc.setFont('courier');
    doc.setFontSize(10);
    doc.text(jsx, 12, y, { maxWidth: 180 });
    y += 8 + Math.ceil(jsx.length / 80) * 5;
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text('CSS:', 10, y); y += 8;
    doc.setFont('courier');
    doc.setFontSize(10);
    doc.text(css, 12, y, { maxWidth: 180 });
    doc.save((currentSession.sessionName || 'session') + '.pdf');
    setSnackbar({ open: true, message: 'PDF exported!', severity: 'success' });
  };

  const handleExportMarkdown = () => {
    let md = `# Session: ${currentSession.sessionName || 'Untitled'}\n\n## Chat History\n`;
    chatHistory.forEach(msg => {
      md += `- **${msg.role === 'user' ? 'You' : 'Assistant'}:** ${msg.content}\n`;
    });
    md += `\n## JSX\n\n  jsx\n${jsx}\n  \n`;
    md += `\n## CSS\n\n  css\n${css}\n  \n`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', (currentSession.sessionName || 'session') + '.md');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setSnackbar({ open: true, message: 'Markdown exported!', severity: 'success' });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" color="primary" startIcon={<ContentCopyIcon />} onClick={handleCopy} sx={{ fontWeight: 600, borderRadius: 2 }}>
          Copy Code
        </Button>
        <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleDownload} sx={{ fontWeight: 600, borderRadius: 2 }}>
          Download ZIP
        </Button>
        <Button variant="contained" color="secondary" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF} sx={{ fontWeight: 600, borderRadius: 2 }}>
          Export PDF
        </Button>
        <Button variant="outlined" color="info" startIcon={<MarkdownIcon />} onClick={handleExportMarkdown} sx={{ fontWeight: 600, borderRadius: 2 }}>
          Export Markdown
        </Button>
      </Stack>
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExportButtons; 