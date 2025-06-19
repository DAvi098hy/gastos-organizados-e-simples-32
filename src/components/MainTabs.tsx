
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Table, BarChart3 } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import BudgetSummary from './BudgetSummary';
import { Transaction } from '@/types/transaction';

interface MainTabsProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
  onAddTransaction: (transaction: Transaction) => void;
  onRemoveTransaction: (id: string) => void;
  onEditTransaction: (updatedTransaction: Transaction) => void;
}

const MainTabs: React.FC<MainTabsProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
  onAddTransaction,
  onRemoveTransaction,
  onEditTransaction,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 dark:bg-slate-700 p-2 rounded-none border-b border-gray-100 dark:border-slate-600">
          <TabsTrigger 
            value="add" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar Transação
          </TabsTrigger>
          <TabsTrigger 
            value="view" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors"
          >
            <Table className="h-4 w-4" />
            Ver Transações
          </TabsTrigger>
          <TabsTrigger 
            value="budget" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Resumo Orçamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Nova Transação</h2>
              <p className="text-gray-600 dark:text-gray-300">Adicione uma nova despesa ao seu controle financeiro</p>
            </div>
            <TransactionForm onAddTransaction={onAddTransaction} />
          </div>
        </TabsContent>

        <TabsContent value="view" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Suas Transações</h2>
              <p className="text-gray-600 dark:text-gray-300">Visualize e gerencie todas as suas despesas registradas</p>
            </div>
            <TransactionTable 
              transactions={transactions} 
              onRemoveTransaction={onRemoveTransaction}
              onEditTransaction={onEditTransaction}
            />
          </div>
        </TabsContent>

        <TabsContent value="budget" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Resumo do Orçamento</h2>
              <p className="text-gray-600 dark:text-gray-300">Acompanhe seu progresso financeiro mensal e diário</p>
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
  );
};

export default MainTabs;
