import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/SessionContext';
import { List, ListItem, ListItemButton, ListItemText, TextField, Button, Typography, Box, Divider, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const SessionList = () => {
  const { sessions, currentSession, createSession, selectSession, loading } = useContext(SessionContext);
  const [newSessionName, setNewSessionName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newSessionName.trim()) {
      await createSession(newSessionName);
      setNewSessionName('');
    }
  };

  return (
    <Box className="panel">
      <Typography variant="h6" fontWeight={700} color="var(--primary-color)" mb={2} sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FolderOpenIcon fontSize="medium" /> Sessions
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ maxHeight: 260, overflowY: 'auto', mb: 2 }}>
        {sessions.map(session => (
          <ListItem key={session._id} disablePadding>
            <ListItemButton
              selected={currentSession && currentSession._id === session._id}
              onClick={() => selectSession(session._id)}
              disabled={loading}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText primary={session.sessionName} primaryTypographyProps={{ fontWeight: 500, color: 'var(--text-light)' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8 }}>
        <TextField
          size="small"
          placeholder="New session name"
          value={newSessionName}
          onChange={e => setNewSessionName(e.target.value)}
          disabled={loading}
          sx={{ flex: 1, background: 'var(--background-light)', borderRadius: 2, color: 'var(--text-light)' }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          disabled={loading || !newSessionName.trim()}
          sx={{ borderRadius: 2, minWidth: 40, px: 1 }}
        >
          <AddCircleOutlineIcon />
        </Button>
      </form>
    </Box>
  );
};

export default SessionList; 