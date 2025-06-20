
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import MainTabs from '@/components/MainTabs';
import BudgetSummary from '@/components/BudgetSummary';
import SpendingTrends from '@/components/SpendingTrends';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { Transaction } from '@/types/transaction';
import { SavingsGoal } from '@/types/goals';
import { Notification, NotificationSettings } from '@/types/notifications';
import { usePWA } from '@/hooks/usePWA';
import { useAutoBackup } from '@/hooks/useAutoBackup';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 3000;
  });

  const [dailyBudget, setDailyBudget] = useState(() => {
    const saved = localStorage.getItem('dailyBudget');
    return saved ? parseFloat(saved) : 100;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('savingsGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      budgetAlerts: true,
      goalReminders: true,
      weeklyReports: true,
      monthlyReports: true,
      expenseThreshold: 200,
    };
  });

  const { registerServiceWorker, isInstalled } = usePWA();

  // Sistema de backup automático
  useAutoBackup({
    transactions,
    monthlyBudget,
    dailyBudget,
    enabled: true
  });

  // Register Service Worker on component mount
  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('dailyBudget', dailyBudget.toString());
  }, [dailyBudget]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Show install success toast
  useEffect(() => {
    if (isInstalled) {
      toast.success('App instalado com sucesso! 🎉', {
        description: 'Agora você pode acessar o app diretamente da sua tela inicial.',
      });
    }
  }, [isInstalled]);

  // Sistema de notificações inteligentes
  useEffect(() => {
    const generateSmartNotifications = () => {
      const newNotifications: Notification[] = [];
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Verificar orçamento mensal
      const monthlyExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      if (notificationSettings.budgetAlerts && monthlyExpenses > monthlyBudget * 0.8) {
        const percentage = (monthlyExpenses / monthlyBudget) * 100;
        const existingAlert = notifications.find(n => 
          n.type === 'budget_warning' && 
          new Date(n.createdAt).toDateString() === today.toDateString()
        );

        if (!existingAlert) {
          newNotifications.push({
            id: `budget-warning-${Date.now()}`,
            type: 'budget_warning',
            title: 'Alerta de Orçamento',
            message: `Você já gastou ${percentage.toFixed(0)}% do seu orçamento mensal`,
            createdAt: new Date().toISOString(),
            isRead: false,
            priority: percentage > 100 ? 'high' : 'medium',
          });
        }
      }

      // Verificar metas próximas do prazo
      if (notificationSettings.goalReminders) {
        goals.forEach(goal => {
          if (!goal.isCompleted) {
            const deadline = new Date(goal.deadline);
            const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysRemaining <= 7 && daysRemaining > 0) {
              const existingReminder = notifications.find(n => 
                n.type === 'goal_reminder' && 
                n.message.includes(goal.name) &&
                new Date(n.createdAt).toDateString() === today.toDateString()
              );

              if (!existingReminder) {
                newNotifications.push({
                  id: `goal-reminder-${goal.id}-${Date.now()}`,
                  type: 'goal_reminder',
                  title: 'Meta Próxima do Prazo',
                  message: `A meta "${goal.name}" vence em ${daysRemaining} dias`,
                  createdAt: new Date().toISOString(),
                  isRead: false,
                  priority: daysRemaining <= 3 ? 'high' : 'medium',
                });
              }
            }
          }
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    };

    const interval = setInterval(generateSmartNotifications, 300000); // A cada 5 minutos
    generateSmartNotifications(); // Executar imediatamente

    return () => clearInterval(interval);
  }, [transactions, goals, notificationSettings, monthlyBudget, notifications]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    toast.success('Transação adicionada com sucesso!');
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transação removida!');
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    toast.success('Transação atualizada!');
  };

  const handleUpdateBudgets = (monthly: number, daily: number) => {
    setMonthlyBudget(monthly);
    setDailyBudget(daily);
    toast.success('Orçamentos atualizados!');
  };

  const handleAddGoal = (goal: SavingsGoal) => {
    setGoals(prev => [goal, ...prev]);
    toast.success('Meta criada com sucesso!');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    toast.success('Meta removida!');
  };

  const handleUpdateGoal = (updatedGoal: SavingsGoal) => {
    setGoals(prev => 
      prev.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    );
  };

  const handleUpdateNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    toast.success('Configurações de notificação atualizadas!');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRestoreData = (
    restoredTransactions: Transaction[],
    restoredMonthlyBudget: number,
    restoredDailyBudget: number
  ) => {
    setTransactions(restoredTransactions);
    setMonthlyBudget(restoredMonthlyBudget);
    setDailyBudget(restoredDailyBudget);
    toast.success('Dados restaurados com sucesso! ♻️', {
      description: 'Todas as informações foram recuperadas do backup'
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        
        <StatsCards
          transactions={transactions}
          monthlyBudget={monthlyBudget}
          dailyBudget={dailyBudget}
          onUpdateBudgets={handleUpdateBudgets}
        />

        {/* Análise Inteligente de Gastos */}
        <div className="mb-10">
          <SpendingTrends
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            dailyBudget={dailyBudget}
          />
        </div>

        {/* Resumo do orçamento */}
        <div className="mb-10">
          <BudgetSummary
            transactions={transactions}
            monthlyBudget={monthlyBudget}
            dailyBudget={dailyBudget}
          />
        </div>

        <MainTabs
          transactions={transactions}
          monthlyBudget={monthlyBudget}
          dailyBudget={dailyBudget}
          goals={goals}
          notifications={notifications}
          notificationSettings={notificationSettings}
          onAddTransaction={handleAddTransaction}
          onRemoveTransaction={handleRemoveTransaction}
          onEditTransaction={handleEditTransaction}
          onAddGoal={handleAddGoal}
          onRemoveGoal={handleRemoveGoal}
          onUpdateGoal={handleUpdateGoal}
          onUpdateNotificationSettings={handleUpdateNotificationSettings}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onDeleteNotification={handleDeleteNotification}
          onRestoreData={handleRestoreData}
        />

        <PWAInstallPrompt />
      </div>
    </div>
  );
};

export default Index;
