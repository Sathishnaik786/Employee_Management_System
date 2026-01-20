import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, Building2, Briefcase, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchResult {
  id: string;
  type: 'employee' | 'department' | 'project' | 'task';
  title: string;
  subtitle?: string;
  href: string;
}

interface GlobalSearchProps {
  isMobile?: boolean;
}

export function GlobalSearch({ isMobile = false }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, hasPermission } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobileView = useIsMobile();

  // Mock search function - in a real implementation, this would call the API
  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock results based on user permissions
    const mockResults: SearchResult[] = [];

    if (hasPermission('ems:employees:view') || hasPermission('ems:employees:manage')) {
      mockResults.push(
        { id: '1', type: 'employee', title: 'John Doe', subtitle: 'Software Engineer', href: '/app/employees/1' },
        { id: '2', type: 'employee', title: 'Jane Smith', subtitle: 'HR Manager', href: '/app/employees/2' },
        { id: '3', type: 'department', title: 'Engineering', href: '/app/departments/1' },
        { id: '4', type: 'department', title: 'Human Resources', href: '/app/departments/2' }
      );
    }

    if (hasPermission('ems:projects:view') || hasPermission('ems:projects:manage')) {
      mockResults.push(
        { id: '5', type: 'project', title: 'Website Redesign', href: '/app/projects/1' },
        { id: '6', type: 'project', title: 'Mobile App Development', href: '/app/projects/2' },
        { id: '7', type: 'task', title: 'Fix login bug', href: '/app/projects/1/tasks/1' }
      );
    }

    if (hasPermission('ems:projects:employee-view')) {
      mockResults.push(
        { id: '8', type: 'task', title: 'Complete documentation', href: '/app/projects/1/tasks/2' },
        { id: '9', type: 'project', title: 'Client Project', href: '/app/my-projects/1' }
      );
    }

    const filteredResults = mockResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filteredResults);
    setIsLoading(false);
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      search(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, user?.role, hasPermission]);

  // Handle clicks outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setIsOpen(true);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <Users className="h-4 w-4 text-muted-foreground" />;
      case 'department':
        return <Building2 className="h-4 w-4 text-muted-foreground" />;
      case 'project':
        return <Briefcase className="h-4 w-4 text-muted-foreground" />;
      case 'task':
        return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isMobileView || isMobile) {
    return (
      <div className="relative" ref={searchRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Toggle search"
        >
          <Search className="h-5 w-5" />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50 p-2">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-muted-foreground ml-1" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Click '/' or Ctrl + / for search"
                className="border-0 focus-visible:ring-0"
                autoFocus
              />
            </div>

            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                {results.map((result) => (
                  <a
                    key={result.id}
                    href={result.href}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    {renderIcon(result.type)}
                    <div>
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
            )}

            {!isLoading && results.length === 0 && query && (
              <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group/search" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within/search:text-primary" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Click '/' or Ctrl + / for search"
          className="pl-10 w-80 max-w-xs transition-all duration-300 focus:w-96 focus:max-w-md bg-muted/40 border-border/50 hover:bg-muted/60"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
          <kbd className="h-5 px-1.5 rounded border border-border/60 bg-background/50 text-[10px] font-medium text-muted-foreground shadow-sm">
            /
          </kbd>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 w-full glass-panel rounded-xl shadow-2xl z-50 mt-3 max-h-[480px] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-border/30 bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Results</span>
            </div>
            <ScrollArea className="flex-1 overflow-y-auto max-h-[400px]">
              <div className="p-2 space-y-1">
                {results.length > 0 ? (
                  results.map((result, idx) => (
                    <motion.a
                      key={result.id}
                      href={result.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-all group/result"
                    >
                      <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover/result:bg-primary/10 transition-colors">
                        {renderIcon(result.type)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-sm group-hover/result:text-primary transition-colors truncate">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">{result.subtitle}</div>
                        )}
                      </div>
                      <div className="opacity-0 group-hover/result:opacity-100 transition-opacity pr-2">
                        <div className="px-2 py-1 rounded bg-primary/10 text-[10px] font-bold text-primary uppercase">View</div>
                      </div>
                    </motion.a>
                  ))
                ) : isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Searching for your request...</p>
                  </div>
                ) : query ? (
                  <div className="p-12 text-center">
                    <div className="text-muted-foreground/30 mb-3 flex justify-center">
                      <Search size={48} />
                    </div>
                    <p className="font-medium text-sm">No results for "{query}"</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                  </div>
                ) : null}
              </div>
            </ScrollArea>
            <div className="p-3 bg-muted/30 border-t border-border/30 text-[10px] text-muted-foreground text-center">
              Press <kbd className="font-sans px-1 rounded border border-border/50 bg-background">ESC</kbd> to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}