import React, { createContext, useContext, useState } from 'react';
import { User, Card, Project, Activity } from '../types';
import { USERS, CARDS, PROJECTS, ACTIVITIES } from '../data/mock';

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
  const [users, setUsers] = useState<User[]>(USERS);
  const [cards, setCards] = useState<Card[]>(CARDS);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);

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

    const previousUserIdOfCard = card.userId;
    const previousCardSerialOfUser = user.linkedCard;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, linkedCard: cardSerial };
      }
      if (previousUserIdOfCard && u.id === previousUserIdOfCard) {
        return { ...u, linkedCard: undefined };
      }
      return u;
    }));

    setCards(prev => prev.map(c => {
      if (c.serialNumber === cardSerial) {
        return { ...c, userId: userId, userName: user.name, status: 'Active' };
      }
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