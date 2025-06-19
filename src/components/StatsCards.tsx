
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, PlusCircle, Table } from 'lucide-react';
import BudgetManager from './BudgetManager';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface StatsCardsProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
  onUpdateBudgets: (monthly: number, daily: number) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
  onUpdateBudgets,
}) => {
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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

      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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

      <Card className="bg-gradient-to-br from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
        onUpdateBudgets={onUpdateBudgets}
      />
    </div>
  );
};

export default StatsCards;
