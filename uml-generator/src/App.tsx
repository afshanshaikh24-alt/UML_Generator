import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Editor from './pages/Editor';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1d27',
            color: '#e2e8f0',
            border: '1px solid #2d3148',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1a1d27' },
            duration: 2500,
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a1d27' },
            duration: 4000,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
