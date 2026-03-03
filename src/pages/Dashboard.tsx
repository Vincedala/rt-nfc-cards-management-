import React from 'react';
import { Users, CreditCard, Briefcase, Link, ArrowUpRight, Activity as ActivityIcon } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';

const data = [
  { name: 'Mon', active: 400, linked: 240 },
  { name: 'Tue', active: 300, linked: 139 },
  { name: 'Wed', active: 200, linked: 980 },
  { name: 'Thu', active: 278, linked: 390 },
  { name: 'Fri', active: 189, linked: 480 },
  { name: 'Sat', active: 239, linked: 380 },
  { name: 'Sun', active: 349, linked: 430 },
];

const Dashboard: React.FC = () => {
  const { users, cards, projects, activities } = useAppStore();
  const { theme } = useTheme();

  const stats = [
    { label: 'Total Cards', value: cards.length, icon: CreditCard, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Linked Cards', value: cards.filter(c => c.userId).length, icon: Link, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Active Projects', value: projects.length, icon: Briefcase, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const tickColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Platform Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Quick Actions
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="flex items-center text-green-500 dark:text-green-400 text-sm font-medium">
                <ArrowUpRight size={16} /> 12%
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-100">Linking Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
                  }}
                  itemStyle={{ color: '#2563eb' }}
                />
                <Line type="monotone" dataKey="linked" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-100">Recent Activity</h3>
          <div className="space-y-6">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ActivityIcon size={14} className="text-slate-500 dark:text-slate-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{activity.details}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.timestamp} \u2022 {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;