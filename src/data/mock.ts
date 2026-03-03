export interface User {
  id: string;
  name: string;
  phone: string;
  civilId: string;
  idType: string;
  projectId: string;
  linkedCardSerial?: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface Card {
  serialNumber: string;
  nfcCode: string;
  status: "Active" | "Inactive";
  projectId: string;
  linkedUserId?: string;
  linkedUserName?: string;
  registeredAt: string;
  notes?: string;
  batchNumber?: string;
  dateManufactured?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  totalCards: number;
  linkedCards: number;
}

export const PROJECTS: Project[] = [
  { id: "PRJ-001", name: "Kilimo Farmers Coop", description: "Agricultural community project", status: "Active", totalCards: 1200, linkedCards: 850 },
  { id: "PRJ-002", name: "Gikomba Traders", description: "Market traders association", status: "Active", totalCards: 2500, linkedCards: 1200 },
  { id: "PRJ-003", name: "Ruiru Community", description: "Residential community welfare", status: "Active", totalCards: 500, linkedCards: 480 },
];

export const USERS: User[] = [
  { id: "USR-001", name: "John Kamau", phone: "+254 712 345 678", civilId: "12345678", idType: "National ID", projectId: "PRJ-001", linkedCardSerial: "HP-8829-X", status: "Active", createdAt: "2024-01-15T10:00:00Z" },
  { id: "USR-002", name: "Sarah Wanjiku", phone: "+254 722 987 654", civilId: "23456789", idType: "National ID", projectId: "PRJ-002", linkedCardSerial: "HP-1122-A", status: "Active", createdAt: "2024-02-10T14:30:00Z" },
  { id: "USR-003", name: "David Mutua", phone: "+254 733 111 222", civilId: "34567890", idType: "Passport", projectId: "PRJ-001", status: "Active", createdAt: "2024-03-05T09:15:00Z" },
  { id: "USR-004", name: "Alice Njoroge", phone: "+254 700 333 444", civilId: "45678901", idType: "National ID", projectId: "PRJ-003", linkedCardSerial: "HP-5544-M", status: "Active", createdAt: "2024-03-20T11:45:00Z" },
];

export const CARDS: Card[] = [
  { serialNumber: "HP-8829-X", nfcCode: "NFC-8829-XXXX", status: "Active", projectId: "PRJ-001", linkedUserId: "USR-001", linkedUserName: "John Kamau", registeredAt: "2023-12-01T08:00:00Z" },
  { serialNumber: "HP-1122-A", nfcCode: "NFC-1122-XXXX", status: "Active", projectId: "PRJ-002", linkedUserId: "USR-002", linkedUserName: "Sarah Wanjiku", registeredAt: "2023-12-15T09:00:00Z" },
  { serialNumber: "HP-5544-M", nfcCode: "NFC-5544-XXXX", status: "Active", projectId: "PRJ-003", linkedUserId: "USR-004", linkedUserName: "Alice Njoroge", registeredAt: "2024-01-05T10:30:00Z" },
  { serialNumber: "HP-9988-K", nfcCode: "NFC-9988-XXXX", status: "Active", projectId: "PRJ-001", registeredAt: "2024-02-01T11:00:00Z" },
  { serialNumber: "HP-7766-S", nfcCode: "NFC-7766-XXXX", status: "Inactive", projectId: "PRJ-002", registeredAt: "2024-02-15T13:00:00Z" },
];

export const ACTIVITY_LOG = [
  { id: 1, action: "LINK_CARD", details: "Card HP-8829-X linked to John Kamau", user: "Admin Sarah", timestamp: "2 mins ago" },
  { id: 2, action: "CREATE_USER", details: "New user Alice Njoroge created", user: "Admin John", timestamp: "15 mins ago" },
  { id: 3, action: "DEACTIVATE_CARD", details: "Card HP-7766-S deactivated", user: "Admin Sarah", timestamp: "1 hour ago" },
  { id: 4, action: "BULK_IMPORT", details: "500 users imported to Kilimo Farmers project", user: "System", timestamp: "3 hours ago" },
];