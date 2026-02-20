import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, ShoppingCart, Dumbbell, Video, MapPin, Utensils, Newspaper, Search, Shield } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const navLinks = [
    { path: '/store', label: 'Store', icon: ShoppingCart },
    { path: '/fitube', label: 'FiTube', icon: Video },
    { path: '/workout-tracker', label: 'Workout', icon: Dumbbell },
    { path: '/running', label: 'Running', icon: MapPin },
    { path: '/food', label: 'Food', icon: Utensils },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/search', label: 'Search', icon: Search },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/assets/generated/logo.dim_200x200.png" alt="FIT AMIGO" className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-energetic-orange via-vibrant-green to-bold-red bg-clip-text text-transparent">
              FIT AMIGO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path || (link.path === '/store' && currentPath === '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-energetic-orange text-white shadow-md'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {identity && isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPath.startsWith('/admin')
                    ? 'bg-energetic-orange text-white shadow-md'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Desktop Login */}
          <div className="hidden md:block">
            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.path || (link.path === '/store' && currentPath === '/');
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-energetic-orange text-white'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              {identity && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    currentPath.startsWith('/admin')
                      ? 'bg-energetic-orange text-white'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="mt-4 px-4">
                <LoginButton />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
