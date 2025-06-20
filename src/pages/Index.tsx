
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import MainTabs from '@/components/MainTabs';
import BudgetSummary from '@/components/BudgetSummary';
import SpendingTrends from '@/components/SpendingTrends';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { Transaction } from '@/types/transaction';
import { usePWA } from '@/hooks/usePWA';

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

  const { registerServiceWorker, isInstalled } = usePWA();

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

  // Show install success toast
  useEffect(() => {
    if (isInstalled) {
      toast.success('App instalado com sucesso! 🎉', {
        description: 'Agora você pode acessar o app diretamente da sua tela inicial.',
      });
    }
  }, [isInstalled]);

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
          onAddTransaction={handleAddTransaction}
          onRemoveTransaction={handleRemoveTransaction}
          onEditTransaction={handleEditTransaction}
        />

        <PWAInstallPrompt />
      </div>
    </div>
  );
};

export default Index;
