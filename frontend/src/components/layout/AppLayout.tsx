import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { OnlineIndicator } from '@/components/common/OnlineIndicator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  Calendar,
  FileText,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Briefcase,
  ClipboardList,
  Users2,
  FolderKanban,
  FolderOpen,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { title: 'Employees', href: '/app/employees', icon: Users },
  { title: 'Departments', href: '/app/departments', icon: Building2 },
  { title: 'Attendance', href: '/app/attendance', icon: Clock },
  { title: 'Leaves', href: '/app/leaves', icon: Calendar },
  { title: 'Projects', href: '/app/projects', icon: FolderKanban, roles: ['ADMIN', 'MANAGER'] },
  { title: 'My Projects', href: '/app/my-projects', icon: FolderOpen, roles: ['EMPLOYEE'] },

  { title: 'Documents', href: '/app/documents', icon: FileText, roles: ['ADMIN', 'HR'] },
  { title: 'Reports', href: '/app/reports', icon: BarChart3, roles: ['ADMIN', 'HR', 'MANAGER'] },
  { title: 'Admin Users', href: '/app/admin/users', icon: Users, roles: ['ADMIN'] },
];

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar transition-all duration-300 flex flex-col",
          collapsed ? "w-[70px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">EMS</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden lg:flex text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "absolute -right-3 top-5 bg-sidebar border border-sidebar-border rounded-full w-6 h-6"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && <span className="font-medium">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User menu */}
        <div className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 w-full rounded-lg p-2 hover:bg-sidebar-accent transition-colors",
                collapsed && "justify-center"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email}</p>
                    <p className="text-xs text-sidebar-muted">{user?.role}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/app/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {/*<DropdownMenuItem asChild>
                <Link to="/app/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>*/}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Date - shown on left on desktop, right on mobile */}
          <div className="flex-1">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          {/* Online indicator */}
          {user && (
            <div className="flex items-center gap-4">
              <OnlineIndicator 
                firstName={user.firstName || ''} 
                lastName={user.lastName || ''} 
                email={user.email || ''}
              />
              <span className="text-sm text-muted-foreground sm:hidden">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children ?? (
            <div className="p-6 text-red-500">
              Page rendered but no content returned
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
