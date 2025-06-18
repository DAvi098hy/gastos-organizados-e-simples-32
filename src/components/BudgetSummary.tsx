
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface BudgetSummaryProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  // Gastos do mês atual
  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Gastos do dia atual
  const dailyExpenses = transactions
    .filter(t => t.date === today)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyPercentage = monthlyBudget > 0 ? (monthlyExpenses / monthlyBudget) * 100 : 0;
  const dailyPercentage = dailyBudget > 0 ? (dailyExpenses / dailyBudget) * 100 : 0;

  const monthlyRemaining = monthlyBudget - monthlyExpenses;
  const dailyRemaining = dailyBudget - dailyExpenses;

  const getStatusColor = (percentage: number) => {
    if (percentage < 70) return 'text-green-600';
    if (percentage < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {monthlyPercentage < 100 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            Orçamento Mensal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Gasto</span>
            <span className="font-semibold">R$ {formatCurrency(monthlyExpenses)}</span>
          </div>
          <Progress 
            value={Math.min(monthlyPercentage, 100)} 
            className="h-3"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Restante</span>
            <span className={`font-semibold ${getStatusColor(monthlyPercentage)}`}>
              R$ {formatCurrency(monthlyRemaining)}
            </span>
          </div>
          <div className="text-center">
            <span className={`text-sm font-medium ${getStatusColor(monthlyPercentage)}`}>
              {monthlyPercentage.toFixed(1)}% do orçamento utilizado
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {dailyPercentage < 100 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            Orçamento Diário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Gasto Hoje</span>
            <span className="font-semibold">R$ {formatCurrency(dailyExpenses)}</span>
          </div>
          <Progress 
            value={Math.min(dailyPercentage, 100)} 
            className="h-3"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Restante Hoje</span>
            <span className={`font-semibold ${getStatusColor(dailyPercentage)}`}>
              R$ {formatCurrency(dailyRemaining)}
            </span>
          </div>
          <div className="text-center">
            <span className={`text-sm font-medium ${getStatusColor(dailyPercentage)}`}>
              {dailyPercentage.toFixed(1)}% do orçamento diário utilizado
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
