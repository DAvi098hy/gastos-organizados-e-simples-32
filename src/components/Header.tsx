
import React from 'react';
import { Wallet, Moon, Sun, Plus, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onQuickAdd?: () => void;
  onQuickStats?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme, onQuickAdd, onQuickStats }) => {
  return (
    <div className="relative mb-8">
      {/* Modern background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-violet-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-violet-950/10 dark:to-pink-950/20 rounded-3xl blur-3xl -z-10"></div>
      
      <div className="text-center relative">
        {/* Floating action buttons */}
        <div className="absolute top-0 right-0 flex items-center gap-2">
          <Button
            onClick={onQuickAdd}
            className="btn-primary px-4 py-2 h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>

          <Button
            onClick={onQuickStats}
            className="btn-secondary px-4 py-2 h-10"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <Button
            onClick={onToggleTheme}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-slate-200/50 hover:bg-white/80 dark:border-slate-700/50 dark:hover:bg-slate-800/80 transition-all duration-200"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </Button>
        </div>

        {/* Main logo and title */}
        <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 rounded-3xl shadow-elegant-xl mb-6 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Wallet className="text-white h-7 w-7" />
            </div>
            <Sparkles className="text-white/60 h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-violet-700 dark:from-white dark:via-blue-300 dark:to-violet-300 bg-clip-text text-transparent">
            FinanceAI
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Controle inteligente das suas finanças com{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">IA avançada</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
