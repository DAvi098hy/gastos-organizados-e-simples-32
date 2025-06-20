
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, Award, Lightbulb } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface InsightsDashboardProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
}) => {
  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Transações do mês atual
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Gastos por categoria
    const categoryData = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / transactions.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
    }));

    // Tendência dos últimos 6 meses
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
      });
      
      last6Months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        gastos: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
        transacoes: monthTransactions.length
      });
    }

    // Insights automáticos
    const totalGastos = transactions.reduce((sum, t) => sum + t.amount, 0);
    const mediaGastosPorTransacao = totalGastos / transactions.length;
    const categoriaComMaisGastos = Object.entries(categoryData).sort(([,a], [,b]) => b - a)[0];
    const diaComMaisGastos = transactions.reduce((acc, t) => {
      const day = new Date(t.date).getDay();
      const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day];
      acc[dayName] = (acc[dayName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const diaComMaisGastosData = Object.entries(diaComMaisGastos).sort(([,a], [,b]) => b - a)[0];

    // Economia sugerida
    const economiaMedia = monthlyBudget * 0.2; // 20% do orçamento como meta de economia

    return {
      categoryChartData,
      last6Months,
      totalGastos,
      mediaGastosPorTransacao,
      categoriaComMaisGastos,
      diaComMaisGastosData,
      economiaMedia,
      currentMonthTotal: currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
    };
  }, [transactions, monthlyBudget, dailyBudget]);

  if (!insights) {
    return (
      <Card className="p-8 text-center">
        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Nenhum insight disponível
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione algumas transações para ver insights detalhados sobre seus gastos
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Dashboard de Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Análises detalhadas e insights automáticos sobre seus hábitos financeiros
        </p>
      </div>

      {/* Cards de Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Média por Transação</p>
                <p className="text-2xl font-bold">R$ {formatCurrency(insights.mediaGastosPorTransacao)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Categoria Top</p>
                <p className="text-lg font-bold">{insights.categoriaComMaisGastos[0]}</p>
                <p className="text-green-200 text-xs">R$ {formatCurrency(insights.categoriaComMaisGastos[1])}</p>
              </div>
              <Award className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Dia com Mais Gastos</p>
                <p className="text-2xl font-bold">{insights.diaComMaisGastosData[0]}</p>
                <p className="text-purple-200 text-xs">R$ {formatCurrency(insights.diaComMaisGastosData[1])}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Meta de Economia</p>
                <p className="text-2xl font-bold">R$ {formatCurrency(insights.economiaMedia)}</p>
                <p className="text-orange-200 text-xs">20% do orçamento</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Categorias */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insights.categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {insights.categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${formatCurrency(value as number)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendência dos Últimos 6 Meses */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência dos Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={insights.last6Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${formatCurrency(value as number)}`} />
                <Line type="monotone" dataKey="gastos" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Progresso do Orçamento */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Orçamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Gastos do Mês</span>
              <span className="font-bold">
                R$ {formatCurrency(insights.currentMonthTotal)} / R$ {formatCurrency(monthlyBudget)}
              </span>
            </div>
            <Progress 
              value={(insights.currentMonthTotal / monthlyBudget) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {((insights.currentMonthTotal / monthlyBudget) * 100).toFixed(1)}% utilizado
              </span>
              <span>
                R$ {formatCurrency(monthlyBudget - insights.currentMonthTotal)} restante
              </span>
            </div>
            {insights.currentMonthTotal > monthlyBudget && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 dark:text-red-200 font-medium">
                  Orçamento ultrapassado em R$ {formatCurrency(insights.currentMonthTotal - monthlyBudget)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsDashboard;
