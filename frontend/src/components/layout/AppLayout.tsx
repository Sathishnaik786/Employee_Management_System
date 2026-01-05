import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sidebarCollapseVariants, slideInLeftVariants } from '@/animations/motionVariants';

import { OnlineIndicator } from '@/components/common/OnlineIndicator';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { NotificationBell } from '@/components/common/NotificationBell';
import { ChatDrawer } from '@/components/common/ChatDrawer';
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
  MessageCircle,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { title: 'Employees', href: '/app/employees', icon: Users, roles: ['ADMIN', 'HR', 'MANAGER'] },
  { title: 'Departments', href: '/app/departments', icon: Building2 },
  { title: 'Attendance', href: '/app/attendance', icon: Clock },
  { title: 'Leaves', href: '/app/leaves', icon: Calendar },
  { title: 'Calendar', href: '/app/calendar', icon: Calendar },
  { title: 'Projects', href: '/app/projects', icon: FolderKanban, roles: ['ADMIN', 'MANAGER'] },
  { title: 'My Projects', href: '/app/my-projects', icon: FolderOpen, roles: ['EMPLOYEE'] },
  { title: 'Meet-ups', href: '/app/meetups', icon: Users2 },

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(2);

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex w-full bg-background">

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar flex flex-col",
          collapsed ? "w-[70px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        variants={sidebarCollapseVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        initial={false}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <img 
                src="/logo.png"
                alt="Logo" 
                className="w-8 h-8 rounded-lg object-contain"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <span className="font-semibold text-sidebar-foreground">EMS</span>
            </Link>
          )}
          {collapsed && (
            <img 
            src="/logo.png"
            alt="Logo" 
            className="w-8 h-8 rounded-lg object-contain"
            loading="eager"
            referrerPolicy="no-referrer"
          />
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
            {filteredNavItems.map((item, index) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <motion.div
                  key={item.href}
                  initial="initial"
                  animate="animate"
                  variants={slideInLeftVariants}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                      isActive && "text-sidebar-primary",
                      !isActive && "group-hover:scale-110"
                    )} />
                    {!collapsed && (
                      <motion.span
                        className="font-medium"
                        initial={{ opacity: collapsed ? 0 : 1 }}
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
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
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="profile"
                      className="w-full h-full object-cover"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm font-bold">{initials}</span>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-sidebar-muted">{user?.role} | {user?.email}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/app/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  View Profile
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
      </motion.aside>

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
          
          {/* Logo - visible on mobile */}
          <div className="lg:hidden mr-2">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <img 
              src="/logo.png"
              alt="YVI Employee MS Logo" 
              className="w-8 h-8 object-contain"
              loading="eager"
              referrerPolicy="no-referrer"
            />
              <span className="font-semibold text-sidebar-foreground">EMS</span>
            </Link>
          </div>
          
          {/* Left side: Date */}
          <div className="flex items-center">
            {/* Date - shown on desktop, hidden on mobile */}
            <span className="text-sm text-muted-foreground hidden lg:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          {/* Center: Global Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <GlobalSearch />
          </div>
          
          {/* Mobile: Search Icon */}
          <div className="lg:hidden mx-2">
            <GlobalSearch isMobile={true} />
          </div>
          
          {/* Right side: Chat, Notification, Profile */}
          <div className="ml-auto flex items-center gap-2">
            {/* Chat Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsChatOpen(true);
                setUnreadChatCount(0); // Clear unread count when opening chat
              }}
              className="relative"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white">
                  {unreadChatCount}
                </span>
              )}
            </Button>
            
            {/* Notification Bell */}
            <NotificationBell />
            
            {/* Online indicator (Profile) */}
            {user && (
              <OnlineIndicator 
                firstName={user.firstName || ''} 
                lastName={user.lastName || ''} 
                email={user.email || ''}
                profileImage={user.profile_image}
                position={user.position || ''}
              />
            )}
          </div>
        </header>
        
        {/* Chat Drawer */}
        <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children ?? (
              <div className="p-6 text-red-500">
                Page rendered but no content returned
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
