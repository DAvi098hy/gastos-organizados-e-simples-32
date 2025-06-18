
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiggyBank, Edit, Check, X } from 'lucide-react';
import { formatCurrency, parseCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface BudgetManagerProps {
  monthlyBudget: number;
  dailyBudget: number;
  onUpdateBudgets: (monthly: number, daily: number) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  monthlyBudget,
  dailyBudget,
  onUpdateBudgets,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [monthlyInput, setMonthlyInput] = useState(formatCurrency(monthlyBudget));
  const [dailyInput, setDailyInput] = useState(formatCurrency(dailyBudget));

  const handleEdit = () => {
    setIsEditing(true);
    setMonthlyInput(formatCurrency(monthlyBudget));
    setDailyInput(formatCurrency(dailyBudget));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMonthlyInput(formatCurrency(monthlyBudget));
    setDailyInput(formatCurrency(dailyBudget));
  };

  const handleSave = () => {
    const newMonthlyBudget = parseCurrency(monthlyInput);
    const newDailyBudget = parseCurrency(dailyInput);

    if (newMonthlyBudget <= 0 || newDailyBudget <= 0) {
      toast.error('Os valores de orçamento devem ser maiores que zero');
      return;
    }

    onUpdateBudgets(newMonthlyBudget, newDailyBudget);
    setIsEditing(false);
    toast.success('Orçamento atualizado com sucesso!');
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          Orçamento
        </CardTitle>
        {!isEditing ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-orange-100 text-sm">Orçamento Mensal</Label>
          {isEditing ? (
            <Input
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="0,00"
            />
          ) : (
            <p className="text-2xl font-bold">R$ {formatCurrency(monthlyBudget)}</p>
          )}
        </div>
        <div>
          <Label className="text-orange-100 text-sm">Orçamento Diário</Label>
          {isEditing ? (
            <Input
              value={dailyInput}
              onChange={(e) => setDailyInput(e.target.value)}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="0,00"
            />
          ) : (
            <p className="text-2xl font-bold">R$ {formatCurrency(dailyBudget)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetManager;
