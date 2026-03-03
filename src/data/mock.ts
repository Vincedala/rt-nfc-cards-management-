import { User, Card, Project, Activity } from '../types';

export const PROJECTS: Project[] = [
  { id: 'PRJ001', name: 'Kilimo Coop', description: 'Agricultural cooperative project', totalCards: 500, linkedCards: 120, unlinkedCards: 380, totalUsers: 150, status: 'Active', createdAt: '2024-01-10' },
  { id: 'PRJ002', name: 'Gikomba Traders', description: 'Urban trade management', totalCards: 1000, linkedCards: 450, unlinkedCards: 550, totalUsers: 600, status: 'Active', createdAt: '2024-02-15' },
  { id: 'PRJ003', name: 'Ruiru Community', description: 'Residential community welfare', totalCards: 500, linkedCards: 480, unlinkedCards: 20, totalUsers: 400, status: 'Active', createdAt: '2024-03-20' },
];

export const USERS: User[] = [
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
    role: 'Project Admin',
    dateOfBirth: '1985-05-15',
    address: '123 Moi Avenue, Nairobi'
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
    role: 'Super Admin',
    dateOfBirth: '1990-08-22',
    address: '456 Haile Selassie Rd, Nairobi'
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
    role: 'Wallet User',
    dateOfBirth: '1995-12-01',
    address: '789 Enterprise Rd, Nairobi'
  },
  { 
    id: 'USR004', 
    name: 'Alice Njoroge', 
    email: 'alice.n@example.com',
    phone: '+254700333444', 
    civilId: '45678901', 
    idType: 'National ID', 
    project: 'Ruiru Community', 
    linkedCard: 'HP-1004',
    status: 'Active', 
    createdAt: '2024-03-20T11:45:00Z', 
    role: 'Wallet User',
    dateOfBirth: '1988-11-30', 
    address: '321 Juja Rd, Nairobi' 
  },
];

export const CARDS: Card[] = [
  { serialNumber: 'HP-1001', nfcCode: '****A1B2', status: 'Active', userId: 'USR001', userName: 'John Kamau', project: 'Kilimo Coop', dateRegistered: '2024-03-01' },
  { serialNumber: 'HP-1002', nfcCode: '****C3D4', status: 'Active', project: 'Kilimo Coop', dateRegistered: '2024-03-05' },
  { serialNumber: 'HP-1003', nfcCode: '****E5F6', status: 'Inactive', project: 'Gikomba Traders', dateRegistered: '2024-03-10' },
  { serialNumber: 'HP-1004', nfcCode: '****G7H8', status: 'Active', userId: 'USR004', userName: 'Alice Njoroge', project: 'Ruiru Community', dateRegistered: '2024-03-20' },
];

export const ACTIVITIES: Activity[] = [
  { id: 'ACT001', action: 'LINK_CARD', user: 'Admin Jane', timestamp: '2024-03-15 10:30', details: 'Linked HP-1001 to John Kamau' },
  { id: 'ACT002', action: 'CREATE_USER', user: 'Admin Mike', timestamp: '2024-03-15 09:15', details: 'Created user Sarah Wanjiku' },
  { id: 'ACT003', action: 'BULK_IMPORT', user: 'System', timestamp: '2024-03-14 16:20', details: 'Imported 150 users to Ruiru Community' },
];