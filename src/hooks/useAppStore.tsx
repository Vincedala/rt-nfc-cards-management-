import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Card, Project, Activity } from '../types';

interface AppContextType {
  users: User[];
  cards: Card[];
  projects: Project[];
  activities: Activity[];
  addUser: (user: User) => void;
  addUsers: (newUsers: User[]) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (serialNumber: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  linkCard: (cardSerial: string, userId: string) => void;
  unlinkCard: (cardSerial: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { 
      id: 'USR001', 
      name: 'John Kamau', 
      email: 'john.k@example.com',
      phone: '+254712345678', 
      civilId: '12345678', 
      idType: 'National ID', 
      status: 'Active', 
      project: 'Kilimo Coop', 
      linkedCard: 'HP-1001',
      createdAt: '2024-03-01T10:00:00Z',
      lastLogin: '2024-03-15T09:00:00Z',
      role: 'Project Admin'
    },
    { 
      id: 'USR002', 
      name: 'Sarah Wanjiku', 
      email: 'sarah.w@example.com',
      phone: '+254722334455', 
      civilId: '87654321', 
      idType: 'Passport', 
      status: 'Active', 
      project: 'Gikomba Traders',
      createdAt: '2024-03-02T11:00:00Z',
      role: 'Super Admin'
    },
    { 
      id: 'USR003', 
      name: 'David Mutua', 
      email: 'david.m@example.com',
      phone: '+254700112233', 
      civilId: '22334455', 
      idType: 'Voter ID', 
      status: 'Active', 
      project: 'Kilimo Coop',
      createdAt: '2024-03-03T12:00:00Z',
      role: 'Wallet User'
    },
  ]);

