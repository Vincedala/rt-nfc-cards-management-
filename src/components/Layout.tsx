import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell 
} from 'lucide-react';
import { Toaster } from 'sonner';
import { cn } from '../lib/utils';
import { ModeToggle } from './ModeToggle';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'cards', label: 'Card Management', icon: CreditCard },
    { id: 'projects', label: 'Project Management', icon: Briefcase },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Administration', icon: Settings },
  ];

  const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/helloopass-logo-e072b4fb-1772567447608.webp";
  const AVATAR_URL = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/user-avatar-1-e7e73c25-1772567448514.webp";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className={cn(
        "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-40 fixed inset-y-0 lg:relative",
        isSidebarOpen ? "w-64" : "w-0 lg:w-20 lg:p-2 -translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between min-h-[64px]">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="HellooPass" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">HellooPass</span>
            </div>
          ) : (
            <img src={LOGO_URL} alt="Logo" className="w-8 h-8 rounded-lg mx-auto" />
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all whitespace-nowrap",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-slate-400 dark:text-slate-500"} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button className="w-full flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all whitespace-nowrap">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full w-64 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all focus:w-80 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={20} className="text-slate-600 dark:text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">Alex Muli</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</p>
              </div>
              <img 
                src={AVATAR_URL} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 ring-offset-2 dark:ring-offset-slate-900"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950/50 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;