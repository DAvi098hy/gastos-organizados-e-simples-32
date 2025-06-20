
import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatsCards from './StatsCards';
import MainTabs from './MainTabs';
import BudgetSummary from './BudgetSummary';
import SpendingTrends from './SpendingTrends';
import { Transaction } from '@/types/transaction';
import { SavingsGoal } from '@/types/goals';
import { Notification, NotificationSettings } from '@/types/notifications';

const ExpenseTracker = () => {
  // Estado para o tema dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('darkMode');
      return savedTheme ? JSON.parse(savedTheme) : false;
    } catch (error) {
      console.error("Failed to parse theme from localStorage", error);
      return false;
    }
  });

  // Inicializa o estado das transações com dados do localStorage, se existirem
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const storedTransactions = localStorage.getItem('transactions');
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    } catch (error) {
      console.error("Failed to parse transactions from localStorage", error);
      return [];
    }
  });

  // Inicializa o estado do orçamento mensal com dados do localStorage
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const storedMonthlyBudget = localStorage.getItem('monthlyBudget');
      return storedMonthlyBudget ? JSON.parse(storedMonthlyBudget) : 2000;
    } catch (error) {
      console.error("Failed to parse monthlyBudget from localStorage", error);
      return 2000;
    }
  });

  // Inicializa o estado do orçamento diário com dados do localStorage
  const [dailyBudget, setDailyBudget] = useState<number>(() => {
    try {
      const storedDailyBudget = localStorage.getItem('dailyBudget');
      return storedDailyBudget ? JSON.parse(storedDailyBudget) : 100;
    } catch (error) {
      console.error("Failed to parse dailyBudget from localStorage", error);
      return 100;
    }
  });

  // Estado para metas de economia
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    try {
      const storedGoals = localStorage.getItem('savingsGoals');
      return storedGoals ? JSON.parse(storedGoals) : [];
    } catch (error) {
      console.error("Failed to parse goals from localStorage", error);
      return [];
    }
  });

  // Estado para notificações
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error("Failed to parse notifications from localStorage", error);
      return [];
    }
  });

  // Estado para configurações de notificações
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('notificationSettings');
      return storedSettings ? JSON.parse(storedSettings) : {
        budgetAlerts: true,
        goalReminders: true,
        weeklyReports: true,
        monthlyReports: true,
        expenseThreshold: 200,
      };
    } catch (error) {
      console.error("Failed to parse notification settings from localStorage", error);
      return {
        budgetAlerts: true,
        goalReminders: true,
        weeklyReports: true,
        monthlyReports: true,
        expenseThreshold: 200,
      };
    }
  });

  // useEffect para aplicar o tema dark
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [isDarkMode]);

  // useEffect para salvar transações no localStorage sempre que 'transactions' mudar
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage", error);
    }
  }, [transactions]);

  // useEffect para salvar orçamento mensal no localStorage sempre que 'monthlyBudget' mudar
  useEffect(() => {
    try {
      localStorage.setItem('monthlyBudget', JSON.stringify(monthlyBudget));
    } catch (error) {
      console.error("Failed to save monthlyBudget to localStorage", error);
    }
  }, [monthlyBudget]);

  // useEffect para salvar orçamento diário no localStorage sempre que 'dailyBudget' mudar
  useEffect(() => {
    try {
      localStorage.setItem('dailyBudget', JSON.stringify(dailyBudget));
    } catch (error) {
      console.error("Failed to save dailyBudget to localStorage", error);
    }
  }, [dailyBudget]);

  // useEffect para salvar metas no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savingsGoals', JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals to localStorage", error);
    }
  }, [goals]);

  // useEffect para salvar notificações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error("Failed to save notifications to localStorage", error);
    }
  }, [notifications]);

  // useEffect para salvar configurações de notificações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    } catch (error) {
      console.error("Failed to save notification settings to localStorage", error);
    }
  }, [notificationSettings]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  const updateBudgets = (monthly: number, daily: number) => {
    setMonthlyBudget(monthly);
    setDailyBudget(daily);
  };

  const addGoal = (goal: SavingsGoal) => {
    setGoals(prev => [...prev, goal]);
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoal = (updatedGoal: SavingsGoal) => {
    setGoals(prev => 
      prev.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    );
  };

  const updateNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const restoreData = (
    restoredTransactions: Transaction[],
    restoredMonthlyBudget: number,
    restoredDailyBudget: number
  ) => {
    setTransactions(restoredTransactions);
    setMonthlyBudget(restoredMonthlyBudget);
    setDailyBudget(restoredDailyBudget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

        <StatsCards
          transactions={transactions}
          monthlyBudget={monthlyBudget}
          dailyBudget={dailyBudget}
          onUpdateBudgets={updateBudgets}
        />

        {/* Nova funcionalidade: Análise de Tendências */}
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
          onAddTransaction={addTransaction}
          onRemoveTransaction={removeTransaction}
          onEditTransaction={editTransaction}
          onAddGoal={addGoal}
          onRemoveGoal={removeGoal}
          onUpdateGoal={updateGoal}
          onUpdateNotificationSettings={updateNotificationSettings}
          onMarkNotificationAsRead={markNotificationAsRead}
          onDeleteNotification={deleteNotification}
          onRestoreData={restoreData}
        />
      </div>
    </div>
  );
};

export default ExpenseTracker;
