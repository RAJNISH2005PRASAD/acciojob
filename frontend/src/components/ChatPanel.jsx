import React, { useContext, useState, useRef, useEffect } from 'react';
import { SessionContext } from '../context/SessionContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Paper, List, ListItem, ListItemText, InputAdornment, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonIcon from '@mui/icons-material/Person';

const ChatPanel = () => {
  const { currentSession, updateSession } = useContext(SessionContext);
  const { token } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession]);

  if (!currentSession) return <Typography color="text.secondary">Select or create a session.</Typography>;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    const newChat = [
      ...(currentSession.chatHistory || []),
      { role: 'user', content: input, timestamp: new Date() }
    ];
    try {
      const res = await axios.post('/ai/generate', {
        prompt: input,
        code: currentSession.code,
        chatHistory: newChat.map(({ role, content }) => ({ role, content }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let aiResult = {};
      try { aiResult = JSON.parse(res.data.aiResult); } catch {}
      const updatedSession = {
        ...currentSession,
        chatHistory: [
          ...newChat,
          { role: 'assistant', content: res.data.aiResult, timestamp: new Date() }
        ],
        code: {
          jsx: aiResult.jsx || '',
          css: aiResult.css || ''
        }
      };
      await updateSession(currentSession._id, updatedSession);
      setInput('');
    } catch (err) {
      setError('AI error');
    }
    setLoading(false);
  };

  const handleAISuggest = async () => {
    if (!currentSession) return;
    setSuggestionLoading(true);
    setError('');
    try {
      const res = await axios.post('/ai/suggest', {
        code: currentSession.code,
        chatHistory: (currentSession.chatHistory || []).map(({ role, content }) => ({ role, content }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const suggestion = res.data.suggestion || res.data.result || res.data.message || 'No suggestion.';
      const updatedSession = {
        ...currentSession,
        chatHistory: [
          ...(currentSession.chatHistory || []),
          { role: 'assistant', content: suggestion, timestamp: new Date(), suggestion: true }
        ]
      };
      await updateSession(currentSession._id, updatedSession);
    } catch (err) {
      setError('AI suggestion error');
    }
    setSuggestionLoading(false);
  };

  return (
    <Box className="panel">
      <Typography variant="h6" fontWeight={700} color="var(--primary-color)" mb={2} sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ChatBubbleOutlineIcon fontSize="medium" /> Chat
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Paper elevation={0} sx={{ maxHeight: 260, minHeight: 180, overflowY: 'auto', mb: 2, background: 'var(--background-light)', p: 1 }}>
        <List>
          {(currentSession.chatHistory || []).map((msg, idx) => (
            <ListItem key={idx} alignItems="flex-start" sx={{ py: 0.5, background: msg.suggestion ? 'rgba(108,99,255,0.08)' : 'none', borderLeft: msg.suggestion ? '4px solid var(--primary-color)' : 'none' }}>
              {msg.role === 'user' ? <PersonIcon sx={{ color: 'var(--primary-color)', mr: 1 }} /> : <ChatBubbleOutlineIcon sx={{ color: msg.suggestion ? 'var(--primary-color)' : '#43a047', mr: 1 }} />}
              <ListItemText
                primary={<span style={{ color: msg.role === 'user' ? 'var(--primary-color)' : (msg.suggestion ? 'var(--primary-color)' : '#43a047'), fontWeight: 500 }}>{msg.role === 'user' ? 'You' : (msg.suggestion ? 'AI Suggestion' : 'Assistant')}</span>}
                secondary={<span style={{ color: 'var(--text-light)' }}>{msg.content}</span>}
              />
            </ListItem>
          ))}
          <div ref={chatEndRef} />
        </List>
      </Paper>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          fullWidth
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button type="submit" variant="contained" color="primary" disabled={loading || !input.trim()} sx={{ minWidth: 40, borderRadius: 2 }}>
                  {loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                </Button>
              </InputAdornment>
            ),
            style: { background: 'rgba(255,255,255,0.15)', borderRadius: 8 }
          }}
        />
        <Button variant="outlined" color="secondary" onClick={handleAISuggest} disabled={suggestionLoading || loading} sx={{ minWidth: 40, borderRadius: 2 }}>
          {suggestionLoading ? <CircularProgress size={18} color="inherit" /> : 'AI Suggest'}
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ChatPanel; 