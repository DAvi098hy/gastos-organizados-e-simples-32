
import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatsCards from './StatsCards';
import MainTabs from './MainTabs';
import BudgetSummary from './BudgetSummary';
import { Transaction } from '@/types/transaction';

const ExpenseTracker = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        <StatsCards
          transactions={transactions}
          monthlyBudget={monthlyBudget}
          dailyBudget={dailyBudget}
          onUpdateBudgets={updateBudgets}
        />

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
          onAddTransaction={addTransaction}
          onRemoveTransaction={removeTransaction}
          onEditTransaction={editTransaction}
        />
      </div>
    </div>
  );
};

export default ExpenseTracker;
