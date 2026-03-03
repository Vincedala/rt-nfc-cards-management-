import React from 'react';
import { 
  BarChart3, 
  Download, 
  PieChart as PieChartIcon, 
  ArrowRight, 
  FileSpreadsheet,
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { cn } from '../lib/utils';

const data = [
  { name: 'Linked', value: 2530, color: '#2563eb' },
  { name: 'Unlinked', value: 1200, color: '#94a3b8' },
  { name: 'Lost/Inactive', value: 450, color: '#ef4444' },
];

const projectData = [
  { name: 'Kilimo', active: 850, pending: 350 },
  { name: 'Gikomba', active: 1200, pending: 1300 },
  { name: 'Ruiru', active: 480, pending: 20 },
];

export default function Reports() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
          <p className="text-slate-500">Gain insights into your card distribution and usage.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium hover:bg-slate-50">
             <Calendar className="w-4 h-4" />
             Month to Date
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg transition-all">
             <Download className="w-4 h-4" />
             Export All Data
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Status Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Card Status Distribution</h3>
              <PieChartIcon className="w-5 h-5 text-slate-400" />
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Project Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Project Card Summary</h3>
              <BarChart3 className="w-5 h-5 text-slate-400" />
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="active" name="Linked Cards" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Available Cards" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { title: "Card Status Report", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
           { title: "User-Card Link Report", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
           { title: "Project Summary Report", icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50" }
         ].map((report) => (
           <div key={report.title} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all group cursor-pointer">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", report.bg)}>
                <report.icon className={cn("w-6 h-6", report.color)} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{report.title}</h4>
              <p className="text-sm text-slate-500 mb-4">Generate and download a detailed breakdown in CSV format.</p>
              <div className="flex items-center text-sm font-bold text-blue-600 group-hover:gap-3 gap-2 transition-all">
                Download Report
                <ArrowRight className="w-4 h-4" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}