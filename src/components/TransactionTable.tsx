
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Check, X, Filter } from 'lucide-react';
import { Transaction, CATEGORIES, CATEGORY_COLORS, TransactionCategory } from '@/types/transaction';
import { formatCurrency, formatDate, parseCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface TransactionTableProps {
  transactions: Transaction[];
  onRemoveTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onRemoveTransaction,
  onEditTransaction,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = filterCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === filterCategory);

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editForm.date || !editForm.description || !editForm.amount || !editForm.category) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const updatedTransaction: Transaction = {
      id: editingId!,
      date: editForm.date,
      description: editForm.description,
      amount: editForm.amount,
      category: editForm.category,
    };

    onEditTransaction(updatedTransaction);
    toast.success('Transação atualizada com sucesso!');
    setEditingId(null);
    setEditForm({});
  };

  const handleRemove = (id: string) => {
    onRemoveTransaction(id);
    toast.success('Transação removida com sucesso!');
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma transação encontrada</p>
        <p className="text-gray-400">Adicione sua primeira transação para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
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
          {filteredTransactions.length} de {transactions.length} transações
        </p>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell>
                  {editingId === transaction.id ? (
                    <Input
                      type="date"
                      value={editForm.date || ''}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-32"
                    />
                  ) : (
                    formatDate(transaction.date)
                  )}
                </TableCell>
                <TableCell>
                  {editingId === transaction.id ? (
                    <Input
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="min-w-40"
                    />
                  ) : (
                    transaction.description
                  )}
                </TableCell>
                <TableCell>
                  {editingId === transaction.id ? (
                    <Input
                      value={formatCurrency(editForm.amount || 0)}
                      onChange={(e) => setEditForm({ ...editForm, amount: parseCurrency(e.target.value) })}
                      className="w-24"
                    />
                  ) : (
                    `R$ ${formatCurrency(transaction.amount)}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === transaction.id ? (
                    <Select
                      value={editForm.category || ''}
                      onValueChange={(value) => setEditForm({ ...editForm, category: value as TransactionCategory })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${CATEGORY_COLORS[transaction.category]} border`}>
                      {transaction.category}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {editingId === transaction.id ? (
                      <>
                        <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEdit(transaction)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(transaction.id)} className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
