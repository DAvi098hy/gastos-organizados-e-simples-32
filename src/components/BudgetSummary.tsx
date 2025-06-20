
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
    <div className="space-y-10">
      {/* Enhanced cards with glass morphism */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className={`relative bg-gradient-to-br ${getBgGradient(monthlyPercentage)} shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 overflow-hidden group backdrop-blur-sm hover:scale-105`}>
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className={`p-4 rounded-2xl ${monthlyPercentage < 100 ? 'bg-emerald-100/80 backdrop-blur-sm' : 'bg-rose-100/80 backdrop-blur-sm'} transition-all duration-300 group-hover:scale-110`}>
                {monthlyPercentage < 100 ? (
                  <Calendar className="h-6 w-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                )}
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-bold">
                Salário Mensal
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Gasto Total</span>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">R$ {formatCurrency(monthlyExpenses)}</span>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Progress 
                  value={Math.min(monthlyPercentage, 100)} 
                  className="h-5 bg-gray-200/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/30"
                />
                <div 
                  className={`absolute top-0 left-0 h-5 rounded-full ${getProgressGradient(monthlyPercentage)} transition-all duration-700 shadow-lg`}
                  style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>0%</span>
                <span className="font-bold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">{monthlyPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between items-center border-t border-gray-200/50 dark:border-gray-600/50">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Restante</span>
              <span className={`font-bold text-2xl ${getStatusColor(monthlyPercentage)} transition-colors duration-300`}>
                R$ {formatCurrency(monthlyRemaining)}
              </span>
            </div>
            
            <div className="text-center pt-4">
              <span className={`text-sm font-bold px-6 py-3 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105 ${
                monthlyPercentage < 70 
                  ? 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200/80' 
                  : monthlyPercentage < 90 
                    ? 'bg-amber-100/80 text-amber-800 hover:bg-amber-200/80' 
                    : 'bg-rose-100/80 text-rose-800 hover:bg-rose-200/80'
              }`}>
                {monthlyPercentage.toFixed(1)}% do salário utilizado
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`relative bg-gradient-to-br ${getBgGradient(dailyPercentage)} shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 overflow-hidden group backdrop-blur-sm hover:scale-105`}>
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className={`p-4 rounded-2xl ${dailyPercentage < 100 ? 'bg-emerald-100/80 backdrop-blur-sm' : 'bg-rose-100/80 backdrop-blur-sm'} transition-all duration-300 group-hover:scale-110`}>
                {dailyPercentage < 100 ? (
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                )}
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-bold">
                Orçamento Diário
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Gasto Hoje</span>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">R$ {formatCurrency(dailyExpenses)}</span>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Progress 
                  value={Math.min(dailyPercentage, 100)} 
                  className="h-5 bg-gray-200/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/30"
                />
                <div 
                  className={`absolute top-0 left-0 h-5 rounded-full ${getProgressGradient(dailyPercentage)} transition-all duration-700 shadow-lg`}
                  style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>0%</span>
                <span className="font-bold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">{dailyPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between items-center border-t border-gray-200/50 dark:border-gray-600/50">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Restante Hoje</span>
              <span className={`font-bold text-2xl ${getStatusColor(dailyPercentage)} transition-colors duration-300`}>
                R$ {formatCurrency(dailyRemaining)}
              </span>
            </div>
            
            <div className="text-center pt-4">
              <span className={`text-sm font-bold px-6 py-3 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105 ${
                dailyPercentage < 70 
                  ? 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200/80' 
                  : dailyPercentage < 90 
                    ? 'bg-amber-100/80 text-amber-800 hover:bg-amber-200/80' 
                    : 'bg-rose-100/80 text-rose-800 hover:bg-rose-200/80'
              }`}>
                {dailyPercentage.toFixed(1)}% do orçamento diário utilizado
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced category chart section */}
      <div className="backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 rounded-3xl shadow-xl border border-white/30 dark:border-slate-700/30 p-6 transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800/50">
        <CategoryChart transactions={transactions} />
      </div>
    </div>
  );
};

export default BudgetSummary;
