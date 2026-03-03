import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  History, 
  Edit2, 
  Upload,
  UserPlus,
  Trash2,
  ChevronLeft,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  ShieldHalf,
  UserCog,
  RefreshCw,
  Info,
  ChevronRight,
  Fingerprint,
  Unlink,
  MapPin,
  Link as LinkIcon,
  Download
} from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { User } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Badge } from './ui/badge';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription, 
  CardFooter 
} from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ViewMode = 'list' | 'create' | 'import' | 'profile' | 'edit';

export default function UserManagement() {
  const { users, projects, cards, addUser, addUsers, deleteUser, updateUser, linkCard, unlinkCard } = useAppStore();
  const [view, setView] = useState<ViewMode>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Link Card Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [cardToLink, setCardToLink] = useState('');

  // Bulk Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.phone.includes(searchTerm) ||
        u.civilId.includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = filterProject === 'All' || u.project === filterProject;
      const matchesStatus = filterStatus === 'All' || u.status === filterStatus;
      
      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [users, searchTerm, filterProject, filterStatus]);

  const availableCards = useMemo(() => {
    return cards.filter(c => !c.userId && (selectedUser ? c.project === selectedUser.project : true));
  }, [cards, selectedUser]);

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
      id: `USR${Math.floor(Math.random() * 10000)}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      civilId: formData.get('civilId') as string,
      idType: formData.get('idType') as any,
      project: formData.get('project') as string,
      role: formData.get('role') as any || 'Wallet User',
      status: 'Active',
      createdAt: new Date().toISOString(),
      dateOfBirth: formData.get('dateOfBirth') as string,
      address: formData.get('address') as string,
    };
    addUser(newUser);
    toast.success('User created successfully');
    setView('list');
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedUser: User = {
      ...selectedUser,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      civilId: formData.get('civilId') as string,
      idType: formData.get('idType') as any,
      project: formData.get('project') as string,
      role: formData.get('role') as any,
      status: formData.get('status') as any,
      dateOfBirth: formData.get('dateOfBirth') as string,
      address: formData.get('address') as string,
    };
    updateUser(updatedUser);
    setSelectedUser(updatedUser);
    toast.success('User updated successfully');
    setView('profile');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      const mockPreview = [
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '+254700000001', civilId: '98765432', idType: 'National ID', project: 'Kilimo Coop', role: 'Wallet User' },
        { name: 'Bob Wilson', email: 'bob@example.com', phone: '+254700000002', civilId: '87654321', idType: 'Passport', project: 'Gikomba Traders', role: 'Wallet User' },
        { name: 'Charlie Davis', email: 'charlie@example.com', phone: '+254700000003', civilId: '76543210', idType: 'National ID', project: 'Kilimo Coop', role: 'Wallet User' },
      ];
      setImportPreview(mockPreview);
    }
  };

  const confirmBulkImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const newUsers: User[] = importPreview.map((item, idx) => ({
        ...item,
        id: `USR-IMP-${Date.now()}-${idx}`,
        status: 'Active',
        createdAt: new Date().toISOString()
      }));
      addUsers(newUsers);
      setIsImporting(false);
      setImportFile(null);
      setImportPreview([]);
      toast.success(`Successfully imported ${newUsers.length} users`);
      setView('list');
    }, 1500);
  };

  const openProfile = (user: User) => {
    setSelectedUser(user);
    setView('profile');
  };

  const openEdit = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedUser(user);
    setView('edit');
  };

  const handleLinkCard = () => {
    if (selectedUser && cardToLink) {
      linkCard(cardToLink, selectedUser.id);
      setIsLinkModalOpen(false);
      setCardToLink('');
      setSelectedUser({ ...selectedUser, linkedCard: cardToLink });
      toast.success(`Card ${cardToLink} linked to ${selectedUser.name}`);
    }
  };

  const handleUnlinkCard = (cardSerial: string) => {
    if (confirm('Are you sure you want to unlink this card?')) {
      unlinkCard(cardSerial);
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, linkedCard: undefined });
      }
      toast.info('Card unlinked successfully');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Super Admin': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Project Admin': return <ShieldHalf className="w-3.5 h-3.5" />;
      case 'Operator': return <UserCog className="w-3.5 h-3.5" />;
      default: return <UserIcon className="w-3.5 h-3.5" />;
    }
  };

  const userLinkedCard = selectedUser?.linkedCard ? cards.find(c => c.serialNumber === selectedUser.linkedCard) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            User Management
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 rounded-full font-bold text-[10px]">
              {users.length} TOTAL
            </Badge>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Register new users and manage platform access for administrators and staff.</p>
        </div>
        <div className="flex items-center gap-2">
          {view !== 'list' && (
            <Button 
              variant="ghost"
              onClick={() => setView('list')}
              className="rounded-xl h-10 px-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setView('import')}
            className="rounded-xl border-slate-200 dark:border-slate-800 h-10 px-4"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button 
            onClick={() => setView('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 h-10 px-4 font-bold"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">New Users</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">+12 This Week</p>
                  </div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Administrators</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">8 Active Staff</p>
                  </div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => setView('create')}>
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Create User</p>
                    <p className="text-[11px] text-slate-400">Add individual user to system</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by name, email, phone, or ID..." 
                  className="pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterProject} onValueChange={setFilterProject}>
                  <SelectTrigger className="w-[180px] rounded-xl bg-slate-50 dark:bg-slate-800 border-none h-11">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Projects</SelectItem>
                    {projects.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] rounded-xl bg-slate-50 dark:bg-slate-800 border-none h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-200 dark:border-slate-800">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center w-12">#</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">NFC Card</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                          onClick={() => openProfile(user)}
                        >
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-mono text-slate-400">{index + 1}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 shadow-sm relative">
                                {user.name.charAt(0)}
                                {user.role.includes('Admin') && (
                                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border border-white dark:border-slate-900 shadow-sm">
                                    <ShieldCheck className="w-2 h-2" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{user.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={cn(
                              "rounded-md font-medium text-[10px] px-2 py-0.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 w-fit",
                              user.role.includes('Admin') ? "border-blue-200 text-blue-700 dark:text-blue-400 dark:border-blue-900/50" : ""
                            )}>
                              {getRoleIcon(user.role)}
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                {user.project}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase font-mono">{user.idType}: {user.civilId}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.linkedCard ? (
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5 w-fit">
                                <CreditCard className="w-3 h-3" />
                                {user.linkedCard}
                              </Badge>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic font-medium flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" /> Unlinked
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                              user.status === 'Active' 
                                ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            )}>
                              <div className={cn("w-1 h-1 rounded-full", user.status === 'Active' ? "bg-emerald-500" : "bg-slate-400")} />
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                onClick={(e) => openEdit(user, e)}
                                title="Edit User"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if(confirm('Are you sure you want to delete this user?')) {
                                    deleteUser(user.id);
                                    toast.success('User deleted');
                                  }
                                }}
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center text-slate-500 dark:text-slate-400">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-slate-300" />
                            </div>
                            <div>
                              <p className="font-bold">No users found</p>
                              <p className="text-xs">Try adjusting your search or filters.</p>
                            </div>
                            <Button 
                              variant="link" 
                              className="text-blue-600 p-0 h-auto"
                              onClick={() => {setSearchTerm(''); setFilterProject('All'); setFilterStatus('All');}}
                            >
                              Clear all filters
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Showing {filteredUsers.length} of {users.length} users</p>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" disabled className="h-8 text-[11px] rounded-lg">Previous</Button>
                  <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-lg">Next</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {(view === 'create' || view === 'edit') && (
          <motion.div 
            key={view}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 hidden lg:block">
                 <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl sticky top-6">
                    <img 
                      src={view === 'create' 
                        ? "https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/admin-user-registration-ui-c8f910b6-1772570833594.webp"
                        : "https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/edit-user-profile-illustration-e7fce4d7-1772572432541.webp"
                      }
                      alt="Registration"
                      className="w-full h-full object-cover min-h-[600px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/40 to-transparent p-8 flex flex-col justify-end text-white">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                         {view === 'create' ? <Fingerprint className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{view === 'create' ? 'Secure Registration' : 'Update Credentials'}</h3>
                      <p className="text-blue-100 text-sm leading-relaxed mb-6">
                        {view === 'create' 
                          ? 'Register new administrators and staff members to the NFC platform. Ensure you assign the correct project and role to maintain security protocols.'
                          : 'Update user credentials, contact information, and project assignments. All changes are logged for security auditing purposes.'}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                           <ShieldCheck className="w-5 h-5 text-blue-400" />
                           <p className="text-xs font-medium">Role-based Access Control</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                           <History className="w-5 h-5 text-blue-400" />
                           <p className="text-xs font-medium">Audit logs track all {view === 'create' ? 'registrations' : 'updates'}</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-3">
                <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border-none bg-white dark:bg-slate-900">
                  <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                          {view === 'create' ? <UserPlus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{view === 'create' ? 'Create New User' : 'Edit User Info'}</CardTitle>
                          <CardDescription>{view === 'create' ? 'Register a new system or wallet user' : `Modifying account: ${selectedUser?.id}`}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setView('list')} className="rounded-full">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <form onSubmit={view === 'create' ? handleCreateUser : handleUpdateUser}>
                    <CardContent className="p-6 md:p-8">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                             <UserIcon className="w-4 h-4" />
                             <h4 className="text-xs font-bold uppercase tracking-widest">Personal Information</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Full Name</Label>
                              <Input id="name" name="name" required defaultValue={selectedUser?.name} placeholder="e.g. John Kamau" className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email Address</Label>
                              <Input id="email" name="email" type="email" required defaultValue={selectedUser?.email} placeholder="john.k@example.com" className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">Phone Number</Label>
                              <Input id="phone" name="phone" required defaultValue={selectedUser?.phone} placeholder="+254 7XX XXX XXX" className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dateOfBirth" className="text-xs font-bold uppercase text-slate-500">Date of Birth</Label>
                              <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={selectedUser?.dateOfBirth} className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-500">Physical Address</Label>
                              <Input id="address" name="address" defaultValue={selectedUser?.address} placeholder="123 Street, City" className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus:bg-white transition-colors" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                             <ShieldCheck className="w-4 h-4" />
                             <h4 className="text-xs font-bold uppercase tracking-widest">Access & Assignment</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="idType" className="text-xs font-bold uppercase text-slate-500">Identity Document Type</Label>
                              <select name="idType" id="idType" defaultValue={selectedUser?.idType} className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer">
                                <option value="National ID">National ID</option>
                                <option value="Passport">Passport</option>
                                <option value="Voter ID">Voter ID</option>
                                <option value="Driver License">Driver License</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="civilId" className="text-xs font-bold uppercase text-slate-500">Identity Number</Label>
                              <Input id="civilId" name="civilId" required defaultValue={selectedUser?.civilId} placeholder="12345678" className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/30 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="project" className="text-xs font-bold uppercase text-slate-500">Primary Project Assignment</Label>
                              <select name="project" id="project" defaultValue={selectedUser?.project} className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer">
                                {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role" className="text-xs font-bold uppercase text-slate-500">System Access Role</Label>
                              <select name="role" id="role" defaultValue={selectedUser?.role} className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer font-bold text-blue-700 dark:text-blue-400">
                                <option value="Wallet User">Wallet User (Standard)</option>
                                <option value="Operator">Operator (Staff)</option>
                                <option value="Project Admin">Project Administrator</option>
                                <option value="Super Admin">Global Administrator</option>
                                <option value="Viewer">Viewer Only</option>
                              </select>
                            </div>
                            {view === 'edit' && (
                              <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-bold uppercase text-slate-500">Account Status</Label>
                                <select name="status" id="status" defaultValue={selectedUser?.status} className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer">
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                            {view === 'create' 
                              ? 'Administrative roles will be sent an invitation email to set up their password. Wallet users require card linking for transaction processing.'
                              : 'Modifying user roles or project assignments may affect their access to certain platform features and historical transaction data.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-6 flex justify-end gap-3">
                      <Button type="button" variant="ghost" onClick={() => setView('list')} className="rounded-xl h-12 px-6 font-bold">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-blue-600/20">
                        {view === 'create' ? 'Register Account' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'import' && (
          <motion.div 
            key="import"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-8">
              {!importFile ? (
                <>
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Import Users</h3>
                    <p className="text-slate-500 text-sm mt-1">Upload CSV or Excel file to register multiple users at once.</p>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group bg-slate-50/30 dark:bg-slate-800/20"
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      accept=".csv,.xlsx"
                      onChange={handleFileUpload}
                    />
                    <div className="mx-auto w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-slate-700">
                      <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400">CSV, XLSX up to 10MB</p>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-xs font-medium dark:text-blue-300">Download our standard import template.</span>
                    </div>
                    <Button variant="link" className="text-blue-600 text-xs font-bold h-auto p-0">
                      template.csv
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <div>
                        <h3 className="font-bold text-sm">File Ready: {importFile.name}</h3>
                        <p className="text-xs text-slate-500">{importPreview.length} records detected for import</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {setImportFile(null); setImportPreview([]);}}
                      className="rounded-full text-slate-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-[10px] text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">Role</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">Validation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium">{row.name}</td>
                            <td className="px-4 py-3">{row.email}</td>
                            <td className="px-4 py-3">{row.role}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold uppercase text-[9px]">
                                <CheckCircle2 className="w-3 h-3" /> Valid
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      Verify that project names in your file exactly match existing projects. Duplicates will be automatically flagged.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-end gap-3">
                <Button 
                  variant="ghost"
                  onClick={() => setView('list')}
                  className="rounded-xl h-11 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-10 font-bold shadow-lg shadow-blue-600/20",
                    isImporting && "opacity-70 pointer-events-none"
                  )}
                  disabled={!importFile || isImporting}
                  onClick={confirmBulkImport}
                >
                  {isImporting ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : "Confirm Import"}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'profile' && selectedUser && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8 text-center bg-white dark:bg-slate-900 border-none">
                <div className="relative mx-auto w-32 h-32 mb-6">
                  <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 border-4 border-white dark:border-slate-900 shadow-inner">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div className={cn(
                    "absolute bottom-1 right-1 w-8 h-8 border-4 border-white dark:border-slate-900 rounded-full",
                    selectedUser.status === 'Active' ? "bg-emerald-500" : "bg-slate-400"
                  )}></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{selectedUser.id}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0 uppercase text-[10px] font-bold">
                    {selectedUser.status}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 dark:border-slate-800 uppercase text-[10px] font-bold">
                    {selectedUser.role}
                  </Badge>
                  <Badge className="bg-blue-100/50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-0 uppercase text-[10px] font-bold">
                    {selectedUser.project}
                  </Badge>
                </div>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 bg-white dark:bg-slate-900 border-none">
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-blue-500" />
                  Contact & Identity
                </h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-medium dark:text-slate-300">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                      <p className="text-sm font-medium dark:text-slate-300">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date of Birth</p>
                      <p className="text-sm font-medium dark:text-slate-300">{selectedUser.dateOfBirth || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Physical Address</p>
                      <p className="text-sm font-medium dark:text-slate-300">{selectedUser.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">{selectedUser.idType}</p>
                      <p className="text-sm font-medium dark:text-slate-300 font-mono">{selectedUser.civilId}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm bg-white dark:bg-slate-900 overflow-hidden border-none">
                <div className="border-b border-slate-100 dark:border-slate-800 p-6 bg-slate-50/30 dark:bg-slate-800/20">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Wallet & Card Assignment
                  </h4>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-900 dark:text-white">
                        <CreditCard className="w-16 h-16" />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active NFC Card</p>
                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                      </div>
                      {selectedUser.linkedCard ? (
                        <div className="relative z-10">
                          <p className="text-2xl font-bold dark:text-white tracking-tight font-mono">{selectedUser.linkedCard}</p>
                          <p className="text-[10px] text-slate-500 mt-1">Assigned to {selectedUser.name}</p>
                          <div className="mt-4 flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-[10px] font-bold uppercase rounded-lg border-red-100 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                              onClick={() => handleUnlinkCard(selectedUser.linkedCard!)}
                            >
                              <Unlink className="w-3 h-3 mr-1.5" /> Unlink
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-[10px] font-bold uppercase rounded-lg border-blue-100 text-blue-600"
                              onClick={() => setIsLinkModalOpen(true)}
                            >
                              <RefreshCw className="w-3 h-3 mr-1.5" /> Change
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-10">
                          <p className="text-lg font-bold text-slate-400">No Card Assigned</p>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-blue-600 font-bold text-xs mt-2"
                            onClick={() => setIsLinkModalOpen(true)}
                          >
                            Link new card \\u2192
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-900 dark:text-white">
                        <ShieldCheck className="w-16 h-16" />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Security Status</p>
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <p className="text-2xl font-bold dark:text-white tracking-tight">Verified</p>
                        <p className="text-[10px] text-slate-500 mt-1">KYC Level 2 Completed</p>
                      </div>
                    </div>
                  </div>

                  {userLinkedCard && (
                    <div className="mt-6 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Card Details</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Serial Number</p>
                          <p className="text-sm font-mono font-bold dark:text-white">{userLinkedCard.serialNumber}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">NFC Code</p>
                          <p className="text-sm font-mono font-bold dark:text-white">{userLinkedCard.nfcCode}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0 text-[9px] h-5">
                            {userLinkedCard.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Registered</p>
                          <p className="text-sm font-bold dark:text-white">{userLinkedCard.dateRegistered}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-500" />
                        Recent Activity
                      </h5>
                      <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-slate-400">Full History</Button>
                    </div>
                    <div className="space-y-6">
                      {[
                        { action: 'NFC Payment at Kilimo Market', time: '1 hour ago', loc: 'Merchant Terminal #442' },
                        { action: 'Card Status Updated to Active', time: '3 hours ago', loc: 'Admin Portal' },
                        { action: 'User Profile Registered', time: '5 hours ago', loc: 'System Auto' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== 2 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>}
                          <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 z-10 border border-blue-100 dark:border-blue-800 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.action}</p>
                            <p className="text-[11px] text-slate-500">{item.time} \\u2022 {item.loc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    if(confirm('Are you sure you want to deactivate this user?')) {
                      updateUser({...selectedUser, status: 'Inactive'});
                      setSelectedUser({...selectedUser, status: 'Inactive'});
                      toast.info('User deactivated');
                    }
                  }}
                  className="rounded-xl h-11 px-6 font-bold text-red-600 border-red-100 hover:bg-red-50 dark:hover:bg-red-900/10 dark:border-red-900/50"
                >
                  Deactivate User
                </Button>
                <Button 
                  onClick={() => setView('edit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-blue-600/20"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit User Info
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none">
          <div className="relative h-32 w-full">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/link-card-modal-ui-7d6dd81a-1772571500956.webp"
              className="w-full h-full object-cover"
              alt="Link Card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <DialogTitle className="text-xl font-bold">{selectedUser?.linkedCard ? 'Change Linked Card' : 'Link New NFC Card'}</DialogTitle>
              <DialogDescription className="text-slate-500">Assign a physical card to {selectedUser?.name}</DialogDescription>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Select Available Card</Label>
              <Select value={cardToLink} onValueChange={setCardToLink}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Choose a serial number..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCards.length > 0 ? (
                    availableCards.map(card => (
                      <SelectItem key={card.serialNumber} value={card.serialNumber}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="font-mono">{card.serialNumber}</span>
                          <span className="text-[10px] opacity-50 uppercase">({card.project})</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">No available cards in this project</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {availableCards.length === 0 && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  There are no unassigned cards registered for the <strong>{selectedUser?.project}</strong> project. Please register cards first in Card Management.
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">
                Linking a card will immediately enable it for all transaction types assigned to this user profile.
              </p>
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-2">
            <Button variant="ghost" onClick={() => setIsLinkModalOpen(false)} className="rounded-xl h-11">Cancel</Button>
            <Button 
              disabled={!cardToLink} 
              onClick={handleLinkCard}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-blue-600/20"
            >
              Confirm Linkage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}