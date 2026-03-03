export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  civilId: string;
  idType: 'National ID' | 'Passport' | 'Voter ID' | 'Driver License';
  status: 'Active' | 'Inactive';
  project: string;
  linkedCard?: string;
  createdAt: string;
  lastLogin?: string;
  role: 'Super Admin' | 'Project Admin' | 'Operator' | 'Viewer' | 'Wallet User';
  dateOfBirth?: string;
  address?: string;
}

export interface Card {
  serialNumber: string;
  nfcCode: string;
  status: 'Active' | 'Inactive';
  userId?: string;
  userName?: string;
  project: string;
  dateRegistered: string;
  notes?: string;
  batchNumber?: string;
  dateManufactured?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalCards: number;
  linkedCards: number;
  unlinkedCards: number;
  totalUsers: number;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}