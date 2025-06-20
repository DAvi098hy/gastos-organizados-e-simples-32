
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Transaction, CATEGORIES, TransactionCategory } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

interface TransactionEditFormProps {
  editForm: Partial<Transaction>;
  onFormChange: (field: keyof Transaction, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TransactionEditForm: React.FC<TransactionEditFormProps> = ({
  editForm,
  onFormChange,
  onSave,
  onCancel,
}) => {
  return (
    <>
      <td className="p-4">
        <Input
          type="date"
          value={editForm.date || ''}
          onChange={(e) => onFormChange('date', e.target.value)}
          className="w-32"
        />
      </td>
      <td className="p-4">
        <Input
          value={editForm.description || ''}
          onChange={(e) => onFormChange('description', e.target.value)}
          className="min-w-40"
        />
      </td>
      <td className="p-4">
        <Input
          value={formatCurrency(editForm.amount || 0)}
          onChange={(e) => onFormChange('amount', parseFloat(e.target.value.replace(',', '.')) || 0)}
          className="w-24"
        />
      </td>
      <td className="p-4">
        <Select
          value={editForm.category || ''}
          onValueChange={(value) => onFormChange('category', value as TransactionCategory)}
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
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onSave} className="h-8 w-8 p-0">
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </>
  );
};

export default TransactionEditForm;
