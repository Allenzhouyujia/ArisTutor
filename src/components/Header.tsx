import { useState } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, Menu, X, Users, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface HeaderProps {
  user?: User | null;
  onNavigate: (page: string) => void;
  onSignOut?: () => void;
  unreadCount?: number;
  onToggleNotifications?: () => void;
  isLoggedIn?: boolean;
  currentMode?: 'student' | 'tutor';
  onModeChange?: (mode: 'student' | 'tutor') => void;
}

export function Header({ 
  user, 
  onNavigate, 
  onSignOut, 
  unreadCount = 0, 
  onToggleNotifications,
  isLoggedIn = !!user,
  currentMode = 'student',
  onModeChange
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMode = async () => {
    if (!user || !onModeChange) return;
    
    const newMode = currentMode === 'student' ? 'tutor' : 'student';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newMode })
        .eq('id', user.id);

      if (error) throw error;

      user.role = newMode;
      onModeChange(newMode);
      toast.success(`Switched to ${newMode} mode`);
    } catch (error: any) {
      console.error('Error switching mode:', error);
      toast.error('Failed to switch mode');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <span className="text-xl">
              <span className="font-semibold text-gray-900">Aris</span>
              <span className="text-cyan-400">Tutor</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-blue-500">Dashboard</button>
                <button onClick={() => onNavigate('tutor-profile')} className="text-gray-600 hover:text-blue-500">Find Tutors</button>
                <button onClick={() => onNavigate('session')} className="text-gray-600 hover:text-blue-500">Sessions</button>
                <button onClick={() => onNavigate('qa')} className="text-gray-600 hover:text-blue-500">Q&A</button>
                <button onClick={() => onNavigate('notes')} className="text-gray-600 hover:text-blue-500">Notes</button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('landing')} className="text-gray-600 hover:text-blue-500">Home</button>
                <button onClick={() => onNavigate('features')} className="text-gray-600 hover:text-blue-500">Features</button>
                <button onClick={() => onNavigate('pricing')} className="text-gray-600 hover:text-blue-500">Pricing</button>
              </>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && user ? (
              <>
                <button
                  onClick={toggleMode}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                    currentMode === 'tutor' 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {currentMode === 'tutor' ? (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Tutor Mode</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>Student Mode</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => onNavigate('wallet')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  💰 {user.credits}
                </button>
                
                <button onClick={onToggleNotifications} className="relative">
                  <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white cursor-pointer">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block border border-gray-100">
                    <button onClick={() => onNavigate('dashboard')} className="w-full text-left px-4 py-2 hover:bg-gray-50">Profile</button>
                    <button onClick={onSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">Sign Out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('auth')} className="text-gray-600 hover:text-blue-500 font-medium">
                  Log in
                </button>
                <button onClick={() => onNavigate('auth')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {isLoggedIn && (
              <button onClick={onToggleNotifications} className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {isLoggedIn && user ? (
              <>
                <div className="px-3 py-3 border-b border-gray-100 mb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={toggleMode}
                    className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 justify-center transition-colors ${
                      currentMode === 'tutor' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {currentMode === 'tutor' ? (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Tutor Mode</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        <span>Student Mode</span>
                      </>
                    )}
                  </button>
                </div>
                
                <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</button>
                <button onClick={() => { onNavigate('tutor-profile'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Find Tutors</button>
                <button onClick={() => { onNavigate('session'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Sessions</button>
                <button onClick={() => { onNavigate('qa'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Q&A</button>
                <button onClick={() => { onNavigate('wallet'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">Wallet (💰 {user.credits})</button>
                <button onClick={() => { onSignOut?.(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('landing'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</button>
                <button onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">Log in</button>
                <button onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50">Sign up</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}