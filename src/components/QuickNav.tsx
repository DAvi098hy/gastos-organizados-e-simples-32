
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutDashboard, BarChart3, Target, Bell, Settings2 } from 'lucide-react';

interface QuickNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications?: number;
}

const QuickNav: React.FC<QuickNavProps> = ({ activeTab, onTabChange, unreadNotifications = 0 }) => {
  const mainTabs = [
    { id: 'add', label: 'Adicionar', icon: PlusCircle, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'view', label: 'Transações', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'budget', label: 'Orçamento', icon: BarChart3, gradient: 'from-violet-500 to-purple-500' },
    { id: 'goals', label: 'Metas', icon: Target, gradient: 'from-pink-500 to-rose-500' },
  ];

  const secondaryTabs = [
    { id: 'notifications', label: 'Alertas', icon: Bell, badge: unreadNotifications },
    { id: 'categories', label: 'Categorias', icon: Settings2 },
  ];

  return (
    <div className="card-glass rounded-3xl shadow-elegant-lg border p-6 mb-8 animate-fadeIn">
      {/* Main navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative h-20 flex-col gap-2 rounded-2xl transition-all duration-300 group overflow-hidden
                ${isActive 
                  ? `bg-gradient-to-br ${tab.gradient} text-white shadow-elegant-lg scale-105` 
                  : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:scale-102 shadow-elegant'
                }
              `}
              variant="ghost"
            >
              {/* Subtle glow effect for active tab */}
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} opacity-20 blur-xl`}></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Icon className={`h-6 w-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Secondary navigation */}
      <div className="flex justify-center gap-3">
        {secondaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`
                relative rounded-xl transition-all duration-200 px-4 py-2
                ${isActive 
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-elegant' 
                  : 'hover:bg-white/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                }
              `}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
              
              {/* Notification badge */}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickNav;
