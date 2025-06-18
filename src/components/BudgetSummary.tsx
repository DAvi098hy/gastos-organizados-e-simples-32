
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';
import CategoryChart from './CategoryChart';

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
    if (percentage < 70) return 'text-emerald-600';
    if (percentage < 90) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-emerald-500';
    if (percentage < 90) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getBgGradient = (percentage: number) => {
    if (percentage < 70) return 'from-emerald-50 to-green-50 border-emerald-100';
    if (percentage < 90) return 'from-amber-50 to-yellow-50 border-amber-100';
    return 'from-rose-50 to-red-50 border-rose-100';
  };

  return (
    <div className="space-y-8">
      {/* Cards de Orçamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`bg-gradient-to-br ${getBgGradient(monthlyPercentage)} shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {monthlyPercentage < 100 ? (
                <Calendar className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              )}
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Orçamento Mensal
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Gasto Total</span>
              <span className="font-bold text-xl text-gray-900">R$ {formatCurrency(monthlyExpenses)}</span>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={Math.min(monthlyPercentage, 100)} 
                className="h-3 bg-gray-200"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium">{monthlyPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Restante</span>
              <span className={`font-bold text-xl ${getStatusColor(monthlyPercentage)}`}>
                R$ {formatCurrency(monthlyRemaining)}
              </span>
            </div>
            
            <div className="text-center pt-2">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                monthlyPercentage < 70 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : monthlyPercentage < 90 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-rose-100 text-rose-700'
              }`}>
                {monthlyPercentage.toFixed(1)}% utilizado
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${getBgGradient(dailyPercentage)} shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {dailyPercentage < 100 ? (
                <DollarSign className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              )}
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Orçamento Diário
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Gasto Hoje</span>
              <span className="font-bold text-xl text-gray-900">R$ {formatCurrency(dailyExpenses)}</span>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={Math.min(dailyPercentage, 100)} 
                className="h-3 bg-gray-200"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium">{dailyPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Restante Hoje</span>
              <span className={`font-bold text-xl ${getStatusColor(dailyPercentage)}`}>
                R$ {formatCurrency(dailyRemaining)}
              </span>
            </div>
            
            <div className="text-center pt-2">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                dailyPercentage < 70 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : dailyPercentage < 90 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-rose-100 text-rose-700'
              }`}>
                {dailyPercentage.toFixed(1)}% utilizado
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Categoria */}
      <div className="mt-8">
        <CategoryChart transactions={transactions} />
      </div>
    </div>
  );
};

export default BudgetSummary;
