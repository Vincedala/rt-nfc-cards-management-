import React, { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Search, Plus, CreditCard, MoreHorizontal, History, Shield, Trash2, Edit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import { format } from 'date-fns';

export function CardManagement() {
  const { cards, users, deleteCard, unlinkCardFromUser } = useAppStore();
  const [search, setSearch] = useState('');

  const filteredCards = cards.filter((c) =>
    c.cardNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getUserDetails = (userId?: string) => {
    if (!userId) return null;
    return users.find((u) => u.id === userId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle2 size={12} className="text-emerald-500" />;
      case 'Inactive': return <AlertCircle size={12} className="text-amber-500" />;
      case 'Blocked': return <AlertCircle size={12} className="text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Card Management</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Monitor card distribution, statuses, and usage history.</p>
        </div>
        <Button className="w-fit shadow-md hover:shadow-lg transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> Register New Card
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-border/60 bg-primary/5">
          <CardHeader className="p-4 pb-0">
             <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary">Total Registered</CardDescription>
             <CardTitle className="text-2xl font-bold pt-1">{cards.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               RFID: {cards.filter(c => c.type === 'RFID').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader className="p-4 pb-0">
             <CardDescription className="text-xs font-semibold uppercase tracking-wider">Active Cards</CardDescription>
             <CardTitle className="text-2xl font-bold pt-1 text-emerald-500">{cards.filter(c => c.status === 'Active').length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               SmartCard: {cards.filter(c => c.type === 'SmartCard').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader className="p-4 pb-0">
             <CardDescription className="text-xs font-semibold uppercase tracking-wider">Assigned</CardDescription>
             <CardTitle className="text-2xl font-bold pt-1 text-primary">{cards.filter(c => c.userId).length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               NFC: {cards.filter(c => c.type === 'NFC').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader className="p-4 pb-0">
             <CardDescription className="text-xs font-semibold uppercase tracking-wider">Unassigned</CardDescription>
             <CardTitle className="text-2xl font-bold pt-1 text-muted-foreground">{cards.filter(c => !c.userId).length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
               <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
               Blocked: {cards.filter(c => c.status === 'Blocked').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by card number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 ring-1 ring-border/60 focus-visible:ring-primary/20 transition-all border-none bg-muted/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Card Details</TableHead>
                  <TableHead className="font-semibold">Linked User</TableHead>
                  <TableHead className="font-semibold">Status & Type</TableHead>
                  <TableHead className="font-semibold">Last Used</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                       <div className="flex flex-col items-center gap-2">
                        <CreditCard className="h-10 w-10 opacity-20" />
                        <p className="font-medium">No cards found</p>
                       </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCards.map((card) => {
                    const user = getUserDetails(card.userId);
                    return (
                      <TableRow key={card.id} className="hover:bg-muted/20 transition-colors group">
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                               <CreditCard size={14} className="text-primary" />
                               <span className="font-mono font-bold text-foreground text-sm tracking-wide">{card.cardNumber}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 font-medium">ID: {card.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden ring-1 ring-border/40">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold">{user.name}</span>
                                <span className="text-[10px] text-muted-foreground">{user.role}</span>
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5 border-none bg-muted/30 text-muted-foreground">
                              Not Linked
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                             <div className="flex items-center gap-1.5">
                                {getStatusIcon(card.status)}
                                <span className="text-xs font-semibold">{card.status}</span>
                             </div>
                             <Badge variant="secondary" className="text-[10px] h-4 font-medium uppercase tracking-tighter">
                                {card.type}
                             </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                             <span className="text-xs font-medium text-foreground">
                               {card.lastUsed ? format(new Date(card.lastUsed), 'MMM dd, yyyy') : 'Never'}
                             </span>
                             <span className="text-[10px] text-muted-foreground">
                               {card.lastUsed ? format(new Date(card.lastUsed), 'HH:mm') : '-'}
                             </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 shadow-lg border-muted">
                              <DropdownMenuLabel>Card Operations</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <History size={14} /> Usage History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2">
                                <Edit size={14} /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {card.userId && (
                                <DropdownMenuItem 
                                  className="cursor-pointer gap-2 text-destructive font-medium"
                                  onClick={() => unlinkCardFromUser(card.userId!)}
                                >
                                  <Trash2 size={14} /> Unlink Card
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive font-medium" onClick={() => deleteCard(card.id)}>
                                <Trash2 size={14} /> Delete Card
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}