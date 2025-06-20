
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Table, BarChart3, Target, Bell, Settings } from 'lucide-react';

interface QuickNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications?: number;
}

const QuickNav: React.FC<QuickNavProps> = ({ activeTab, onTabChange, unreadNotifications = 0 }) => {
  const mainTabs = [
    { id: 'add', label: 'Adicionar', icon: PlusCircle, priority: 1 },
    { id: 'view', label: 'Lista', icon: Table, priority: 2 },
    { id: 'budget', label: 'Resumo', icon: BarChart3, priority: 3 },
    { id: 'goals', label: 'Metas', icon: Target, priority: 4 },
  ];

  const secondaryTabs = [
    { id: 'notifications', label: 'Alertas', icon: Bell, badge: unreadNotifications },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 mb-6">
      {/* Navegação principal */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={isActive ? "default" : "outline"}
              className={`relative h-16 flex-col gap-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Navegação secundária */}
      <div className="flex justify-center gap-2">
        {secondaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`relative rounded-xl ${
                isActive 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="h-4 w-4 mr-1" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
