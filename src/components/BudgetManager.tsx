
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Edit, Check, X, Plus } from 'lucide-react';
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
  const [extraFunds, setExtraFunds] = useState('');
  const [showExtraFunds, setShowExtraFunds] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setMonthlyInput(formatCurrency(monthlyBudget));
    setDailyInput(formatCurrency(dailyBudget));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMonthlyInput(formatCurrency(monthlyBudget));
    setDailyInput(formatCurrency(dailyBudget));
    setShowExtraFunds(false);
    setExtraFunds('');
  };

  const handleSave = () => {
    const newMonthlyBudget = parseCurrency(monthlyInput);
    const newDailyBudget = parseCurrency(dailyInput);

    if (newMonthlyBudget <= 0 || newDailyBudget <= 0) {
      toast.error('Os valores de salário devem ser maiores que zero');
      return;
    }

    onUpdateBudgets(newMonthlyBudget, newDailyBudget);
    setIsEditing(false);
    setShowExtraFunds(false);
    setExtraFunds('');
    toast.success('Salário atualizado com sucesso!');
  };

  const handleAddExtraFunds = () => {
    const extraAmount = parseCurrency(extraFunds);
    if (extraAmount <= 0) {
      toast.error('O valor extra deve ser maior que zero');
      return;
    }

    const newMonthlyBudget = monthlyBudget + extraAmount;
    const newDailyBudget = dailyBudget + (extraAmount / 30); // Distribui pelos 30 dias

    onUpdateBudgets(newMonthlyBudget, newDailyBudget);
    setExtraFunds('');
    setShowExtraFunds(false);
    toast.success(`R$ ${formatCurrency(extraAmount)} adicionados ao seu salário!`);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wallet className="h-5 w-5" />
          </div>
          Salário do Mês
        </CardTitle>
        <div className="flex gap-1">
          {!isEditing && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowExtraFunds(!showExtraFunds)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title="Adicionar fundos extras"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title="Editar salário"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title="Salvar alterações"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title="Cancelar"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showExtraFunds && !isEditing && (
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <Label className="text-orange-100 text-sm font-medium">Adicionar Fundos Extras</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={extraFunds}
                onChange={(e) => setExtraFunds(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="0,00"
              />
              <Button
                onClick={handleAddExtraFunds}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label className="text-orange-100 text-sm font-medium">Salário Mensal</Label>
          {isEditing ? (
            <Input
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
              className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="0,00"
            />
          ) : (
            <div className="mt-1">
              <p className="text-3xl font-bold">R$ {formatCurrency(monthlyBudget)}</p>
              <p className="text-orange-200 text-xs">disponível este mês</p>
            </div>
          )}
        </div>

        <div>
          <Label className="text-orange-100 text-sm font-medium">Orçamento Diário</Label>
          {isEditing ? (
            <Input
              value={dailyInput}
              onChange={(e) => setDailyInput(e.target.value)}
              className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="0,00"
            />
          ) : (
            <div className="mt-1">
              <p className="text-3xl font-bold">R$ {formatCurrency(dailyBudget)}</p>
              <p className="text-orange-200 text-xs">limite por dia</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetManager;
