
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, PlusCircle, Table } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Calculator className="text-blue-600" />
          Organizador Financeiro
        </h1>
        <p className="text-lg text-gray-600">
          Categorize e organize suas despesas automaticamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total de Transações</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <Table className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Valor Total</p>
                <p className="text-2xl font-bold">R$ {formatCurrency(totalAmount)}</p>
              </div>
              <Calculator className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Categorias Ativas</p>
                <p className="text-2xl font-bold">{new Set(transactions.map(t => t.category)).size}</p>
              </div>
              <PlusCircle className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Adicionar Transação
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Ver Transações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nova Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionForm onAddTransaction={addTransaction} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Suas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable 
                transactions={transactions} 
                onRemoveTransaction={removeTransaction}
                onEditTransaction={editTransaction}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseTracker;
