
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminPage from './pages/AdminPage';
import ChatPage from './pages/ChatPage';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      // Настройка цветов под тему Telegram
      tg.setHeaderColor('secondary_bg_color');
      tg.setBackgroundColor('bg_color');
    }
  }, []);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
