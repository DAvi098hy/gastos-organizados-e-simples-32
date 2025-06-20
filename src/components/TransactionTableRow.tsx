
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction, CATEGORY_COLORS } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/categorizationUtils';
import TransactionEditForm from './TransactionEditForm';

interface TransactionTableRowProps {
  transaction: Transaction;
  isEditing: boolean;
  editForm: Partial<Transaction>;
  onStartEdit: (transaction: Transaction) => void;
  onFormChange: (field: keyof Transaction, value: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: (id: string) => void;
}

const TransactionTableRow: React.FC<TransactionTableRowProps> = ({
  transaction,
  isEditing,
  editForm,
  onStartEdit,
  onFormChange,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}) => {
  if (isEditing) {
    return (
      <TableRow className="hover:bg-gray-50">
        <TransactionEditForm
          editForm={editForm}
          onFormChange={onFormChange}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      </TableRow>
    );
  }

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>{formatDate(transaction.date)}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>R$ {formatCurrency(transaction.amount)}</TableCell>
      <TableCell>
        <Badge className={`${CATEGORY_COLORS[transaction.category]} border`}>
          {transaction.category}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onStartEdit(transaction)} 
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onRemove(transaction.id)} 
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
