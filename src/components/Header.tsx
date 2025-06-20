
import React from 'react';
import { Wallet, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <div className="text-center mb-16 relative">
      {/* Enhanced theme toggle button */}
      <div className="absolute top-0 right-0">
        <Button
          onClick={onToggleTheme}
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-white/30 dark:border-slate-600/30 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 rounded-2xl"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500 transition-transform duration-300 hover:rotate-12" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
          )}
        </Button>
      </div>

      {/* Enhanced icon container */}
      <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-500 rounded-3xl shadow-2xl mb-8 relative overflow-hidden group transition-all duration-300 hover:shadow-3xl hover:scale-105">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Wallet className="text-white h-10 w-10 relative z-10 transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Enhanced title with better gradients */}
      <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 transition-all duration-300 hover:scale-105">
        Organizador Financeiro
      </h1>
      
      {/* Enhanced subtitle */}
      <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm bg-white/20 dark:bg-slate-800/20 rounded-2xl p-6 shadow-lg border border-white/30 dark:border-slate-700/30">
        Categorize e organize suas despesas automaticamente com 
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-semibold"> inteligência artificial</span>
      </p>
    </div>
  );
};

export default Header;
