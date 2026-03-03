import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Moon, Sun, Search, Bell } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'User Management', path: '/users' },
  { icon: CreditCard, label: 'Card Management', path: '/cards' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar variant="sidebar" collapsible="icon">
          <div className="flex items-center gap-2 px-4 py-6 border-b">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <CreditCard size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">CARDLY</span>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Main Menu</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.path}
                      className="transition-all duration-200"
                    >
                      <Link to={item.path} className="flex items-center gap-3 w-full">
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <div className="mt-auto p-4 border-t flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 max-w-md w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input placeholder="Global Search..." className="pl-10 bg-muted/30 border-none h-9 w-full focus-visible:ring-primary/20 transition-all" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              
              <div className="h-8 w-px bg-border mx-1" />
              
              <div className="flex items-center gap-3 ml-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold leading-none">Admin User</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shadow-sm overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="avatar" />
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}