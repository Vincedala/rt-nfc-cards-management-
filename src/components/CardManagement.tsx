import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  X,
  Scan,
  Info,
  CreditCard,
  ShieldCheck,
  Calendar,
  Hash,
  StickyNote,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronLeft,
  Link as LinkIcon,
  Unlink,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRightLeft,
  User as UserIcon,
  History as HistoryIcon,
  AlertCircle,
  FileUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../hooks/useAppStore';
import { Card as CardType, User } from '../types';
import { cn } from '../lib/utils';
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
import BulkCardImport from './BulkCardImport';

type ViewMode = 'list' | 'register' | 'details';

export default function CardManagement() {
  const { cards, users, projects, addCard, updateCard, deleteCard, linkCard, unlinkCard } = useAppStore();
  const [view, setView] = useState<ViewMode>('list');
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [userToLink, setUserToLink] = useState('');

  // Bulk Import State
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      const matchesSearch = 
        c.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.nfcCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = filterProject === 'All' || c.project === filterProject;
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      
      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [cards, searchTerm, filterProject, filterStatus]);

  const availableUsers = useMemo(() => {
    // Only users from the same project as the card OR all users if project matches
    return users.filter(u => !u.linkedCard && (selectedCard ? u.project === selectedCard.project : true));
  }, [users, selectedCard]);

  const handleRegisterCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serialNumber = formData.get('serialNumber') as string;
    
    // Validation
    if (cards.some(c => c.serialNumber === serialNumber)) {
      toast.error(`Serial number ${serialNumber} is already registered.`);
      return;
    }

    const newCard: CardType = {
      serialNumber,
      nfcCode: formData.get('nfcCode') as string,
      status: 'Active',
      project: formData.get('project') as string,
      dateRegistered: new Date().toISOString().split('T')[0],
      batchNumber: formData.get('batchNumber') as string,
      notes: formData.get('notes') as string,
    };
    
    addCard(newCard);
    toast.success('Card registered successfully');
    setView('list');
  };

  const handleLinkCard = () => {
    if (selectedCard && userToLink) {
      linkCard(selectedCard.serialNumber, userToLink);
      setIsLinkModalOpen(false);
      setUserToLink('');
      // Update local selected card if we are in details view
      if (selectedCard) {
        const user = users.find(u => u.id === userToLink);
        setSelectedCard({ ...selectedCard, userId: userToLink, userName: user?.name });
      }
      toast.success('Card linked to user successfully');
    }
  };

  const handleUnlinkCard = (cardSerial: string) => {
    if (confirm('Are you sure you want to unlink this card?')) {
      unlinkCard(cardSerial);
      if (selectedCard) {
        setSelectedCard({ ...selectedCard, userId: undefined, userName: undefined });
      }
      toast.info('Card unlinked successfully');
    }
  };

  const openDetails = (card: CardType) => {
    setSelectedCard(card);
    setView('details');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Card Management
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 rounded-full font-bold text-[10px]">
              {cards.length} TOTAL
            </Badge>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor and manage NFC card inventory and user associations.</p>
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
            onClick={() => setIsBulkImportOpen(true)}
            className="rounded-xl border-slate-200 dark:border-slate-800 h-10 px-4 font-semibold text-slate-700 dark:text-slate-300"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button 
            onClick={() => setView('register')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 h-10 px-4 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Register Card
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
            className="space-y-6"
          >
            {/* Visual Hero Section */}
            <div className="relative rounded-3xl overflow-hidden h-40 shadow-xl">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/card-management-header-visual-fc55b5e9-1772571591764.webp"
                alt="Card Management"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/50 to-transparent p-8 flex flex-col justify-center">
                <h3 className="text-white text-xl font-bold">Card Inventory Overview</h3>
                <p className="text-blue-100/80 text-sm max-w-md mt-2">Manage your physical card inventory, register new batches, and track user assignments across all projects.</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Available Cards</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{cards.filter(c => !c.userId).length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Linked Cards</p>
                <p className="text-2xl font-bold text-blue-600">{cards.filter(c => c.userId).length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Inactive</p>
                <p className="text-2xl font-bold text-amber-600">{cards.filter(c => c.status === 'Inactive').length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-emerald-600">{projects.length}</p>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by serial, NFC code, or linked user..." 
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

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <motion.div
                    layout
                    key={card.serialNumber}
                    onClick={() => openDetails(card)}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg" onClick={(e) => {e.stopPropagation();}}>
                          <MoreVertical className="w-4 h-4" />
                       </Button>
                    </div>
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                          <CreditCard className="w-6 h-6" />
                       </div>
                       <Badge className={cn(
                         "uppercase text-[9px] font-bold",
                         card.userId ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                       )}>
                         {card.userId ? 'Linked' : 'Available'}
                       </Badge>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Serial Number</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">{card.serialNumber}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Project</p>
                             <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{card.project}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                             <div className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", card.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                                <span className="text-xs font-semibold">{card.status}</span>
                             </div>
                          </div>
                       </div>
                       <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                          {card.userId ? (
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                   {card.userName?.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{card.userName}</span>
                             </div>
                          ) : (
                             <span className="text-xs text-slate-400 italic">Unassigned</span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                       </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-lg font-bold">No cards found</h3>
                   <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
                   <Button variant="link" className="text-blue-600 mt-2 font-bold" onClick={() => {setSearchTerm(''); setFilterProject('All'); setFilterStatus('All');}}>Clear all filters</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {view === 'register' && (
          <motion.div 
            key="register"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
               <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                           <Plus className="w-5 h-5" />
                        </div>
                        <div>
                           <CardTitle>Register Single Card</CardTitle>
                           <CardDescription>Enter physical NFC tag details</CardDescription>
                        </div>
                     </div>
                     <Button variant="ghost" size="icon" onClick={() => setView('list')} className="rounded-full">
                        <X className="w-5 h-5" />
                     </Button>
                  </div>
               </CardHeader>
               <form onSubmit={handleRegisterCard}>
                  <CardContent className="p-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="serialNumber" className="text-xs font-bold uppercase text-slate-500">Serial Number</Label>
                              <Input id="serialNumber" name="serialNumber" required placeholder="HP-XXXX-XXXX" className="rounded-xl h-12 bg-slate-50/50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono font-bold" />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="nfcCode" className="text-xs font-bold uppercase text-slate-500">NFC Tag Code</Label>
                              <div className="relative">
                                 <Input id="nfcCode" name="nfcCode" required placeholder="04:XX:XX:XX:XX:XX:XX" className="rounded-xl h-12 bg-slate-50/50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono pr-12" />
                                 <Scan className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="project" className="text-xs font-bold uppercase text-slate-500">Project Assignment</Label>
                              <select name="project" id="project" className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm outline-none appearance-none cursor-pointer font-medium">
                                 {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="batchNumber" className="text-xs font-bold uppercase text-slate-500">Batch Number (Optional)</Label>
                              <Input id="batchNumber" name="batchNumber" placeholder="B-2024-Q1-01" className="rounded-xl h-12 bg-slate-50/50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes" className="text-xs font-bold uppercase text-slate-500">Administrative Notes</Label>
                        <textarea id="notes" name="notes" rows={3} placeholder="e.g. Distributed to field office A..." className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
                     </div>

                     <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                           Newly registered cards are marked as "Active" by default and available for user assignment within their designated project.
                        </p>
                     </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                     <Button variant="ghost" type="button" onClick={() => setView('list')} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
                     <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-blue-600/20">Complete Registration</Button>
                  </CardFooter>
               </form>
            </Card>
          </motion.div>
        )}

        {view === 'details' && selectedCard && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-1 space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-8 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl mb-6 transform -rotate-3">
                           <CreditCard className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold font-mono">{selectedCard.serialNumber}</h3>
                        <Badge variant="outline" className="mt-2 border-slate-200 dark:border-slate-800 uppercase text-[9px]">{selectedCard.status}</Badge>
                     </div>
                     <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-400">NFC Code</span>
                           <span className="font-mono font-bold">{selectedCard.nfcCode}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-400">Project</span>
                           <span className="font-bold">{selectedCard.project}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-400">Registered</span>
                           <span className="font-bold">{selectedCard.dateRegistered}</span>
                        </div>
                        {selectedCard.batchNumber && (
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400">Batch</span>
                              <span className="font-bold">{selectedCard.batchNumber}</span>
                           </div>
                        )}
                     </div>
                  </Card>

                  <Card className="border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-sm">
                     <h4 className="font-bold text-sm mb-4">Actions</h4>
                     <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start rounded-xl h-11">
                           <Edit2 className="w-4 h-4 mr-2 text-blue-500" /> Edit Details
                        </Button>
                        {selectedCard.status === 'Active' ? (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start rounded-xl h-11 text-amber-600 border-amber-100 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                            onClick={() => {
                               updateCard({ ...selectedCard, status: 'Inactive' });
                               setSelectedCard({ ...selectedCard, status: 'Inactive' });
                               toast.info('Card deactivated');
                            }}
                          >
                             <ShieldAlert className="w-4 h-4 mr-2" /> Deactivate Card
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full justify-start rounded-xl h-11 text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                            onClick={() => {
                               updateCard({ ...selectedCard, status: 'Active' });
                               setSelectedCard({ ...selectedCard, status: 'Active' });
                               toast.success('Card activated');
                            }}
                          >
                             <ShieldCheck className="w-4 h-4 mr-2" /> Activate Card
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start rounded-xl h-11 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                             if(confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
                                deleteCard(selectedCard.serialNumber);
                                setView('list');
                                toast.success('Card deleted');
                             }
                          }}
                        >
                           <Trash2 className="w-4 h-4 mr-2" /> Delete Permanently
                        </Button>
                     </div>
                  </Card>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  {/* User Linkage Section */}
                  <Card className="border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                     <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold flex items-center gap-2">
                           <UserIcon className="w-5 h-5 text-blue-600" />
                           User Association
                        </h4>
                        {selectedCard.userId && (
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-red-600 h-8 font-bold"
                              onClick={() => handleUnlinkCard(selectedCard.serialNumber)}
                           >
                              <Unlink className="w-3 h-3 mr-1.5" /> Unlink User
                           </Button>
                        )}
                     </div>
                     <div className="p-8">
                        {selectedCard.userId ? (
                           <div className="flex flex-col md:flex-row items-center gap-8">
                              <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-bold text-blue-600 border border-blue-100 dark:border-blue-800">
                                 {selectedCard.userName?.charAt(0)}
                              </div>
                              <div className="flex-1 text-center md:text-left space-y-4">
                                 <div>
                                    <h5 className="text-2xl font-bold">{selectedCard.userName}</h5>
                                    <p className="text-slate-500 font-mono">ID: {selectedCard.userId}</p>
                                 </div>
                                 <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[9px]">Linked</Badge>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 uppercase text-[9px]">{selectedCard.project}</Badge>
                                 </div>
                                 <div className="flex gap-3 pt-2 justify-center md:justify-start">
                                    <Button size="sm" className="rounded-lg h-9" onClick={() => setIsLinkModalOpen(true)}>
                                       <ArrowRightLeft className="w-3.5 h-3.5 mr-2" /> Change Linkage
                                    </Button>
                                    <Button variant="ghost" size="sm" className="rounded-lg h-9">
                                       <ExternalLink className="w-3.5 h-3.5 mr-2" /> View User Profile
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="text-center py-10 space-y-6">
                              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                 <LinkIcon className="w-8 h-8 text-slate-300" />
                              </div>
                              <div>
                                 <h5 className="text-lg font-bold">No User Linked</h5>
                                 <p className="text-sm text-slate-500">This card is available for assignment to a user in the <strong>{selectedCard.project}</strong> project.</p>
                              </div>
                              <Button className="rounded-xl px-8 bg-blue-600" onClick={() => setIsLinkModalOpen(true)}>
                                 <Plus className="w-4 h-4 mr-2" /> Link to User
                              </Button>
                           </div>
                        )}
                     </div>
                  </Card>

                  {/* Card Logs */}
                  <Card className="border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                     <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                        <h4 className="font-bold flex items-center gap-2">
                           <HistoryIcon className="w-5 h-5 text-blue-600" />
                           Activity Logs
                        </h4>
                     </div>
                     <div className="p-6 space-y-6">
                        {[
                           { action: 'NFC Read Success', time: '1 hour ago', device: 'POS Terminal #102' },
                           { action: 'User Association Changed', time: '2 days ago', device: 'Admin Panel (Sarah W.)' },
                           { action: 'Card Registered', time: '5 days ago', device: 'System Admin' }
                        ].map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between">
                                    <p className="text-sm font-bold">{log.action}</p>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{log.time}</span>
                                 </div>
                                 <p className="text-xs text-slate-500">{log.device}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center">
                        <Button variant="link" className="text-xs font-bold uppercase text-slate-400">View Full Activity History</Button>
                     </div>
                  </Card>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link User Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 overflow-hidden border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Link Card to User</DialogTitle>
            <DialogDescription className="text-slate-500">
               Select a user from the <strong>{selectedCard?.project}</strong> project to link with card <strong>{selectedCard?.serialNumber}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Select Available User</Label>
              <Select value={userToLink} onValueChange={setUserToLink}>
                <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium">
                  <SelectValue placeholder="Search for unlinked users..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.length > 0 ? (
                    availableUsers.map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                              {u.name.charAt(0)}
                           </div>
                           <span>{u.name}</span>
                           <span className="text-[10px] opacity-50">({u.id})</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">No available users in this project</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {availableUsers.length === 0 && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  There are no unassigned users registered in the <strong>{selectedCard?.project}</strong> project. Please register users first in User Management.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsLinkModalOpen(false)} className="rounded-xl h-11 px-6">Cancel</Button>
            <Button 
              disabled={!userToLink} 
              onClick={handleLinkCard}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-blue-600/20"
            >
              Confirm Linkage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BulkCardImport 
        isOpen={isBulkImportOpen} 
        onClose={() => setIsBulkImportOpen(false)} 
      />
    </div>
  );
}