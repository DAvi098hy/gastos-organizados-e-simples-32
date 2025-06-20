
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Transaction, TransactionCategory } from '@/types/transaction';
import { toast } from 'sonner';
import TransactionTableHeader from './TransactionTableHeader';
import TransactionTableRow from './TransactionTableRow';

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

  const handleFormChange = (field: keyof Transaction, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
      <TransactionTableHeader
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        filteredCount={filteredTransactions.length}
        totalCount={transactions.length}
      />

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                isEditing={editingId === transaction.id}
                editForm={editForm}
                onStartEdit={startEdit}
                onFormChange={handleFormChange}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onRemove={handleRemove}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
