
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PlusCircle, Zap } from 'lucide-react';
import { Transaction, CATEGORIES, TransactionCategory } from '@/types/transaction';
import { categorizeTransaction, parseCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface QuickTransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const QuickTransactionForm: React.FC<QuickTransactionFormProps> = ({ onAddTransaction }) => {
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
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [isQuickMode, setIsQuickMode] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      toast.error('Preencha descrição e valor');
      return;
    }

    const parsedAmount = parseCurrency(amount);
    if (parsedAmount <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    const finalCategory = category || categorizeTransaction(description);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date,
      description,
      amount: parsedAmount,
      category: finalCategory as TransactionCategory
    };

    onAddTransaction(newTransaction);
    toast.success('Transação adicionada!');
    
    // Reset apenas descrição e valor para entrada rápida
    setDescription('');
    setAmount('');
    if (!isQuickMode) setCategory('');
  };

  const quickCategories = ['Alimentação', 'Transporte', 'Compras', 'Lazer'];

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-2 border-blue-100 dark:border-blue-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nova Transação</h3>
        <Button
          type="button"
          variant={isQuickMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsQuickMode(!isQuickMode)}
          className="flex items-center gap-1"
        >
          <Zap className="h-4 w-4" />
          Modo Rápido
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Linha principal - Descrição e Valor */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Ex: Almoço no restaurante"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              autoFocus
            />
          </div>
          <div>
            <Input
              placeholder="R$ 25,50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        {/* Modo rápido - Categorias em botões */}
        {isQuickMode && (
          <div className="flex flex-wrap gap-2">
            {quickCategories.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat as TransactionCategory)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* Modo avançado */}
        {!isQuickMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
            <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
              <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                <SelectValue placeholder="Categoria" />
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

        {/* Sugestão de categoria */}
        {description && !category && (
          <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
            💡 Sugestão: <strong>{categorizeTransaction(description)}</strong>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Adicionar Transação
        </Button>
      </form>
    </Card>
  );
};

export default QuickTransactionForm;
