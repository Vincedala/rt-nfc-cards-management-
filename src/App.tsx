import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Layout } from './components/Layout';
import DashboardPage from './pages/Dashboard';
import UserManagementPage from './pages/UserManagement';
import CardManagementPage from './pages/CardManagement';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/cards" element={<CardManagementPage />} />
            <Route path="/settings" element={<div className="p-8 text-center text-muted-foreground font-medium">Settings page coming soon...</div>} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;