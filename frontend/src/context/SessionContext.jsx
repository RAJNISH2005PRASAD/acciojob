import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchSessions();
  }, [token]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const createSession = async (sessionName) => {
    setLoading(true);
    try {
      const res = await axios.post('/sessions', { sessionName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions([...sessions, res.data]);
      setCurrentSession(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  const selectSession = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSession(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const updateSession = async (id, data) => {
    try {
      const res = await axios.put(`/sessions/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSession(res.data);
      setSessions(sessions.map(s => s._id === id ? res.data : s));
    } catch (err) {}
  };

  const deleteSession = async (id) => {
    try {
      await axios.delete(`/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(sessions.filter(s => s._id !== id));
      if (currentSession && currentSession._id === id) setCurrentSession(null);
    } catch (err) {}
  };

  return (
    <SessionContext.Provider value={{ sessions, currentSession, loading, fetchSessions, createSession, selectSession, updateSession, deleteSession }}>
      {children}
    </SessionContext.Provider>
  );
}; 