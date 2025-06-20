
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PlusCircle, Sparkles } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { categorizeTransaction, parseCurrency } from '@/utils/categorizationUtils';
import { useCategoryManager } from '@/hooks/useCategoryManager';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const { categories, getCategoryNames } = useCategoryManager();
  
  // Corrigir o bug da data - usar a data local sem ajuste de timezone
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getLocalDateString());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('');
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

    const finalCategory = category || (autoCategorizationEnabled ? categorizeTransaction(description, categories) : 'Gasto Variável');

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date, // A data já está no formato correto YYYY-MM-DD
      description,
      amount: parsedAmount,
      category: finalCategory
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
    setCategory(value);
  };

  const predictedCategory = description ? categorizeTransaction(description, categories) : null;
  const categoryNames = getCategoryNames();

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
              Data *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">
              Valor (R$) *
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder="Ex: 25,50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
            Descrição *
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="Ex: Viagem de Uber para o trabalho"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant={autoCategorizationEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleAutoCategorizationToggle}
              className="flex items-center gap-2 h-10 px-4 rounded-xl font-medium transition-all duration-200"
            >
              <Sparkles className="h-4 w-4" />
              Categorização Automática
            </Button>
          </div>

          {autoCategorizationEnabled && predictedCategory && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 font-medium">
                <strong>Categoria sugerida:</strong> {predictedCategory}
              </p>
            </Card>
          )}

          {!autoCategorizationEnabled && (
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                Categoria Manual
              </Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryNames.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Adicionar Transação
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;
