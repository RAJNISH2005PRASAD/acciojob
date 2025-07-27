import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WidgetsIcon from '@mui/icons-material/Widgets';

const Signup = () => {
  const { signup, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await signup(email, password);
    if (result.success) {
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#181a20', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Card sx={{ minWidth: 350, maxWidth: 400, width: '100%', p: 3, borderRadius: 4, boxShadow: 8, background: 'rgba(255,255,255,0.95)', border: '1px solid #b2dfdb' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <WidgetsIcon sx={{ fontSize: 48, color: '#3949ab', mb: 1 }} />
              <Typography variant="h5" fontWeight={700} color="#388e3c" gutterBottom>Component Playground</Typography>
              <Typography variant="body2" color="#607d8b" mb={2}>Create your account</Typography>
            </Box>
            <form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                autoFocus
                InputProps={{ style: { color: '#388e3c' } }}
                InputLabelProps={{ style: { color: '#3949ab' } }}
                sx={{ input: { background: 'rgba(232,245,233,0.2)' } }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{ style: { color: '#388e3c' } }}
                InputLabelProps={{ style: { color: '#3949ab' } }}
                sx={{ input: { background: 'rgba(232,245,233,0.2)' } }}
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.2, fontWeight: 600, fontSize: 16, borderRadius: 2, boxShadow: 3, background: 'linear-gradient(90deg, #43a047 60%, #3949ab 100%)' }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
            <Typography variant="body2" color="#607d8b" align="center" mt={3}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3949ab', textDecoration: 'underline' }}>Login</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup; 