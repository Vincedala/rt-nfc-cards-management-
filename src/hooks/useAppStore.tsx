import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Card, Project, Activity } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  users: User[];
  cards: Card[];
  projects: Project[];
  activities: Activity[];
  loading: boolean;
  addUser: (user: User) => Promise<void>;
  addUsers: (newUsers: User[]) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addCard: (card: Card) => Promise<void>;
  addCards: (newCards: Card[]) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
  deleteCard: (serialNumber: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  linkCard: (cardSerial: string, userId: string) => Promise<void>;
  unlinkCard: (cardSerial: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: cardsData } = await supabase.from('cards').select('*').order('date_registered', { ascending: false });
      const { data: activitiesData } = await supabase.from('activity_log').select('*').order('timestamp', { ascending: false });

      if (projectsData) setProjects(projectsData as any);
      if (usersData) setUsers(usersData.map(u => ({
        ...u,
        civilId: u.civil_id,
        idType: u.id_type,
        project: u.project_id,
        linkedCard: u.linked_card_serial,
        createdAt: u.created_at,
        lastLogin: u.last_login
      })) as any);
      if (cardsData) setCards(cardsData.map(c => ({
        ...c,
        serialNumber: c.serial_number,
        nfcCode: c.nfc_code,
        userId: c.user_id,
        userName: c.user_id ? usersData?.find(u => u.id === c.user_id)?.name : undefined,
        project: c.project_id,
        dateRegistered: c.date_registered,
        dateManufactured: c.date_manufactured,
        batchNumber: c.batch_number
      })) as any);
      if (activitiesData) setActivities(activitiesData.map(a => ({
        ...a,
        user: a.actor
      })) as any);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addActivity = async (action: string, actor: string, details: string) => {
    await supabase.from('activity_log').insert({ action, actor, details });
    const { data } = await supabase.from('activity_log').select('*').order('timestamp', { ascending: false }).limit(20);
    if (data) setActivities(data.map(a => ({ ...a, user: a.actor })) as any);
  };

  const addUser = async (user: User) => {
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      civil_id: user.civilId,
      id_type: user.idType,
      status: user.status,
      project_id: user.project,
      role: user.role
    });
    if (!error) {
      await addActivity('CREATE_USER', 'System Admin', `Created user ${user.name}`);
      await fetchAll();
    }
  };

  const addUsers = async (newUsers: User[]) => {
    const { error } = await supabase.from('profiles').insert(newUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      civil_id: user.civilId,
      id_type: user.idType,
      status: user.status,
      project_id: user.project,
      role: user.role
    })));
    if (!error) {
      await addActivity('BULK_IMPORT', 'System Admin', `Imported ${newUsers.length} users`);
      await fetchAll();
    }
  };

  const updateUser = async (updatedUser: User) => {
    const { error } = await supabase.from('profiles').update({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      civil_id: updatedUser.civilId,
      id_type: updatedUser.idType,
      status: updatedUser.status,
      project_id: updatedUser.project,
      role: updatedUser.role
    }).eq('id', updatedUser.id);
    if (!error) {
      await addActivity('UPDATE_USER', 'System Admin', `Updated user ${updatedUser.name}`);
      await fetchAll();
    }
  };

  const deleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) {
      await addActivity('DELETE_USER', 'System Admin', `Deleted user ${user?.name || userId}`);
      await fetchAll();
    }
  };

  const addCard = async (card: Card) => {
    const { error } = await supabase.from('cards').insert({
      serial_number: card.serialNumber,
      nfc_code: card.nfcCode,
      status: card.status,
      project_id: card.project,
      notes: card.notes,
      batch_number: card.batchNumber,
      date_manufactured: card.dateManufactured
    });
    if (!error) {
      await addActivity('REGISTER_CARD', 'System Admin', `Registered card ${card.serialNumber}`);
      await fetchAll();
    }
  };

  const addCards = async (newCards: Card[]) => {
    const { error } = await supabase.from('cards').insert(newCards.map(card => ({
      serial_number: card.serialNumber,
      nfc_code: card.nfcCode,
      status: card.status,
      project_id: card.project,
      notes: card.notes,
      batch_number: card.batchNumber,
      date_manufactured: card.dateManufactured
    })));
    if (!error) {
      await addActivity('BULK_IMPORT_CARDS', 'System Admin', `Imported ${newCards.length} cards`);
      await fetchAll();
    }
  };

  const updateCard = async (updatedCard: Card) => {
    const { error } = await supabase.from('cards').update({
      nfc_code: updatedCard.nfcCode,
      status: updatedCard.status,
      project_id: updatedCard.project,
      notes: updatedCard.notes,
      batch_number: updatedCard.batchNumber,
      date_manufactured: updatedCard.dateManufactured
    }).eq('serial_number', updatedCard.serialNumber);
    if (!error) {
      await addActivity('UPDATE_CARD', 'System Admin', `Updated card ${updatedCard.serialNumber}`);
      await fetchAll();
    }
  };

  const deleteCard = async (serialNumber: string) => {
    const { error } = await supabase.from('cards').delete().eq('serial_number', serialNumber);
    if (!error) {
      await addActivity('DELETE_CARD', 'System Admin', `Deleted card ${serialNumber}`);
      await fetchAll();
    }
  };

  const addProject = async (project: Project) => {
    const { error } = await supabase.from('projects').insert({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status
    });
    if (!error) {
      await addActivity('CREATE_PROJECT', 'System Admin', `Created project ${project.name}`);
      await fetchAll();
    }
  };

  const updateProject = async (updatedProject: Project) => {
    const { error } = await supabase.from('projects').update({
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status
    }).eq('id', updatedProject.id);
    if (!error) {
      await addActivity('UPDATE_PROJECT', 'System Admin', `Updated project ${updatedProject.name}`);
      await fetchAll();
    }
  };

  const deleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (!error) {
      await addActivity('DELETE_PROJECT', 'System Admin', `Deleted project ${project?.name || projectId}`);
      await fetchAll();
    }
  };

  const linkCard = async (cardSerial: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Supabase handles the link
    const { error: cardUpdateError } = await supabase.from('cards').update({ user_id: userId }).eq('serial_number', cardSerial);
    const { error: profileUpdateError } = await supabase.from('profiles').update({ linked_card_serial: cardSerial }).eq('id', userId);

    if (!cardUpdateError && !profileUpdateError) {
      await addActivity('LINK_CARD', 'System Admin', `Linked ${cardSerial} to ${user.name}`);
      await fetchAll();
    }
  };

  const unlinkCard = async (cardSerial: string) => {
    const card = cards.find(c => c.serialNumber === cardSerial);
    if (!card) return;

    const userId = card.userId;

    const { error: cardUpdateError } = await supabase.from('cards').update({ user_id: null }).eq('serial_number', cardSerial);
    if (userId) {
      const { error: profileUpdateError } = await supabase.from('profiles').update({ linked_card_serial: null }).eq('id', userId);
    }

    if (!cardUpdateError) {
      await addActivity('UNLINK_CARD', 'System Admin', `Unlinked ${cardSerial}`);
      await fetchAll();
    }
  };

  return (
    <AppContext.Provider value={{ 
      users, 
      cards, 
      projects, 
      activities, 
      loading,
      addUser, 
      addUsers, 
      updateUser, 
      deleteUser, 
      addCard, 
      addCards, 
      updateCard, 
      deleteCard, 
      addProject, 
      updateProject, 
      deleteProject, 
      linkCard, 
      unlinkCard,
      refreshData: fetchAll
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};