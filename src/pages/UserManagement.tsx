import React from 'react';
import UserManagementComponent from '../components/UserManagement';

const UserManagement: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8 animate-in fade-in duration-500">
      <UserManagementComponent />
    </div>
  );
};

export default UserManagement;