import React from 'react';
import { CheckSquare, Calendar, BarChart2, CheckCircle2, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: 'tasks' | 'analytics' | 'calendar';
  setActiveTab: (tab: 'tasks' | 'analytics' | 'calendar') => void;
  username: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  username,
  onLogout
}) => {
  // Se o username for um email, extrai a parte amigável
  const displayName = React.useMemo(() => {
    if (username.includes('@')) {
      const namePart = username.split('@')[0];
      return namePart
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return username;
  }, [username]);

  // Pega a inicial do usuário para o avatar
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('tasks')}>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight hidden sm:block">TaskFlow</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'tasks'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden xs:block">Tarefas</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden xs:block">Análises</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'calendar'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden xs:block">Calendário</span>
          </button>
        </nav>

        {/* Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">
              {userInitial}
            </div>
            <span className="text-slate-700 text-sm font-medium hidden md:block" title={username}>
              {displayName}
            </span>
          </div>

          <button
            onClick={onLogout}
            title="Sair do aplicativo"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
