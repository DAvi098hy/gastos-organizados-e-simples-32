
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { CATEGORIES } from '@/types/transaction';

interface TransactionTableHeaderProps {
  filterCategory: string;
  onFilterChange: (category: string) => void;
  filteredCount: number;
  totalCount: number;
}

const TransactionTableHeader: React.FC<TransactionTableHeaderProps> = ({
  filterCategory,
  onFilterChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={filterCategory} onValueChange={onFilterChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">
          {filteredCount} de {totalCount} transações
        </p>
      </div>

      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="font-semibold">Data</TableHead>
          <TableHead className="font-semibold">Descrição</TableHead>
          <TableHead className="font-semibold">Valor</TableHead>
          <TableHead className="font-semibold">Categoria</TableHead>
          <TableHead className="font-semibold w-32">Ações</TableHead>
        </TableRow>
      </TableHeader>
    </>
  );
};

export default TransactionTableHeader;
