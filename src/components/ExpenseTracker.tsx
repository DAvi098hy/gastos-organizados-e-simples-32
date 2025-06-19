
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, PlusCircle, Table, BarChart3, Wallet } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import BudgetManager from './BudgetManager';
import BudgetSummary from './BudgetSummary';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

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

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header modernizado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <Wallet className="text-white h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Organizador Financeiro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Categorize e organize suas despesas automaticamente com inteligência artificial
          </p>
        </div>

        {/* Cards de estatísticas modernizados */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Transações</p>
                  <p className="text-3xl font-bold mt-2">{transactions.length}</p>
                  <p className="text-blue-200 text-xs mt-1">registradas</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Table className="h-6 w-6 text-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Valor Total</p>
                  <p className="text-3xl font-bold mt-2">R$ {formatCurrency(totalAmount)}</p>
                  <p className="text-green-200 text-xs mt-1">em gastos</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calculator className="h-6 w-6 text-green-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Categorias Ativas</p>
                  <p className="text-3xl font-bold mt-2">{new Set(transactions.map(t => t.category)).size}</p>
                  <p className="text-purple-200 text-xs mt-1">diferentes</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <PlusCircle className="h-6 w-6 text-purple-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <BudgetManager
            monthlyBudget={monthlyBudget}
            dailyBudget={dailyBudget}
            onUpdateBudgets={updateBudgets}
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

        {/* Tabs modernizadas */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-2 rounded-none border-b border-gray-100">
              <TabsTrigger 
                value="add" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl font-medium"
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar Transação
              </TabsTrigger>
              <TabsTrigger 
                value="view" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl font-medium"
              >
                <Table className="h-4 w-4" />
                Ver Transações
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                Resumo Orçamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="p-0">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Nova Transação</h2>
                  <p className="text-gray-600">Adicione uma nova despesa ao seu controle financeiro</p>
                </div>
                <TransactionForm onAddTransaction={addTransaction} />
              </div>
            </TabsContent>

            <TabsContent value="view" className="p-0">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Suas Transações</h2>
                  <p className="text-gray-600">Visualize e gerencie todas as suas despesas registradas</p>
                </div>
                <TransactionTable 
                  transactions={transactions} 
                  onRemoveTransaction={removeTransaction}
                  onEditTransaction={editTransaction}
                />
              </div>
            </TabsContent>

            <TabsContent value="budget" className="p-0">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumo do Orçamento</h2>
                  <p className="text-gray-600">Acompanhe seu progresso financeiro mensal e diário</p>
                </div>
                <BudgetSummary
                  transactions={transactions}
                  monthlyBudget={monthlyBudget}
                  dailyBudget={dailyBudget}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