  const [cards, setCards] = useState<Card[]>([
    { serialNumber: 'HP-1001', nfcCode: '****A1B2', status: 'Active', userId: 'USR001', userName: 'John Kamau', project: 'Kilimo Coop', dateRegistered: '2024-03-01' },
    { serialNumber: 'HP-1002', nfcCode: '****C3D4', status: 'Active', project: 'Kilimo Coop', dateRegistered: '2024-03-05' },
    { serialNumber: 'HP-1003', nfcCode: '****E5F6', status: 'Inactive', project: 'Gikomba Traders', dateRegistered: '2024-03-10' },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 'PRJ001', name: 'Kilimo Coop', description: 'Agricultural cooperative project', totalCards: 500, linkedCards: 120, unlinkedCards: 380, totalUsers: 150, status: 'Active', createdAt: '2024-01-10' },
    { id: 'PRJ002', name: 'Gikomba Traders', description: 'Urban trade management', totalCards: 1000, linkedCards: 450, unlinkedCards: 550, totalUsers: 600, status: 'Active', createdAt: '2024-02-15' },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 'ACT001', action: 'LINK_CARD', user: 'Admin Jane', timestamp: '2024-03-15 10:30', details: 'Linked HP-1001 to John Kamau' },
    { id: 'ACT002', action: 'CREATE_USER', user: 'Admin Mike', timestamp: '2024-03-15 09:15', details: 'Created user Sarah Wanjiku' },
  ]);

  const addUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'CREATE_USER',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Created user ${user.name} with role ${user.role}`
    }, ...prev]);
  };

  const addUsers = (newUsers: User[]) => {
    setUsers(prev => [...newUsers, ...prev]);
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'BULK_IMPORT',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Imported ${newUsers.length} users via bulk import`
    }, ...prev]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'UPDATE_USER',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Updated user ${updatedUser.name}`
    }, ...prev]);
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    // Unlink any card this user had
    if (user?.linkedCard) {
      setCards(prev => prev.map(c => 
        c.serialNumber === user.linkedCard ? { ...c, userId: undefined, userName: undefined } : c
      ));
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'DELETE_USER',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Deleted user ${user?.name || userId}`
    }, ...prev]);
  };

  const addCard = (card: Card) => {
    setCards(prev => [card, ...prev]);
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'REGISTER_CARD',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Registered card ${card.serialNumber} for project ${card.project}`
    }, ...prev]);
  };

  const updateCard = (updatedCard: Card) => {
    setCards(prev => prev.map(c => c.serialNumber === updatedCard.serialNumber ? updatedCard : c));
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'UPDATE_CARD',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Updated card ${updatedCard.serialNumber}`
    }, ...prev]);
  };

  const deleteCard = (serialNumber: string) => {
    const card = cards.find(c => c.serialNumber === serialNumber);
    // Unlink user if this card was linked
    if (card?.userId) {
      setUsers(prev => prev.map(u => 
        u.id === card.userId ? { ...u, linkedCard: undefined } : u
      ));
    }
    setCards(prev => prev.filter(c => c.serialNumber !== serialNumber));
    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'DELETE_CARD',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Deleted card ${serialNumber}`
    }, ...prev]);
  };

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setActivities(prev => [{
        id: `ACT-${Date.now()}`,
        action: 'CREATE_PROJECT',
        user: 'Current Admin',
        timestamp: new Date().toLocaleString(),
        details: `Created project ${project.name}`
    }, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setActivities(prev => [{
        id: `ACT-${Date.now()}` ,
        action: 'UPDATE_PROJECT',
        user: 'Current Admin',
        timestamp: new Date().toLocaleString(),
        details: `Updated project ${updatedProject.name}`
    }, ...prev]);
  };

  const deleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setActivities(prev => [{
        id: `ACT-${Date.now()}`,
        action: 'DELETE_PROJECT',
        user: 'Current Admin',
        timestamp: new Date().toLocaleString(),
        details: `Deleted project ${project?.name || projectId}`
    }, ...prev]);
  };

  const linkCard = (cardSerial: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    const card = cards.find(c => c.serialNumber === cardSerial);

    if (!user || !card) return;

    // 1. If this card was linked to someone else, unlink them first
    let previousUserIdOfCard = card.userId;
    
    // 2. If this user was linked to another card, unlink that card first
    let previousCardSerialOfUser = user.linkedCard;

    setUsers(prev => prev.map(u => {
      // Unlink previous card from this user
      if (u.id === userId) {
        return { ...u, linkedCard: cardSerial };
      }
      // If the card we are linking was owned by someone else, they are now unlinked
      if (previousUserIdOfCard && u.id === previousUserIdOfCard) {
        return { ...u, linkedCard: undefined };
      }
      return u;
    }));

    setCards(prev => prev.map(c => {
      // Link this card to the user
      if (c.serialNumber === cardSerial) {
        return { ...c, userId: userId, userName: user.name, status: 'Active' };
      }
      // If the user had a previous card, it's now unlinked
      if (previousCardSerialOfUser && c.serialNumber === previousCardSerialOfUser) {
        return { ...c, userId: undefined, userName: undefined };
      }
      return c;
    }));

    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'LINK_CARD',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Linked ${cardSerial} to ${user.name}`
    }, ...prev]);
  };

  const unlinkCard = (cardSerial: string) => {
    const card = cards.find(c => c.serialNumber === cardSerial);
    if (!card) return;

    const userId = card.userId;

    setCards(prev => prev.map(c => 
      c.serialNumber === cardSerial ? { ...c, userId: undefined, userName: undefined } : c
    ));
    
    if (userId) {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, linkedCard: undefined } : u
      ));
    }

    setActivities(prev => [{
      id: `ACT-${Date.now()}`,
      action: 'UNLINK_CARD',
      user: 'Current Admin',
      timestamp: new Date().toLocaleString(),
      details: `Unlinked ${cardSerial}`
    }, ...prev]);
  };

  return (
    <AppContext.Provider value={{ users, cards, projects, activities, addUser, addUsers, updateUser, deleteUser, addCard, updateCard, deleteCard, addProject, updateProject, deleteProject, linkCard, unlinkCard }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};