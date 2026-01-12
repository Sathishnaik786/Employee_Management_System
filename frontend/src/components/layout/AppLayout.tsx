import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sidebarCollapseVariants, slideInLeftVariants } from '@/animations/motionVariants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  ChevronDown,
  Dot,
  HelpCircle,
  ShieldCheck,
  LayoutTemplate,
  BookOpenCheck,
  Cpu
} from 'lucide-react';


interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { title: 'Meet-ups', href: '/app/meetups', icon: Users2 },
      ...(import.meta.env.VITE_ENABLE_DAILY_UPDATES === 'true' ? [
        { title: 'Daily Updates', href: '/app/updates/daily', icon: ClipboardList }
      ] : []),
      ...(import.meta.env.VITE_ENABLE_WEEKLY_UPDATES === 'true' ? [
        { title: 'Weekly Stand-out', href: '/app/updates/weekly', icon: LayoutTemplate }
      ] : []),
      ...(import.meta.env.VITE_ENABLE_MONTHLY_UPDATES === 'true' ? [
        { title: 'Monthly Updates', href: '/app/updates/monthly', icon: BookOpenCheck }
      ] : []),
      ...(import.meta.env.VITE_ENABLE_UPDATE_ANALYTICS === 'true' ? [
        { title: 'Progress & Analytics', href: '/app/updates/analytics', icon: BarChart3 }
      ] : []),
      ...((import.meta.env.VITE_ENABLE_UPDATE_REMINDERS === 'true' ||
        import.meta.env.VITE_ENABLE_AI_SUMMARIES === 'true' ||
        import.meta.env.VITE_ENABLE_EXPORTS === 'true') ? [
        { title: 'Intelligence', href: '/app/updates/automation', icon: Cpu }
      ] : []),
    ]
  },




  {
    label: 'Resources',
    items: [
      { title: 'Employees', href: '/app/employees', icon: Users, roles: ['ADMIN', 'HR', 'MANAGER'] },
      { title: 'Departments', href: '/app/departments', icon: Building2 },
      { title: 'Attendance', href: '/app/attendance', icon: Clock },
      { title: 'Leaves', href: '/app/leaves', icon: Calendar },
      { title: 'Calendar', href: '/app/calendar', icon: Calendar },
    ]
  },
  {
    label: 'Execution',
    items: [
      { title: 'Projects', href: '/app/projects', icon: FolderKanban, roles: ['ADMIN', 'MANAGER'] },
      { title: 'My Projects', href: '/app/my-projects', icon: FolderOpen, roles: ['EMPLOYEE'] },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { title: 'Documents', href: '/app/documents', icon: FileText, roles: ['ADMIN', 'HR'] },
      { title: 'Reports', href: '/app/reports', icon: BarChart3, roles: ['ADMIN', 'HR', 'MANAGER'] },
      { title: 'Admin Users', href: '/app/admin/users', icon: Users, roles: ['ADMIN'] },
    ]
  }
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

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('yvi_sidebar_sections');
    return saved ? JSON.parse(saved) : { Overview: true, Resources: true, Execution: true, Intelligence: true };
  });

  const toggleSection = (label: string) => {
    setExpandedSections(prev => {
      const next = { ...prev, [label]: !prev[label] };
      localStorage.setItem('yvi_sidebar_sections', JSON.stringify(next));
      return next;
    });
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  const filterItems = (items: NavItem[]) => {
    return items.filter(item => {
      if (!item.roles) return true;
      return user && item.roles.includes(user.role);
    });
  };

  return (
    <div className="h-screen flex w-full bg-background text-foreground overflow-hidden font-sans antialiased">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <TooltipProvider delayDuration={0}>
        <motion.aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-sidebar-border/30 overflow-hidden",
            "bg-[#0a0c10] lg:bg-[#0a0c10]/95 lg:backdrop-blur-2xl transition-all duration-500 ease-in-out",
            collapsed ? "w-[78px]" : "w-64",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
          animate={collapsed ? { width: 78 } : { width: 256 }}
          initial={false}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
          {/* Subtle Side Gradient */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-primary/10 to-transparent" />

          {/* Logo Section */}
          <div className={cn(
            "h-[72px] flex items-center shrink-0 border-b border-sidebar-border/10",
            collapsed ? "justify-center" : "px-6 justify-between"
          )}>
            <Link to="/app/dashboard" className="flex items-center gap-3.5 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-9 h-9 relative rounded-xl object-contain shadow-2xl shadow-primary/40 bg-white/5 p-1.5 border border-white/10"
                />
              </motion.div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <span className="font-heading font-bold text-lg tracking-[-0.02em] text-white leading-none">YVI TECH</span>
                  <span className="text-[9px] font-semibold text-primary/60 tracking-[0.3em] mt-1 uppercase">Enterprise Hub</span>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation Area */}
          <ScrollArea className="flex-1 scrollbar-premium px-4">
            <div className="py-8 space-y-10">
              {navGroups.map((group) => {
                const groupItems = filterItems(group.items);
                if (groupItems.length === 0) return null;

                const isExpanded = expandedSections[group.label] !== false;

                return (
                  <div key={group.label} className="space-y-2">
                    {!collapsed && (
                      <button
                        onClick={() => toggleSection(group.label)}
                        className="flex items-center justify-between w-full px-3 mb-3 group text-sidebar-muted/40 hover:text-sidebar-foreground transition-colors"
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-sidebar-muted/40 group-hover:text-primary/70 transition-colors">{group.label}</span>
                        <ChevronDown
                          size={10}
                          className={cn("transition-transform duration-300 opacity-30 group-hover:opacity-100", !isExpanded && "-rotate-90")}
                        />
                      </button>
                    )}

                    <div className="space-y-1">
                      <AnimatePresence initial={false}>
                        {(isExpanded || collapsed) && (
                          <motion.div
                            initial={collapsed ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden space-y-1"
                          >
                            {groupItems.map((item) => {
                              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');

                              return (
                                <Tooltip key={item.href}>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={item.href}
                                      onClick={() => setMobileOpen(false)}
                                      className={cn(
                                        "relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                        collapsed ? "justify-center mx-0" : "mx-0",
                                        isActive
                                          ? "bg-primary/5 text-primary"
                                          : "text-sidebar-muted/80 hover:text-white hover:bg-white/[0.04]"
                                      )}
                                    >
                                      {/* Active Indicator Bar */}
                                      {isActive && !collapsed && (
                                        <motion.div
                                          layoutId="activeTab"
                                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
                                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                      )}

                                      <item.icon className={cn(
                                        "h-[18px] w-[18px] shrink-0 transition-all duration-300 align-baseline",
                                        isActive ? "text-primary opacity-100" : "opacity-60 group-hover:opacity-100 group-hover:text-white"
                                      )} />

                                      {!collapsed && (
                                        <motion.span
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className={cn(
                                            "text-[13px] tracking-tight transition-colors duration-200",
                                            isActive ? "text-white font-semibold" : "text-sidebar-muted font-medium"
                                          )}
                                        >
                                          {item.title}
                                        </motion.span>
                                      )}

                                      {/* Dot for updates / items - Example */}
                                      {!collapsed && item.title === 'Inbox' && (
                                        <div className="ml-auto flex items-center justify-center h-5 px-1.5 rounded-full bg-primary/20 text-[10px] font-semibold text-primary border border-primary/20">
                                          12
                                        </div>
                                      )}
                                    </Link>
                                  </TooltipTrigger>
                                  {collapsed && (
                                    <TooltipContent side="right" className="bg-[#1a1c23] border-white/10 text-white font-bold rounded-lg px-3 py-1.5 ml-2 shadow-2xl">
                                      {item.title}
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* User & Footer Area */}
          <div className="p-4 bg-[#0a0c10]/40 border-t border-sidebar-border/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center gap-3 w-full rounded-2xl p-2.5 transition-all duration-300 group",
                  "bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] active:scale-[0.98]",
                  collapsed && "justify-center p-2"
                )}>
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/5 group-hover:ring-primary/40 transition-all shadow-xl shadow-black/40">
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt="p"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                          <span className="text-sm font-bold">{initials}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a0c10] shadow-glow" />
                  </div>

                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 text-left min-w-0"
                    >
                      <p className="text-sm font-semibold text-white truncate tracking-tight">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[10px] text-primary/60 font-medium truncate mt-0.5 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={10} /> {user?.role}
                      </p>
                    </motion.div>
                  )}
                  {!collapsed && (
                    <ChevronRight size={14} className="text-sidebar-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={collapsed ? "right" : "top"}
                align={collapsed ? "center" : "end"}
                className="w-64 glass-panel-dark border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ml-2"
              >
                <div className="px-3 py-4 mb-2 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-semibold text-primary tracking-[0.2em] mb-1 uppercase">Logged in as</p>
                  <p className="text-sm font-semibold text-white">{user?.email}</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-1 tracking-wider italic">Signature Verified</p>
                </div>

                <DropdownMenuItem asChild className="rounded-xl flex items-center gap-3 p-3 font-bold cursor-pointer group focus:bg-primary/20 focus:text-white">
                  <Link to="/app/profile">
                    <User className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                    Identity Hub
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold cursor-pointer group focus:bg-primary/20 focus:text-white">
                  <HelpCircle className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  Support Core
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10 my-1" />

                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-xl flex items-center gap-3 p-3 font-bold text-rose-400 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500"
                >
                  <LogOut className="h-4 w-4" />
                  Deauthorize Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {!collapsed && (
              <div className="mt-4 px-2 flex items-center justify-between text-[10px] font-black text-sidebar-muted/30 uppercase tracking-[0.1em]">
                <span>v2.4.0-ENT</span>
                <Dot className="text-primary animate-pulse" />
                <span>YVI TECH CORP</span>
              </div>
            )}
          </div>
        </motion.aside>
      </TooltipProvider>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-[72px] bg-background/80 backdrop-blur-xl border-b border-border/10 flex items-center px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2 hover:bg-sidebar-accent/50 rounded-xl"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Collapse Button (Desktop) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex mr-4 h-9 w-9 rounded-xl border border-border/40 hover:bg-muted/50 transition-all text-muted-foreground hover:text-primary active:scale-95"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>

          {/* Logo - visible on mobile */}
          <div className="lg:hidden mr-4">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 object-contain rounded-lg shadow-lg"
              />
              <span className="font-bold text-lg tracking-tighter">YVI</span>
            </Link>
          </div>

          {/* Page Details Shadow */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            <Calendar size={13} className="text-primary" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Center: Global Search */}
          <div className="hidden lg:block flex-1 max-w-xl mx-auto px-10">
            <GlobalSearch />
          </div>

          {/* Mobile: Search Icon */}
          <div className="lg:hidden mx-2">
            <GlobalSearch isMobile={true} />
          </div>

          {/* Right side: Chat, Notification, Profile */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/20 border border-border/30">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsChatOpen(true);
                  setUnreadChatCount(0);
                }}
                className="relative h-9 w-9 rounded-lg hover:bg-background hover:shadow-md transition-all group"
              >
                <MessageCircle size={18} className="group-hover:text-primary transition-colors" />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] font-semibold rounded-full flex items-center justify-center text-white ring-2 ring-background animate-pulse">
                    {unreadChatCount}
                  </span>
                )}
              </Button>

              <NotificationBell />
            </div>

            <div className="h-6 w-[1px] bg-border/40 mx-1 hidden sm:block" />

            {/* Profile with Quick Actions */}
            {user && (
              <OnlineIndicator
                firstName={user.firstName || ''}
                lastName={user.lastName || ''}
                email={user.email || ''}
                profileImage={user.profile_image}
                position={user.position || ''}
                role={user.role || ''}
              />
            )}
          </div>
        </header>

        {/* Chat Drawer */}
        <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-premium relative">
          {/* Subtle background blob */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 lg:p-10 max-w-[1600px] mx-auto relative z-10"
          >
            {children ?? (
              <div className="p-12 text-center text-rose-500 font-black tracking-widest border border-dashed border-rose-500/30 rounded-3xl">
                SYSTEM CORE ARCHIVE EMPTY - NO CONTENT RENDERED
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
