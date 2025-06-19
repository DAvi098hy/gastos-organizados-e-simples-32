
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface SpendingTrendsProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
}

const SpendingTrends: React.FC<SpendingTrendsProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
}) => {
  const analysis = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Transações dos últimos 30 dias
    const last30Days = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    
    // Transações dos últimos 7 dias
    const last7Days = transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
    
    // Gastos por semana nas últimas 4 semanas
    const weeklySpending = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      
      const weekSpending = transactions
        .filter(t => new Date(t.date) >= weekStart && new Date(t.date) < weekEnd)
        .reduce((sum, t) => sum + t.amount, 0);
      
      weeklySpending.unshift(weekSpending);
    }
    
    // Tendência semanal
    const weeklyTrend = weeklySpending.length >= 2 
      ? ((weeklySpending[3] - weeklySpending[2]) / (weeklySpending[2] || 1)) * 100
      : 0;
    
    // Categoria que mais cresce
    const categoryTrends = {};
    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      const daysAgo = Math.floor((currentDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (!categoryTrends[t.category]) {
        categoryTrends[t.category] = { recent: 0, older: 0 };
      }
      
      if (daysAgo <= 15) {
        categoryTrends[t.category].recent += t.amount;
      } else if (daysAgo <= 30) {
        categoryTrends[t.category].older += t.amount;
      }
    });
    
    // Encontrar categoria com maior crescimento
    let fastestGrowingCategory = { name: '', growth: 0 };
    Object.entries(categoryTrends).forEach(([category, data]: [string, any]) => {
      const growth = data.older > 0 ? ((data.recent - data.older) / data.older) * 100 : 0;
      if (growth > fastestGrowingCategory.growth) {
        fastestGrowingCategory = { name: category, growth };
      }
    });
    
    // Projeção para fim do mês
    const dayOfMonth = currentDate.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentMonthSpending = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const projectedMonthlySpending = (currentMonthSpending / dayOfMonth) * daysInMonth;
    
    // Alertas
    const alerts = [];
    
    if (weeklyTrend > 20) {
      alerts.push({
        type: 'warning',
        message: `Gastos aumentaram ${weeklyTrend.toFixed(1)}% esta semana`,
        icon: TrendingUp
      });
    }
    
    if (projectedMonthlySpending > monthlyBudget * 1.1) {
      alerts.push({
        type: 'danger',
        message: `Projeção mensal excede orçamento em ${((projectedMonthlySpending / monthlyBudget - 1) * 100).toFixed(1)}%`,
        icon: AlertTriangle
      });
    }
    
    if (fastestGrowingCategory.growth > 50) {
      alerts.push({
        type: 'warning',
        message: `Gastos em "${fastestGrowingCategory.name}" cresceram ${fastestGrowingCategory.growth.toFixed(1)}%`,
        icon: TrendingUp
      });
    }
    
    const avgDailySpending = last7Days.reduce((sum, t) => sum + t.amount, 0) / 7;
    if (avgDailySpending > dailyBudget * 1.2) {
      alerts.push({
        type: 'danger',
        message: `Média diária dos últimos 7 dias: R$ ${formatCurrency(avgDailySpending)} (${((avgDailySpending / dailyBudget - 1) * 100).toFixed(1)}% acima do orçamento)`,
        icon: AlertTriangle
      });
    }
    
    return {
      weeklyTrend,
      projectedMonthlySpending,
      fastestGrowingCategory,
      avgDailySpending,
      alerts,
      last30DaysTotal: last30Days.reduce((sum, t) => sum + t.amount, 0),
      last7DaysTotal: last7Days.reduce((sum, t) => sum + t.amount, 0)
    };
  }, [transactions, monthlyBudget, dailyBudget]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
          Análise Inteligente de Gastos
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Insights automáticos sobre seus padrões de consumo e alertas personalizados
        </p>
      </div>

      {/* Alertas */}
      {analysis.alerts.length > 0 && (
        <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-400 bg-amber-50 dark:bg-amber-950/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-800">
                <alert.icon className={`h-5 w-5 ${
                  alert.type === 'danger' 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-amber-500 dark:text-amber-400'
                }`} />
                <span className="text-gray-800 dark:text-gray-200 font-medium">{alert.message}</span>
                <Badge variant={alert.type === 'danger' ? 'destructive' : 'secondary'} className="ml-auto">
                  {alert.type === 'danger' ? 'Crítico' : 'Atenção'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cards de Análise */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Tendência Semanal</p>
                <p className="text-3xl font-bold mt-2">
                  {analysis.weeklyTrend > 0 ? '+' : ''}{analysis.weeklyTrend.toFixed(1)}%
                </p>
                <p className="text-purple-200 text-xs mt-1">vs semana anterior</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                {analysis.weeklyTrend > 0 ? (
                  <TrendingUp className="h-6 w-6 text-purple-100" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-purple-100" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Projeção Mensal</p>
                <p className="text-3xl font-bold mt-2">R$ {formatCurrency(analysis.projectedMonthlySpending)}</p>
                <p className="text-indigo-200 text-xs mt-1">estimativa fim do mês</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Target className="h-6 w-6 text-indigo-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-green-600 dark:from-teal-600 dark:to-green-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Média Diária (7d)</p>
                <p className="text-3xl font-bold mt-2">R$ {formatCurrency(analysis.avgDailySpending)}</p>
                <p className="text-teal-200 text-xs mt-1">últimos 7 dias</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-teal-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Gastos (30d)</p>
                <p className="text-3xl font-bold mt-2">R$ {formatCurrency(analysis.last30DaysTotal)}</p>
                <p className="text-pink-200 text-xs mt-1">último mês</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-pink-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Adicionais */}
      {analysis.fastestGrowingCategory.name && (
        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Categoria em Crescimento</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{analysis.fastestGrowingCategory.name}</strong> teve um crescimento de{' '}
                  <strong className="text-purple-600 dark:text-purple-400">
                    {analysis.fastestGrowingCategory.growth.toFixed(1)}%
                  </strong>{' '}
                  nas últimas duas semanas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingTrends;
