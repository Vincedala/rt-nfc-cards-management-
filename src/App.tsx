import React, { useState } from 'react';
import Layout from './components/Layout';
import { AppProvider } from './hooks/useAppStore';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CardManagement from './pages/CardManagement';
import ProjectManagement from './pages/ProjectManagement';
import Reports from './pages/Reports';
import Administration from './pages/Administration';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UserManagement />;
      case 'cards': return <CardManagement />;
      case 'projects': return <ProjectManagement />;
      case 'reports': return <Reports />;
      case 'admin': return <Administration />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </AppProvider>
  );
}

export default App;