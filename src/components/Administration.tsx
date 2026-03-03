import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  FileText, 
  Settings as SettingsIcon, 
  Users,
  ChevronLeft,
  Search,
  Plus,
  Save,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Filter,
  Download,
  UserPlus,
  ShieldCheck,
  ShieldHalf,
  UserCog,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { useAppStore } from '../hooks/useAppStore';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

// --- SUB-COMPONENTS ---

// 1. Role Management
const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: '1', name: 'Super Admin', permissions: ['all'], members: 2, status: 'Active' },
    { id: '2', name: 'Project Admin', permissions: ['create_project', 'view_reports', 'manage_users'], members: 5, status: 'Active' },
    { id: '3', name: 'Operator', permissions: ['link_card', 'unlink_card', 'view_reports'], members: 12, status: 'Active' },
    { id: '4', name: 'Viewer', permissions: ['view_reports'], members: 8, status: 'Active' },
  ]);

  const permissionList = [
    { id: 'create_project', label: 'Create Project' },
    { id: 'delete_project', label: 'Delete Project' },
    { id: 'link_card', label: 'Link Card' },
    { id: 'unlink_card', label: 'Unlink Card' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_api', label: 'Manage API Keys' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-slate-900 dark:text-white">
        <div>
          <h2 className="text-xl font-bold">Role Management</h2>
          <p className="text-sm text-muted-foreground">Define and manage platform access levels</p>
        </div>
        <Button className="rounded-xl flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className="p-4 bg-card border border-border rounded-2xl hover:border-blue-500 cursor-pointer transition-all shadow-sm bg-white dark:bg-slate-900"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{role.name}</h3>
                <Badge variant={role.status === 'Active' ? 'default' : 'secondary'} className="rounded-md">{role.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{role.members} Members assigned</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.includes('all') ? (
                  <Badge variant="outline" className="text-[10px] rounded-sm">All Permissions</Badge>
                ) : (
                  role.permissions.slice(0, 3).map(p => (
                    <Badge key={p} variant="outline" className="text-[10px] rounded-sm">{p.replace('_', ' ')}</Badge>
                  ))
                )}
                {role.permissions.length > 3 && (
                  <Badge variant="outline" className="text-[10px] rounded-sm">+{role.permissions.length - 3} more</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <Card className="md:col-span-2 border-border shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle>Role Details: Project Admin</CardTitle>
            <CardDescription>Configure granular permissions for this role</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input defaultValue="Project Admin" className="rounded-xl" />
              </div>
              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {permissionList.map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/30 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800">
                      <Label htmlFor={perm.id} className="cursor-pointer text-sm">{perm.label}</Label>
                      <Switch id={perm.id} defaultChecked={['create_project', 'view_reports', 'manage_users'].includes(perm.id)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6 flex justify-end gap-3">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 px-8">Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// 2. User Roles & Permissions
const UserPermissions = () => {
  const { users, updateUser } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Super Admin': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Project Admin': return <ShieldHalf className="w-3.5 h-3.5" />;
      case 'Operator': return <UserCog className="w-3.5 h-3.5" />;
      default: return <UserIcon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-slate-900 dark:text-white">
        <div>
          <h2 className="text-xl font-bold">User Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground">Manage system access for administrators and staff</p>
        </div>
        <Link to="/users">
          <Button 
            className="rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold"
            onClick={() => {
              toast.info('Redirecting to User Management to register a new account');
            }}
          >
            <UserPlus size={16} /> Create New Admin
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search system users..." 
            className="pl-10 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Project Admin">Project Admin</SelectItem>
              <SelectItem value="Operator">Operator</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 flex gap-2 rounded-xl border-slate-200 dark:border-slate-800">
            <Filter size={18} /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <TableHead className="text-slate-900 dark:text-white font-bold">User</TableHead>
              <TableHead className="text-slate-900 dark:text-white font-bold">System Role</TableHead>
              <TableHead className="text-slate-900 dark:text-white font-bold">Project</TableHead>
              <TableHead className="text-slate-900 dark:text-white font-bold">Status</TableHead>
              <TableHead className="text-right text-slate-900 dark:text-white font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 border-slate-100 dark:border-slate-800">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="text-blue-500">
                      {getRoleIcon(user.role)}
                    </div>
                    <Select 
                      defaultValue={user.role} 
                      onValueChange={(val) => {
                        updateUser({ ...user, role: val as any });
                        toast.success(`Role updated for ${user.name}`);
                      }}
                    >
                      <SelectTrigger className="w-[160px] h-9 border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 p-0 shadow-none font-medium text-sm text-slate-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Project Admin">Project Admin</SelectItem>
                        <SelectItem value="Operator">Operator</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                        <SelectItem value="Wallet User">Wallet User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.project}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'Active' ? 'default' : 'secondary'} 
                    className={cn(
                      "rounded-md text-[10px] uppercase font-bold",
                      user.status === 'Active' ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : ""
                    )}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem className="flex gap-2 cursor-pointer"><Shield size={14} /> Edit Permissions</DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2 cursor-pointer"><UserCog size={14} /> View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 flex gap-2 cursor-pointer"><AlertCircle size={14} /> Suspend Account</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs text-muted-foreground">Showing {filteredUsers.length} total users</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled className="h-8">Previous</Button>
            <Button variant="ghost" size="sm" className="h-8">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Audit Logs
const AuditLogs = () => {
  const [logs] = useState([
    { id: '1', action: 'LOGIN_SUCCESS', user: 'Sarah Wanjiku', ip: '192.168.1.1', timestamp: '2024-03-20 10:45:22', details: 'Successful login from Chrome/macOS' },
    { id: '2', action: 'ROLE_UPDATE', user: 'System', ip: '-', timestamp: '2024-03-20 09:12:05', details: 'Role "Operator" permissions modified' },
    { id: '3', action: 'LINK_CARD', user: 'John Kamau', ip: '192.168.1.45', timestamp: '2024-03-20 08:30:11', details: 'Card HP-8829-X linked to user USR-001' },
    { id: '4', action: 'EXPORT_DATA', user: 'Admin Sarah', ip: '192.168.1.1', timestamp: '2024-03-19 16:22:45', details: 'Full user inventory report exported to CSV' },
    { id: '5', action: 'API_KEY_CREATED', user: 'John Kamau', ip: '192.168.1.45', timestamp: '2024-03-19 14:10:00', details: 'New Production API key generated' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-slate-900 dark:text-white">
        <div>
          <h2 className="text-xl font-bold">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">Immutable history of critical platform actions</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 rounded-xl h-10 border-slate-200 dark:border-slate-800">
          <Download size={16} /> Export Logs
        </Button>
      </div>

      <Card className="border-border rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Search logs..." className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10">
              <Filter size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10">
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <TableHead className="font-bold text-slate-900 dark:text-white">Action</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-white">Performed By</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-white">IP Address</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-white">Timestamp</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-white">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 border-slate-100 dark:border-slate-800">
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px] py-0 px-2 rounded-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-900 dark:text-white">{log.user}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">{log.ip}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                <TableCell className="text-sm text-slate-700 dark:text-slate-300">{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs text-muted-foreground">Showing 5 of 1,245 logs</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled className="h-8">Previous</Button>
            <Button variant="ghost" size="sm" className="h-8">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// 4. System Settings
const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-slate-900 dark:text-white">
        <div>
          <h2 className="text-xl font-bold">System Settings</h2>
          <p className="text-sm text-muted-foreground">Global platform configuration and security policies</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 shadow-lg shadow-blue-600/20 text-white h-11 px-8 font-bold">Save All Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">Security Policies</CardTitle>
              <CardDescription>Configure session and password requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all administrative accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Session Timeout (Minutes)</Label>
                  <Input type="number" defaultValue="30" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Password Rotation (Days)</Label>
                  <Input type="number" defaultValue="90" className="rounded-xl h-11" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Brute Force Protection</Label>
                  <p className="text-sm text-muted-foreground">Lock account after 5 failed attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">Registration Rules</CardTitle>
              <CardDescription>Configure how cards and users are registered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Allowed ID Types</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['National ID', 'Passport', 'Voter ID', 'Driver License'].map(idType => (
                    <div key={idType} className="flex items-center gap-2">
                      <Switch id={idType} defaultChecked />
                      <Label htmlFor={idType} className="text-sm cursor-pointer">{idType}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Link Cards</Label>
                  <p className="text-sm text-muted-foreground">Automatically link new cards to users on registration</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-none shadow-sm">
            <div className="h-40 overflow-hidden relative">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/system-settings-configuration-a5f3db0d-1772570125356.webp" 
                alt="System Config"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white text-sm font-medium">Platform Health: Optimal</p>
              </div>
            </div>
            <CardContent className="p-6">
              <h4 className="font-bold mb-2">Maintenance Mode</h4>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                When active, only administrators can access the platform. Normal users will see a maintenance message.
              </p>
              <Button variant="outline" className="w-full text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50 rounded-xl h-10">
                Activate Maintenance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// 5. API Access
const ApiAccess = () => {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production Dashboard', key: 'pk_live_************************45f2', status: 'Active', created: '2024-01-10', lastUsed: '5 mins ago' },
    { id: '2', name: 'Mobile App Sync', key: 'pk_live_************************99a1', status: 'Active', created: '2024-02-15', lastUsed: '2 hours ago' },
    { id: '3', name: 'Testing Environment', key: 'pk_test_************************22b7', status: 'Revoked', created: '2023-11-01', lastUsed: '3 months ago' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-slate-900 dark:text-white">
        <div>
          <h2 className="text-xl font-bold">API Access</h2>
          <p className="text-sm text-muted-foreground">Manage secret keys for third-party integrations</p>
        </div>
        <Button className="rounded-xl flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 font-bold">
          <Plus size={16} /> Generate New Key
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4">
            {keys.map((key) => (
              <Card key={key.id} className="border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all group shadow-sm bg-white dark:bg-slate-900 border-none">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{key.name}</h3>
                      <p className="text-xs text-muted-foreground">Created on {key.created}</p>
                    </div>
                    <Badge variant={key.status === 'Active' ? 'default' : 'destructive'} className="rounded-md uppercase text-[10px] font-bold">{key.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 mb-4">
                    <code className="text-xs flex-1 truncate font-mono text-slate-700 dark:text-slate-300">{key.key}</code>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500">
                      <Copy size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500">
                      <EyeOff size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-emerald-500" /> Last used {key.lastUsed}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs h-8 rounded-lg">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-xs text-red-500 h-8 rounded-lg">Revoke</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-none rounded-3xl p-1 overflow-hidden shadow-xl">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/de99b6b7-b95e-4675-be9a-9433df810cc5/api-keys-management-0a9176e3-1772570126170.webp" 
              alt="API illustration"
              className="w-full h-48 object-cover rounded-t-[22px] opacity-80"
            />
            <div className="p-6 text-white">
              <h4 className="font-bold mb-2">API Documentation</h4>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Connect your card management system to your existing ERP or mobile apps using our secure REST API.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border-none rounded-xl h-11 shadow-lg shadow-blue-600/20 font-bold">
                View Documentation
              </Button>
            </div>
          </Card>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
              <AlertCircle size={18} />
              <p className="font-bold text-sm">Best Practice</p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed font-medium">
              Never share your secret keys in client-side code. Use environment variables and rotate keys every 90 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN ADMINISTRATION COMPONENT ---

export default function Administration() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sections = [
    { id: 'roles', title: 'Role Management', icon: Shield, desc: 'Define access levels and team permissions' },
    { id: 'users', title: 'User Roles & Permissions', icon: Users, desc: 'Assign permissions to specific users' },
    { id: 'audit', title: 'Audit Logs', icon: FileText, desc: 'Immutable history of all platform actions' },
    { id: 'api', title: 'API Access', icon: Key, desc: 'Manage secret keys for integrations' },
    { id: 'settings', title: 'System Settings', icon: SettingsIcon, desc: 'Configure global rules and security' },
  ];

  if (activeTab) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
        <button 
          onClick={() => setActiveTab(null)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group mb-2"
        >
          <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
            <ChevronLeft size={16} />
          </div>
          Back to Administration
        </button>

        {activeTab === 'roles' && <RoleManagement />}
        {activeTab === 'users' && <UserPermissions />}
        {activeTab === 'audit' && <AuditLogs />}
        {activeTab === 'api' && <ApiAccess />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Administration</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Global configuration and security command center.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 rounded-md font-bold text-[10px] uppercase tracking-wider">
            System Online
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 rounded-md font-bold text-[10px] uppercase tracking-wider">
            v2.4.0
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <button 
            key={section.id}
            onClick={() => {
              setActiveTab(section.id);
              toast.info(`Opening ${section.title}`);
            }}
            className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500 dark:hover:border-blue-400 hover:ring-8 hover:ring-blue-50 dark:hover:ring-blue-900/10 transition-all text-left group relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -mr-8 -mt-8 rounded-full group-hover:bg-blue-500/10 transition-colors" />
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all mb-6">
              <section.icon size={28} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">{section.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{section.desc}</p>
            <div className="mt-auto flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Manage Section <ChevronLeft size={14} className="rotate-180 ml-1" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8">
            <RefreshCw className="text-slate-100 dark:text-slate-800 w-24 h-24 opacity-20" />
          </div>
          <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100 relative z-10">System Health Status</h3>
          <div className="space-y-6 relative z-10">
            {[
              { label: 'Database Connection', status: 'Optimal', color: 'emerald' },
              { label: 'NFC HSM Module', status: 'Secured', color: 'emerald' },
              { label: 'Auth Service', status: 'Operational', color: 'emerald' },
              { label: 'API Gateway', status: 'Optimal', color: 'emerald' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", 
                    item.color === 'emerald' ? "bg-emerald-500 shadow-emerald-500/50" : "bg-slate-500 shadow-slate-500/50")} />
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider",
                    item.color === 'emerald' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400")}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 -mr-32 -mt-32 rounded-full blur-3xl" />
          <h3 className="text-xl font-bold mb-6 relative z-10">Active Security Alerts</h3>
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Unusual Login Pattern</p>
                <p className="text-[11px] text-slate-400">3 failed attempts from 197.232.x.x</p>
              </div>
              <span className="text-[10px] text-slate-500 font-medium uppercase">12m ago</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <SettingsIcon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">System Update Scheduled</p>
                <p className="text-[11px] text-slate-400">Security patches for NFC module v2.4.1</p>
              </div>
              <span className="text-[10px] text-slate-500 font-medium uppercase">2h ago</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-6 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-xs font-bold uppercase">
            View All Security Events
          </Button>
        </div>
      </div>
    </div>
  );
}