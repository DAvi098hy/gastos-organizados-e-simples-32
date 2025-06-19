
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

  const getBgGradient = (percentage: number) => {
    if (percentage < 70) return 'from-emerald-50 to-green-50 border-emerald-200';
    if (percentage < 90) return 'from-amber-50 to-yellow-50 border-amber-200';
    return 'from-rose-50 to-red-50 border-rose-200';
  };

  const getProgressGradient = (percentage: number) => {
    if (percentage < 70) return 'bg-gradient-to-r from-emerald-400 to-green-500';
    if (percentage < 90) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    return 'bg-gradient-to-r from-rose-400 to-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Cards de Salário Modernizados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={`bg-gradient-to-br ${getBgGradient(monthlyPercentage)} shadow-xl hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className={`p-3 rounded-xl ${monthlyPercentage < 100 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {monthlyPercentage < 100 ? (
                  <Calendar className="h-6 w-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                )}
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                Salário Mensal
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Gasto Total</span>
              <span className="font-bold text-2xl text-gray-900">R$ {formatCurrency(monthlyExpenses)}</span>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Progress 
                  value={Math.min(monthlyPercentage, 100)} 
                  className="h-4 bg-gray-200 rounded-full overflow-hidden"
                />
                <div 
                  className={`absolute top-0 left-0 h-4 rounded-full ${getProgressGradient(monthlyPercentage)} transition-all duration-500`}
                  style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>0%</span>
                <span className="font-bold">{monthlyPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-3 flex justify-between items-center border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Restante</span>
              <span className={`font-bold text-2xl ${getStatusColor(monthlyPercentage)}`}>
                R$ {formatCurrency(monthlyRemaining)}
              </span>
            </div>
            
            <div className="text-center pt-3">
              <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                monthlyPercentage < 70 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : monthlyPercentage < 90 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-rose-100 text-rose-800'
              }`}>
                {monthlyPercentage.toFixed(1)}% do salário utilizado
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${getBgGradient(dailyPercentage)} shadow-xl hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className={`p-3 rounded-xl ${dailyPercentage < 100 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {dailyPercentage < 100 ? (
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                )}
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                Orçamento Diário
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Gasto Hoje</span>
              <span className="font-bold text-2xl text-gray-900">R$ {formatCurrency(dailyExpenses)}</span>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Progress 
                  value={Math.min(dailyPercentage, 100)} 
                  className="h-4 bg-gray-200 rounded-full overflow-hidden"
                />
                <div 
                  className={`absolute top-0 left-0 h-4 rounded-full ${getProgressGradient(dailyPercentage)} transition-all duration-500`}
                  style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>0%</span>
                <span className="font-bold">{dailyPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-3 flex justify-between items-center border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-600">Restante Hoje</span>
              <span className={`font-bold text-2xl ${getStatusColor(dailyPercentage)}`}>
                R$ {formatCurrency(dailyRemaining)}
              </span>
            </div>
            
            <div className="text-center pt-3">
              <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                dailyPercentage < 70 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : dailyPercentage < 90 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-rose-100 text-rose-800'
              }`}>
                {dailyPercentage.toFixed(1)}% do orçamento diário utilizado
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Categoria */}
      <div className="mt-10">
        <CategoryChart transactions={transactions} />
      </div>
    </div>
  );
};

export default BudgetSummary;
