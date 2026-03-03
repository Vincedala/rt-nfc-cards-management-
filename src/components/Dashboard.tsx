import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Briefcase, 
  Link as LinkIcon, 
  Activity, 
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Upload,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useAppStore } from '../hooks/useAppStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const chartData = [
  { name: 'Jan', cards: 400, users: 240 },
  { name: 'Feb', cards: 300, users: 139 },
  { name: 'Mar', cards: 600, users: 980 },
  { name: 'Apr', cards: 800, users: 390 },
  { name: 'May', cards: 700, users: 480 },
  { name: 'Jun', cards: 900, users: 380 },
];

export default function Dashboard({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const { users, cards, projects, activities } = useAppStore();
  const [alerts, setAlerts] = useState([
    { id: 1, message: "Low inventory: Ruiru Community project has only 20 unlinked cards.", type: "warning" },
    { id: 2, message: "Bulk import of 500 users completed successfully.", type: "success" }
  ]);

  const stats = [
    { label: 'Total Cards', value: cards.length, change: '+12%', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Users', value: users.length, change: '+5%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Linked Cards', value: cards.filter(c => c.userId).length, change: '+18%', icon: LinkIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Projects', value: projects.length, change: '+2', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening with Helloopass today.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">Last updated: Just now</span>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={alert.id} 
                className={cn(
                  "p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-sm",
                  alert.type === 'warning' ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400" : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-400"
                )}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{alert.message}</p>
                </div>
                <button 
                  onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-2xl", stat.bg, "dark:bg-opacity-10")}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight",
                stat.change.startsWith('+') ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30" : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
              )}>
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider text-[10px]">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Issuance Activity</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Number of cards issued vs new users registered.</p>
              </div>
              <select className="text-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
                <option>Last 6 months</option>
                <option>Last 30 days</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="cards" name="Cards Issued" stroke="#2563eb" fillOpacity={1} fill="url(#colorCards)" strokeWidth={4} />
                  <Area type="monotone" dataKey="users" name="New Users" stroke="#10b981" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onNavigate('users')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-sm group-hover:bg-white/20">
                    <UserPlus className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-bold">Create User</span>
                </button>
                <button 
                  onClick={() => onNavigate('cards')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white transition-all group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-sm group-hover:bg-white/20">
                    <Plus className="w-5 h-5 text-emerald-600 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-bold">Register Card</span>
                </button>
                <button 
                  onClick={() => onNavigate('cards')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white transition-all group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-sm group-hover:bg-white/20">
                    <Upload className="w-5 h-5 text-purple-600 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-bold">Bulk Import</span>
                </button>
                <button 
                  onClick={() => onNavigate('cards')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white transition-all group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-sm group-hover:bg-white/20">
                    <LinkIcon className="w-5 h-5 text-orange-600 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-bold">Link Card</span>
                </button>
              </div>
            </div>

            {/* Project Performance */}
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Project Linked %</h3>
                <p className="text-slate-400 text-sm mb-8">Efficiency tracking across active groups.</p>
                <div className="space-y-6">
                  {projects.map((proj, idx) => (
                    <div key={proj.id}>
                      <div className="flex justify-between text-xs font-bold mb-2 text-slate-400 uppercase tracking-widest">
                        <span>{proj.name}</span>
                        <span className="text-white">{Math.round((proj.linkedCards / proj.totalCards) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(proj.linkedCards / proj.totalCards) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                          className={cn("h-full rounded-full", idx % 2 === 0 ? "bg-blue-500" : "bg-emerald-500")}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute top-0 right-0 p-8">
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activities.slice(0, 10).map((log, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={log.id} 
                className={cn(
                  "p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-default",
                  idx === 0 && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
              >
                <div className={cn(
                  "mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  log.action === 'LINK_CARD' ? "bg-purple-100 text-purple-600" :
                  log.action === 'CREATE_USER' ? "bg-blue-100 text-blue-600" :
                  log.action === 'BULK_IMPORT' ? "bg-emerald-100 text-emerald-600" :
                  log.action === 'DEACTIVATE_CARD' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                )}>
                  {log.action === 'LINK_CARD' ? <LinkIcon className="w-5 h-5" /> :
                   log.action === 'CREATE_USER' ? <UserPlus className="w-5 h-5" /> : 
                   log.action === 'BULK_IMPORT' ? <Upload className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="p-6 text-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-50 dark:border-slate-800 transition-colors uppercase tracking-widest">
            View Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}