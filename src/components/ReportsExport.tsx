
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, FileText, FileSpreadsheet, Download, Calendar, BarChart3 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { ExportOptions, ReportData } from '@/types/reports';
import { formatCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface ReportsExportProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
}

const ReportsExport: React.FC<ReportsExportProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    period: 'month',
    includeCharts: true,
  });

  const generateReportData = (period: string): ReportData => {
    const now = new Date();
    let filteredTransactions = transactions;

    if (period === 'month') {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      });
    } else if (period === 'year') {
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === now.getFullYear();
      });
    }

    const totalExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown = filteredTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });

    const averageDaily = totalExpenses / 30;

    const topExpenses = filteredTransactions
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Calcular tendências (mês atual vs anterior)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === lastMonth.getMonth() && 
             transactionDate.getFullYear() === lastMonth.getFullYear();
    });

    const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentChange = lastMonthTotal > 0 ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    return {
      period,
      totalExpenses,
      categoryBreakdown,
      averageDaily,
      topExpenses,
      trends: {
        thisMonth: totalExpenses,
        lastMonth: lastMonthTotal,
        percentChange,
      },
    };
  };

  const exportToCSV = (data: ReportData) => {
    const csvContent = [
      ['Data', 'Descrição', 'Valor', 'Categoria'],
      ...transactions.map(t => [t.date, t.description, t.amount.toString(), t.category])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-gastos-${exportOptions.period}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (data: ReportData) => {
    const exportData = {
      reportData: data,
      transactions: transactions,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-gastos-${exportOptions.period}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: ReportData) => {
    // Simulação de exportação PDF (seria necessário uma lib como jsPDF na implementação real)
    toast.info('Funcionalidade PDF em desenvolvimento. Usando JSON como alternativa.');
    exportToJSON(data);
  };

  const handleExport = () => {
    const data = generateReportData(exportOptions.period);
    
    switch (exportOptions.format) {
      case 'csv':
        exportToCSV(data);
        break;
      case 'json':
        exportToJSON(data);
        break;
      case 'pdf':
        exportToPDF(data);
        break;
    }

    toast.success('Relatório exportado com sucesso!');
  };

  const reportData = generateReportData('month');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo do Relatório */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Resumo Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total de Gastos</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {formatCurrency(reportData.totalExpenses)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Média Diária</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {formatCurrency(reportData.averageDaily)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Tendência vs Mês Anterior</p>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${
                  reportData.trends.percentChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {reportData.trends.percentChange > 0 ? '↗' : '↘'} 
                  {Math.abs(reportData.trends.percentChange).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-600">
                  {reportData.trends.percentChange > 0 ? 'aumento' : 'redução'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Top Categorias</p>
              <div className="space-y-2">
                {Object.entries(reportData.categoryBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="font-semibold">R$ {formatCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opções de Exportação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5 text-purple-600" />
              Exportar Relatório
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Formato</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'pdf' | 'csv' | 'json') => 
                  setExportOptions({ ...exportOptions, format: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      JSON
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Período</Label>
              <Select
                value={exportOptions.period}
                onValueChange={(value: 'all' | 'month' | 'year' | 'custom') => 
                  setExportOptions({ ...exportOptions, period: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                  <SelectItem value="all">Todos os Dados</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportOptions.period === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data Inicial</Label>
                  <Input
                    type="date"
                    value={exportOptions.startDate || ''}
                    onChange={(e) => 
                      setExportOptions({ ...exportOptions, startDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Data Final</Label>
                  <Input
                    type="date"
                    value={exportOptions.endDate || ''}
                    onChange={(e) => 
                      setExportOptions({ ...exportOptions, endDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={exportOptions.includeCharts}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, includeCharts: checked as boolean })
                }
              />
              <Label htmlFor="includeCharts" className="text-sm">
                Incluir gráficos no relatório
              </Label>
            </div>

            <Button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Maiores Gastos do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.topExpenses.slice(0, 5).map((transaction, index) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-600">
                  R$ {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsExport;
