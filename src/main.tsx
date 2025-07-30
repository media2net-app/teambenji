import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OffertePage from './pages/OffertePage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/offerte" element={<OffertePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
