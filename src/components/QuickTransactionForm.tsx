
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { PlusCircle, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { categorizeTransaction, parseCurrency } from '@/utils/categorizationUtils';
import { useCategoryManager } from '@/hooks/useCategoryManager';
import { toast } from 'sonner';

interface QuickTransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const QuickTransactionForm: React.FC<QuickTransactionFormProps> = ({ onAddTransaction }) => {
  const { categories, getCategoryNames } = useCategoryManager();
  
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

    const finalCategory = category || categorizeTransaction(description, categories);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date,
      description,
      amount: parsedAmount,
      category: finalCategory
    };

    onAddTransaction(newTransaction);
    toast.success('Transação adicionada!');
    
    // Reset apenas descrição e valor para entrada rápida
    setDescription('');
    setAmount('');
    if (!isQuickMode) setCategory('');
  };

  const quickCategories = categories.slice(0, 4).map(cat => cat.name);
  const categoryNames = getCategoryNames();

  return (
    <Card className="card-glass rounded-3xl shadow-elegant-xl border p-8 animate-slideUp">
      {/* Header with modern styling */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl">
            <PlusCircle className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nova Transação</h3>
        </div>
        
        <Button
          type="button"
          variant={isQuickMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsQuickMode(!isQuickMode)}
          className={`
            flex items-center gap-2 rounded-xl transition-all duration-200 px-4 py-2
            ${isQuickMode 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-elegant' 
              : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
            }
          `}
        >
          <Zap className="h-4 w-4" />
          Modo Rápido
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-elegant">
        {/* Main input section with enhanced styling */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              placeholder="Ex: Almoço no restaurante favorito"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-14 text-lg border-2 border-slate-200/60 focus:border-blue-500 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus-ring transition-all duration-200"
              autoFocus
            />
          </div>
          <div>
            <Input
              placeholder="R$ 25,50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-14 text-lg border-2 border-slate-200/60 focus:border-blue-500 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus-ring transition-all duration-200"
            />
          </div>
        </div>

        {/* Quick mode - Enhanced category buttons */}
        {isQuickMode && (
          <div className="flex flex-wrap gap-3">
            {quickCategories.map((cat, index) => {
              const gradients = [
                'from-emerald-500 to-teal-500',
                'from-blue-500 to-cyan-500',
                'from-violet-500 to-purple-500',
                'from-pink-500 to-rose-500'
              ];
              
              return (
                <Button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`
                    rounded-2xl px-6 py-3 font-medium transition-all duration-200 transform hover:scale-105
                    ${category === cat
                      ? `bg-gradient-to-r ${gradients[index]} text-white shadow-elegant-lg`
                      : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600/60 shadow-elegant'
                    }
                  `}
                  variant="ghost"
                >
                  {cat}
                </Button>
              );
            })}
          </div>
        )}

        {/* Advanced mode with cleaner styling */}
        {!isQuickMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 border-2 border-slate-200/60 focus:border-blue-500 rounded-2xl bg-white/80 dark:bg-slate-800/80 focus-ring"
            />
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="h-12 border-2 border-slate-200/60 focus:border-blue-500 rounded-2xl bg-white/80 dark:bg-slate-800/80 focus-ring">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg">
                {categoryNames.map((cat) => (
                  <SelectItem key={cat} value={cat} className="rounded-xl">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* AI suggestion with modern styling */}
        {description && !category && (
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/50 dark:to-violet-950/50 border border-blue-200/60 dark:border-blue-800/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Sugestão da IA</p>
              <p className="text-blue-700 dark:text-blue-300 font-semibold">
                {categorizeTransaction(description, categories)}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced submit button */}
        <Button 
          type="submit" 
          className="w-full h-16 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-elegant-xl hover:shadow-elegant-xl text-lg transition-all duration-300 transform hover:scale-[1.02] group"
        >
          <PlusCircle className="h-6 w-6 mr-3 transition-transform duration-200 group-hover:rotate-90" />
          Adicionar Transação
          <ArrowRight className="h-5 w-5 ml-3 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </form>
    </Card>
  );
};

export default QuickTransactionForm;
