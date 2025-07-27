import React, { useContext, useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Playground from './pages/Playground';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Theme context for dark/light mode
const ThemeContext = createContext();

const getPreferredTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getPreferredTheme());
  // Listen for system theme changes if user hasn't chosen
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);
  // Sync theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/playground" element={<PrivateRoute><Playground /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionProvider>
          <Router>
            <ThemeSwitcher />
            <AnimatedRoutes />
          </Router>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
