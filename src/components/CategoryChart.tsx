
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Transaction, CATEGORY_COLORS } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface CategoryChartProps {
  transactions: Transaction[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  // Agrupa as transações por categoria
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Converte para array para os gráficos
  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
    fill: getCategoryColor(category),
  }));

  // Configuração do chart
  const chartConfig = {
    amount: {
      label: "Valor",
    },
  };

  function getCategoryColor(category: string) {
    const colors = {
      "Uber": "#10b981",
      "Facebook": "#3b82f6",
      "Gasto Mensal": "#ef4444",
      "Gasto Benéfico e Pessoal": "#8b5cf6",
      "Gasto Variável": "#f97316"
    };
    return colors[category as keyof typeof colors] || "#6b7280";
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-900">{data.payload.category}</p>
          <p className="text-gray-600">
            R$ {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            Gastos por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-gray-500">Nenhuma transação encontrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pizza */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-purple-600" />
            Distribuição por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-gray-700">{item.category}</span>
                </div>
                <span className="font-medium text-gray-900">
                  R$ {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Valores por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${formatCurrency(value)}`}
                />
                <ChartTooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  fill="url(#colorGradient)"
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
    </div>
  );
};

export default CategoryChart;
