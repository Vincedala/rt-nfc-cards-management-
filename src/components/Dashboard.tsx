import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { useAppStore } from '../hooks/useAppStore';
import { Users, CreditCard, Activity, ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function Dashboard() {
  const { users, cards } = useAppStore();

  const metrics = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      change: '+12%',
      changeType: 'positive',
      description: 'Active across all departments'
    },
    {
      title: 'Active Cards',
      value: cards.filter(c => c.status === 'Active').length,
      icon: CreditCard,
      change: '+3.5%',
      changeType: 'positive',
      description: 'Currently operational cards'
    },
    {
      title: 'Unlinked Cards',
      value: cards.filter(c => !c.userId).length,
      icon: Activity,
      change: '-5%',
      changeType: 'negative',
      description: 'Inventory available for assignment'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: ShieldCheck,
      change: 'Stable',
      changeType: 'neutral',
      description: 'System uptime and security status'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Overview</h1>
        <p className="text-muted-foreground text-lg">System analytics and performance metrics for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-none shadow-sm ring-1 ring-border/60 hover:ring-primary/40 transition-all duration-300 group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <metric.icon size={64} className="text-primary" />
             </div>
            <CardHeader className="p-6 pb-2">
               <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                {metric.title}
                 {metric.changeType === 'positive' && <span className="text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={14} /> {metric.change}</span>}
                 {metric.changeType === 'negative' && <span className="text-destructive flex items-center gap-0.5"><ArrowDownRight size={14} /> {metric.change}</span>}
                 {metric.changeType === 'neutral' && <span className="text-primary font-semibold">{metric.change}</span>}
              </CardDescription>
              <CardTitle className="text-4xl font-black pt-2 tracking-tighter">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
               <p className="text-xs text-muted-foreground font-medium">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Recent Linkages</CardTitle>
              <CardDescription>Latest card assignments across the system.</CardDescription>
            </div>
            <Badge variant="outline" className="h-6 font-semibold bg-muted/20 border-none ring-1 ring-border/40">Real-time Feed</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary ring-1 ring-border/40 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">User Assignment {i}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">RFID Card #7788-2233-{i}00{i}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                       <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                         <ShieldCheck size={10} /> VERIFIED
                       </p>
                       <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                         <Clock size={10} /> {i * 15} mins ago
                       </p>
                    </div>
                  </div>
               ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Button variant="outline" className="w-full justify-start h-12 gap-3 border-none ring-1 ring-border/60 bg-muted/20 hover:bg-primary hover:text-white transition-all">
              <Users size={18} />
              <span className="font-semibold text-sm">Add New System User</span>
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 gap-3 border-none ring-1 ring-border/60 bg-muted/20 hover:bg-primary hover:text-white transition-all">
              <CreditCard size={18} />
              <span className="font-semibold text-sm">Register Batch Cards</span>
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 gap-3 border-none ring-1 ring-border/60 bg-muted/20 hover:bg-destructive hover:text-white transition-all">
              <AlertCircle size={18} />
              <span className="font-semibold text-sm">Revoke User Access</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}