'use client';

import { ReactNode } from 'react';
import { Search, Bell, Settings2, User } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="glass-card mx-4 mt-4 mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gradient">NutriGenius</h1>
            <nav className="hidden md:flex space-x-6">
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">
                Dashboard
              </button>
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">
                Meals
              </button>
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">
                Goals
              </button>
              <button className="text-text-secondary hover:text-text-primary transition-colors duration-200">
                Progress
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="input-field pl-10 w-64"
              />
            </div>
            
            {/* Notifications */}
            <button className="p-2 hover:bg-surface/60 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5 text-text-secondary" />
            </button>
            
            {/* Settings */}
            <button className="p-2 hover:bg-surface/60 rounded-lg transition-colors duration-200">
              <Settings2 className="w-5 h-5 text-text-secondary" />
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2 glass-card px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-text-primary hidden sm:block">
                User
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
}
