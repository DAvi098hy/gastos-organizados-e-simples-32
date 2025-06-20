
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar, DollarSign } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface FilterCriteria {
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  categories: string[];
  description?: string;
}

interface AdvancedFiltersProps {
  transactions: Transaction[];
  onFilterChange: (filteredTransactions: Transaction[]) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  transactions,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterCriteria>({
    categories: [],
  });
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    let filtered = transactions;

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo!));
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(t => filters.categories.includes(t.category));
    }

    if (filters.description) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(filters.description!.toLowerCase())
      );
    }

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setFilters({ categories: [] });
    onFilterChange(transactions);
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''
  ).length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Fechar' : 'Abrir'}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-6">
          {/* Filtros de Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data Inicial
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data Final
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Filtros de Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAmount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Mínimo (R$)
              </Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.minAmount || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxAmount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Máximo (R$)
              </Label>
              <Input
                id="maxAmount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.maxAmount || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Filtro de Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Buscar na descrição..."
              value={filters.description || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Filtro de Categorias */}
          <div>
            <Label>Categorias</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
            {filters.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button onClick={applyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdvancedFilters;
