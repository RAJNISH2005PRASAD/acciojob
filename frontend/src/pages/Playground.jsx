import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SessionList from '../components/SessionList';
import ChatPanel from '../components/ChatPanel';
import Preview from '../components/Preview';
import CodeTabs from '../components/CodeTabs';
import ExportButtons from '../components/ExportButtons';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { SessionContext } from '../context/SessionContext';

const layout = [
  { i: 'dashboard', x: 0, y: 0, w: 10, h: 2, minW: 2, minH: 2 },
  { i: 'sessions', x: 0, y: 2, w: 2, h: 8, minW: 2, minH: 6 },
  { i: 'chat', x: 2, y: 2, w: 3, h: 8, minW: 2, minH: 6 },
  { i: 'preview', x: 5, y: 2, w: 5, h: 5, minW: 3, minH: 4 },
  { i: 'code', x: 5, y: 7, w: 5, h: 3, minW: 3, minH: 2 },
  { i: 'export', x: 0, y: 10, w: 10, h: 1, minW: 2, minH: 1 }
];

function DashboardPanel() {
  const { sessions } = useContext(SessionContext);
  const recentSessions = sessions.slice(-3).reverse();
  const totalSessions = sessions.length;
  const totalChats = sessions.reduce((acc, s) => acc + (s.chatHistory?.length || 0), 0);
  return (
    <div className="panel">
      <Typography variant="h6" fontWeight={700} color="var(--primary-color)" gutterBottom>Dashboard</Typography>
      <div style={{ display: 'flex', gap: 32 }}>
        <div><strong>Total Sessions:</strong> {totalSessions}</div>
        <div><strong>Total Chats:</strong> {totalChats}</div>
        <div><strong>Recent Sessions:</strong> {recentSessions.map(s => s.sessionName).join(', ')}</div>
      </div>
    </div>
  );
}

const Playground = () => {
  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#181a20', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>
        <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #43a047 60%, #3949ab 100%)', boxShadow: 3, borderRadius: '12px 12px 0 0' }}>
          <Toolbar>
            <WidgetsIcon sx={{ mr: 1, color: '#fff' }} />
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1, color: '#fff' }}>
              Component Playground
            </Typography>
          </Toolbar>
        </AppBar>
        <GridLayout
          className="layout"
          layout={layout}
          cols={10}
          rowHeight={60}
          width={1200}
          style={{ margin: '0 auto', padding: 24 }}
          draggableHandle=".MuiPaper-root, .MuiAppBar-root"
        >
          <div key="dashboard" className="panel">
            <DashboardPanel />
          </div>
          <div key="sessions" className="panel">
            <SessionList />
          </div>
          <div key="chat" className="panel">
            <ChatPanel />
          </div>
          <div key="preview" className="panel">
            <Preview />
          </div>
          <div key="code" className="panel">
            <CodeTabs />
          </div>
          <div key="export" className="panel">
            <ExportButtons />
          </div>
        </GridLayout>
      </div>
    </div>
  );
};

export default Playground; 