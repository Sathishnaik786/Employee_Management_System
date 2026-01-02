import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, Building2, Briefcase, ClipboardList } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  const { user } = useAuth();
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
    
    // Mock results based on user role
    const mockResults: SearchResult[] = [];
    
    if (user?.role === 'ADMIN' || user?.role === 'HR') {
      mockResults.push(
        { id: '1', type: 'employee', title: 'John Doe', subtitle: 'Software Engineer', href: '/app/employees/1' },
        { id: '2', type: 'employee', title: 'Jane Smith', subtitle: 'HR Manager', href: '/app/employees/2' },
        { id: '3', type: 'department', title: 'Engineering', href: '/app/departments/1' },
        { id: '4', type: 'department', title: 'Human Resources', href: '/app/departments/2' }
      );
    }
    
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      mockResults.push(
        { id: '5', type: 'project', title: 'Website Redesign', href: '/app/projects/1' },
        { id: '6', type: 'project', title: 'Mobile App Development', href: '/app/projects/2' },
        { id: '7', type: 'task', title: 'Fix login bug', href: '/app/projects/1/tasks/1' }
      );
    }
    
    if (user?.role === 'EMPLOYEE') {
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
  }, [query, user?.role]);

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
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Click '/' or Ctrl + / for search"
          className="pl-10 w-80 max-w-xs"
        />

      </div>
      
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 w-full bg-card border rounded-lg shadow-lg z-50 mt-2 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <a
                key={result.id}
                href={result.href}
                className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
              >
                {renderIcon(result.type)}
                <div>
                  <div className="font-medium">{result.title}</div>
                  {result.subtitle && (
                    <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                  )}
                </div>
              </a>
            ))
          ) : isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : query ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}