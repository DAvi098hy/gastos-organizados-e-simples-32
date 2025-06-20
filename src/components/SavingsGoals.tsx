
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Target, Plus, Trash2, CheckCircle, Calendar } from 'lucide-react';
import { SavingsGoal, GoalProgress } from '@/types/goals';
import { formatCurrency, parseCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onRemoveGoal: (id: string) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
}

const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  onAddGoal,
  onRemoveGoal,
  onUpdateGoal,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
  });

  const calculateProgress = (goal: SavingsGoal): GoalProgress => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const monthsRemaining = daysRemaining / 30;
    const monthlyRequiredSaving = monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;

    return {
      goalId: goal.id,
      percentage: Math.min(percentage, 100),
      remainingAmount,
      daysRemaining,
      monthlyRequiredSaving,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseCurrency(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      description: formData.description,
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    onAddGoal(newGoal);
    setFormData({ name: '', targetAmount: '', deadline: '', description: '' });
    setShowForm(false);
    toast.success('Meta criada com sucesso!');
  };

  const handleAddAmount = (goalId: string, amount: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const addAmount = parseCurrency(amount);
    if (addAmount <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + addAmount,
      isCompleted: goal.currentAmount + addAmount >= goal.targetAmount,
    };

    onUpdateGoal(updatedGoal);
    
    if (updatedGoal.isCompleted) {
      toast.success('🎉 Parabéns! Meta alcançada!');
    } else {
      toast.success('Valor adicionado à meta!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Metas de Economia</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">Nova Meta de Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goalName">Nome da Meta *</Label>
                  <Input
                    id="goalName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Viagem para Europa"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Valor Alvo (R$) *</Label>
                  <Input
                    id="targetAmount"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="Ex: 5000,00"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="deadline">Data Limite *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua meta..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Criar Meta
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          return (
            <Card key={goal.id} className={`${goal.isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  {goal.isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Target className="h-5 w-5 text-blue-600" />
                  )}
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemoveGoal(goal.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>R$ {formatCurrency(goal.currentAmount)}</span>
                    <span>R$ {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <Progress value={progress.percentage} className="h-3" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {progress.percentage.toFixed(1)}% concluído
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Faltam</p>
                    <p className="font-semibold">R$ {formatCurrency(progress.remainingAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Dias restantes</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {progress.daysRemaining}
                    </p>
                  </div>
                </div>

                {!goal.isCompleted && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Economia mensal necessária: R$ {formatCurrency(progress.monthlyRequiredSaving)}
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar valor"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            handleAddAmount(goal.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                {goal.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">{goal.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Nenhuma meta criada ainda
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Crie sua primeira meta de economia para começar a poupar com objetivo!
          </p>
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Meta
          </Button>
        </Card>
      )}
    </div>
  );
};

export default SavingsGoals;
