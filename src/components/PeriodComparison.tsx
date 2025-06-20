
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface PeriodComparisonProps {
  transactions: Transaction[];
}

interface PeriodData {
  period: string;
  amount: number;
  transactions: number;
  categories: { [key: string]: number };
}

const PeriodComparison: React.FC<PeriodComparisonProps> = ({ transactions }) => {
  const [comparisonType, setComparisonType] = useState<'month' | 'quarter' | 'year'>('month');

  const generatePeriodData = (type: 'month' | 'quarter' | 'year'): PeriodData[] => {
    const periodMap = new Map<string, Transaction[]>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let periodKey: string;

      switch (type) {
        case 'month':
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periodKey = `${date.getFullYear()}-Q${quarter}`;
          break;
        case 'year':
          periodKey = date.getFullYear().toString();
          break;
      }

      if (!periodMap.has(periodKey)) {
        periodMap.set(periodKey, []);
      }
      periodMap.get(periodKey)!.push(transaction);
    });

    return Array.from(periodMap.entries())
      .map(([period, periodTransactions]) => {
        const amount = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
        const categories = periodTransactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as { [key: string]: number });

        return {
          period,
          amount,
          transactions: periodTransactions.length,
          categories,
        };
      })
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-6); // Últimos 6 períodos
  };

  const periodData = generatePeriodData(comparisonType);

  const calculateTrend = (data: PeriodData[]) => {
    if (data.length < 2) return { trend: 'stable', percentage: 0 };

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (previous.amount === 0) return { trend: 'stable', percentage: 0 };

    const percentage = ((latest.amount - previous.amount) / previous.amount) * 100;
    
    if (percentage > 5) return { trend: 'up', percentage };
    if (percentage < -5) return { trend: 'down', percentage };
    return { trend: 'stable', percentage };
  };

  const trend = calculateTrend(periodData);

  const formatPeriodLabel = (period: string) => {
    if (comparisonType === 'month') {
      const [year, month] = period.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: 'numeric' 
      });
    }
    return period;
  };

  const getTopCategories = () => {
    const categoryTotals = new Map<string, number>();
    
    periodData.forEach(period => {
      Object.entries(period.categories).forEach(([category, amount]) => {
        categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
      });
    });

    return Array.from(categoryTotals.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const topCategories = getTopCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Comparação de Períodos</h2>
        <Select
          value={comparisonType}
          onValueChange={(value: 'month' | 'quarter' | 'year') => setComparisonType(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Por Mês</SelectItem>
            <SelectItem value="quarter">Por Trimestre</SelectItem>
            <SelectItem value="year">Por Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tendência Geral */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Tendência Geral</CardTitle>
            {trend.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : trend.trend === 'down' ? (
              <TrendingDown className="h-4 w-4 text-green-600" />
            ) : (
              <Calendar className="h-4 w-4 text-blue-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trend.trend === 'up' && '↗ '}
              {trend.trend === 'down' && '↘ '}
              {Math.abs(trend.percentage).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {trend.trend === 'up' ? 'Aumento' : trend.trend === 'down' ? 'Redução' : 'Estável'} vs período anterior
            </p>
          </CardContent>
        </Card>

        {/* Média do Período */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Média do Período</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {formatCurrency(periodData.reduce((sum, p) => sum + p.amount, 0) / periodData.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em {periodData.length} períodos
            </p>
          </CardContent>
        </Card>

        {/* Maior Gasto */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Maior Gasto</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {formatCurrency(Math.max(...periodData.map(p => p.amount)))}
            </div>
            <p className="text-xs text-muted-foreground">
              Pico de gastos no período
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={periodData}>
                  <XAxis 
                    dataKey="period" 
                    tickFormatter={formatPeriodLabel}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${formatCurrency(value)}`}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-semibold">{formatPeriodLabel(label)}</p>
                            <p className="text-blue-600">
                              Total: R$ {formatCurrency(payload[0].value as number)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {payload[0].payload.transactions} transações
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Linha */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={periodData}>
                  <XAxis 
                    dataKey="period" 
                    tickFormatter={formatPeriodLabel}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${formatCurrency(value)}`}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-semibold">{formatPeriodLabel(label)}</p>
                            <p className="text-purple-600">
                              Total: R$ {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias com Maiores Gastos (Período Total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map(([category, amount], index) => {
              const percentage = (amount / topCategories.reduce((sum, [,amt]) => sum + amt, 0)) * 100;
              return (
                <div key={category} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm text-gray-600">
                        R$ {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodComparison;
