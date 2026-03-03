import React from 'react';
import CardManagementComponent from '../components/CardManagement';

const CardManagement: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8 animate-in fade-in duration-500">
      <CardManagementComponent />
    </div>
  );
};

export default CardManagement;