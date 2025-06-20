
import React from 'react';
import { Wallet, Moon, Sun, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onQuickAdd?: () => void;
  onQuickStats?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme, onQuickAdd, onQuickStats }) => {
  return (
    <div className="text-center mb-8 relative">
      {/* Barra de ações rápidas */}
      <div className="absolute top-0 right-0 flex items-center gap-2">
        {/* Botão de adição rápida */}
        <Button
          onClick={onQuickAdd}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 px-3 py-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>

        {/* Botão de estatísticas rápidas */}
        <Button
          onClick={onQuickStats}
          variant="outline"
          size="sm"
          className="rounded-xl shadow border-gray-200 hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700 px-3 py-2"
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Stats</span>
        </Button>

        {/* Botão de tema mais compacto */}
        <Button
          onClick={onToggleTheme}
          variant="outline"
          size="sm"
          className="rounded-xl shadow border-gray-200 hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700 px-2 py-2"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </Button>
      </div>

      {/* Ícone e título mais compactos */}
      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-2xl shadow-lg mb-4 transition-all duration-300 hover:shadow-xl">
        <Wallet className="text-white h-6 w-6" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3">
        Organizador Financeiro
      </h1>
      
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
        Controle suas finanças com <span className="font-semibold text-blue-600 dark:text-blue-400">inteligência artificial</span>
      </p>
    </div>
  );
};

export default Header;
