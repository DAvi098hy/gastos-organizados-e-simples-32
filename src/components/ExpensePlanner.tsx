
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, Trash2, Target, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { TransactionCategory, CATEGORIES } from '@/types/transaction';
import { formatCurrency, parseCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface PlannedExpense {
  id: string;
  name: string;
  amount: number;
  category: TransactionCategory;
  dueDate: string;
  description?: string;
  isPaid: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ExpensePlannerProps {
  monthlyBudget: number;
  currentMonthExpenses: number;
}

const ExpensePlanner: React.FC<ExpensePlannerProps> = ({
  monthlyBudget,
  currentMonthExpenses,
}) => {
  const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>(() => {
    const saved = localStorage.getItem('plannedExpenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '' as TransactionCategory,
    dueDate: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const totalPlanned = plannedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPaid = plannedExpenses.filter(e => e.isPaid).reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyBudget - currentMonthExpenses - (totalPlanned - totalPaid);

  React.useEffect(() => {
    localStorage.setItem('plannedExpenses', JSON.stringify(plannedExpenses));
  }, [plannedExpenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.category || !formData.dueDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newExpense: PlannedExpense = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseCurrency(formData.amount),
      category: formData.category,
      dueDate: formData.dueDate,
      description: formData.description,
      isPaid: false,
      priority: formData.priority,
    };

    setPlannedExpenses(prev => [...prev, newExpense]);
    setFormData({
      name: '',
      amount: '',
      category: '' as TransactionCategory,
      dueDate: '',
      description: '',
      priority: 'medium',
    });
    setShowForm(false);
    toast.success('Gasto planejado adicionado!');
  };

  const togglePaid = (id: string) => {
    setPlannedExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, isPaid: !expense.isPaid } : expense
      )
    );
  };

  const removeExpense = (id: string) => {
    setPlannedExpenses(prev => prev.filter(expense => expense.id !== id));
    toast.success('Gasto planejado removido!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  const upcomingExpenses = plannedExpenses
    .filter(e => !e.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Planejador de Gastos
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Planeje e acompanhe seus gastos futuros para melhor controle financeiro
        </p>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Orçamento Mensal</p>
                <p className="text-xl font-bold">R$ {formatCurrency(monthlyBudget)}</p>
              </div>
              <Target className="h-6 w-6 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Já Gasto</p>
                <p className="text-xl font-bold">R$ {formatCurrency(currentMonthExpenses)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Planejado</p>
                <p className="text-xl font-bold">R$ {formatCurrency(totalPlanned - totalPaid)}</p>
              </div>
              <Calendar className="h-6 w-6 text-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${remainingBudget >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} text-white`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${remainingBudget >= 0 ? 'text-emerald-100' : 'text-red-100'} text-sm`}>
                  {remainingBudget >= 0 ? 'Disponível' : 'Excesso'}
                </p>
                <p className="text-xl font-bold">R$ {formatCurrency(Math.abs(remainingBudget))}</p>
              </div>
              {remainingBudget >= 0 ? (
                <CheckCircle className="h-6 w-6 text-emerald-100" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-100" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Gastos */}
      {upcomingExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Próximos Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExpenses.map((expense) => {
                const daysUntilDue = Math.ceil(
                  (new Date(expense.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(expense.priority)}`} />
                      <div>
                        <p className="font-medium">{expense.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(expense.dueDate).toLocaleDateString('pt-BR')} • {expense.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">R$ {formatCurrency(expense.amount)}</p>
                      <p className={`text-xs ${daysUntilDue <= 3 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {daysUntilDue <= 0 ? 'Vencido' : `${daysUntilDue} dias`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gastos Planejados</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Gasto
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Gasto Planejado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Gasto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Conta de luz"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Valor (R$) *</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="150,00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: TransactionCategory) => 
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Data de Vencimento *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Observações sobre este gasto..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Adicionar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Gastos Planejados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plannedExpenses.map((expense) => (
          <Card key={expense.id} className={`${expense.isPaid ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(expense.priority)}`} />
                  <h4 className="font-semibold">{expense.name}</h4>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeExpense(expense.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-bold text-green-600">
                  R$ {formatCurrency(expense.amount)}
                </p>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{expense.category}</span>
                  <Badge variant="outline" className="text-xs">
                    {getPriorityLabel(expense.priority)}
                  </Badge>
                </div>

                <p className="text-sm">
                  <strong>Vencimento:</strong> {new Date(expense.dueDate).toLocaleDateString('pt-BR')}
                </p>

                {expense.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {expense.description}
                  </p>
                )}

                <Button
                  size="sm"
                  variant={expense.isPaid ? "secondary" : "default"}
                  onClick={() => togglePaid(expense.id)}
                  className="w-full mt-3"
                >
                  {expense.isPaid ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Pago
                    </>
                  ) : (
                    'Marcar como Pago'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plannedExpenses.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Nenhum gasto planejado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comece a planejar seus gastos futuros para melhor controle financeiro
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Gasto
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ExpensePlanner;
