import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { signOut, lastActivity } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivity) / 1000);
      const remaining = Math.max(0, 300 - elapsed);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/thenovus.solutions_Puzzle-icon.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Milling Factory Sales
              </h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
              <Clock className={`w-4 h-4 ${timeRemaining < 60 ? 'text-red-500' : 'text-orange-500'}`} />
              <span className={`text-sm font-medium ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-700'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            <button
              onClick={() => onNavigate('settings')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                currentPage === 'settings'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
