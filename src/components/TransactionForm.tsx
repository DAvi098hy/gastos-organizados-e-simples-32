
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PlusCircle, Sparkles } from 'lucide-react';
import { Transaction, CATEGORIES, TransactionCategory } from '@/types/transaction';
import { categorizeTransaction, parseCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [autoCategorizationEnabled, setAutoCategorizationEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !description || !amount) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const parsedAmount = parseCurrency(amount);
    if (parsedAmount <= 0) {
      toast.error('O valor deve ser maior que zero');
      return;
    }

    const finalCategory = category || (autoCategorizationEnabled ? categorizeTransaction(description) : 'Gasto Variável');

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date,
      description,
      amount: parsedAmount,
      category: finalCategory as TransactionCategory
    };

    onAddTransaction(newTransaction);
    toast.success('Transação adicionada com sucesso!');
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const handleAutoCategorizationToggle = () => {
    setAutoCategorizationEnabled(!autoCategorizationEnabled);
    if (!autoCategorizationEnabled) {
      setCategory('');
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as TransactionCategory);
  };

  const predictedCategory = description ? categorizeTransaction(description) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$) *</Label>
          <Input
            id="amount"
            type="text"
            placeholder="Ex: 25,50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Input
          id="description"
          type="text"
          placeholder="Ex: Viagem de Uber para o trabalho"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={autoCategorizationEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleAutoCategorizationToggle}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Categorização Automática
          </Button>
        </div>

        {autoCategorizationEnabled && predictedCategory && (
          <Card className="p-3 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Categoria sugerida:</strong> {predictedCategory}
            </p>
          </Card>
        )}

        {!autoCategorizationEnabled && (
          <div className="space-y-2">
            <Label htmlFor="category">Categoria Manual</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Adicionar Transação
      </Button>
    </form>
  );
};

export default TransactionForm;
