
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Table, BarChart3, Shield, Target, FileText, Bell, TrendingUp, Filter, Upload, Calendar, Lightbulb } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import BudgetSummary from './BudgetSummary';
import BackupManager from './BackupManager';
import SavingsGoals from './SavingsGoals';
import ReportsExport from './ReportsExport';
import NotificationCenter from './NotificationCenter';
import PeriodComparison from './PeriodComparison';
import AdvancedFilters from './AdvancedFilters';
import InsightsDashboard from './InsightsDashboard';
import ExpensePlanner from './ExpensePlanner';
import DataImporter from './DataImporter';
import { Transaction } from '@/types/transaction';
import { SavingsGoal } from '@/types/goals';
import { Notification, NotificationSettings } from '@/types/notifications';

interface MainTabsProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
  goals: SavingsGoal[];
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  onAddTransaction: (transaction: Transaction) => void;
  onRemoveTransaction: (id: string) => void;
  onEditTransaction: (updatedTransaction: Transaction) => void;
  onAddGoal: (goal: SavingsGoal) => void;
  onRemoveGoal: (id: string) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onUpdateNotificationSettings: (settings: NotificationSettings) => void;
  onMarkNotificationAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onRestoreData?: (
    transactions: Transaction[],
    monthlyBudget: number,
    dailyBudget: number
  ) => void;
}

const MainTabs: React.FC<MainTabsProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
  goals,
  notifications,
  notificationSettings,
  onAddTransaction,
  onRemoveTransaction,
  onEditTransaction,
  onAddGoal,
  onRemoveGoal,
  onUpdateGoal,
  onUpdateNotificationSettings,
  onMarkNotificationAsRead,
  onDeleteNotification,
  onRestoreData
}) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Calcular gastos do mês atual para o planejador
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const handleImportTransactions = (newTransactions: Transaction[]) => {
    newTransactions.forEach(transaction => {
      onAddTransaction(transaction);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <Tabs defaultValue="add" className="w-full">
        {/* Layout mobile-first para as tabs */}
        <TabsList className="w-full bg-gray-50 dark:bg-slate-700 p-1 rounded-none border-b border-gray-100 dark:border-slate-600 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-1">
            <TabsTrigger 
              value="add" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <PlusCircle className="h-4 w-4 flex-shrink-0" />
              <span>Adicionar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="view" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Table className="h-4 w-4 flex-shrink-0" />
              <span>Transações</span>
            </TabsTrigger>
            <TabsTrigger 
              value="filters" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Filter className="h-4 w-4 flex-shrink-0" />
              <span>Filtros</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Lightbulb className="h-4 w-4 flex-shrink-0" />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="planner" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Planejador</span>
            </TabsTrigger>
            <TabsTrigger 
              value="import" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Upload className="h-4 w-4 flex-shrink-0" />
              <span>Importar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Target className="h-4 w-4 flex-shrink-0" />
              <span>Metas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>Relatórios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
              <span>Comparação</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max relative"
            >
              <Bell className="h-4 w-4 flex-shrink-0" />
              <span>Alertas</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span>Orçamento</span>
            </TabsTrigger>
            <TabsTrigger 
              value="backup" 
              className="flex items-center gap-1.5 px-3 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-all text-xs whitespace-nowrap min-w-max"
            >
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span>Backup</span>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="add" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Nova Transação</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Adicione uma nova despesa ao seu controle financeiro</p>
            </div>
            <TransactionForm onAddTransaction={onAddTransaction} />
          </div>
        </TabsContent>

        <TabsContent value="view" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Suas Transações</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Visualize e gerencie todas as suas despesas registradas</p>
            </div>
            <TransactionTable 
              transactions={filteredTransactions.length > 0 ? filteredTransactions : transactions} 
              onRemoveTransaction={onRemoveTransaction}
              onEditTransaction={onEditTransaction}
            />
          </div>
        </TabsContent>

        <TabsContent value="filters" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Filtros Avançados</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Filtre suas transações por data, valor, categoria e mais</p>
            </div>
            <AdvancedFilters
              transactions={transactions}
              onFilterChange={setFilteredTransactions}
            />
            {filteredTransactions.length > 0 && filteredTransactions.length !== transactions.length && (
              <div className="mt-6">
                <TransactionTable 
                  transactions={filteredTransactions} 
                  onRemoveTransaction={onRemoveTransaction}
                  onEditTransaction={onEditTransaction}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <InsightsDashboard
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              dailyBudget={dailyBudget}
            />
          </div>
        </TabsContent>

        <TabsContent value="planner" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <ExpensePlanner
              monthlyBudget={monthlyBudget}
              currentMonthExpenses={currentMonthExpenses}
            />
          </div>
        </TabsContent>

        <TabsContent value="import" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <DataImporter onImportTransactions={handleImportTransactions} />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <SavingsGoals
              goals={goals}
              onAddGoal={onAddGoal}
              onRemoveGoal={onRemoveGoal}
              onUpdateGoal={onUpdateGoal}
            />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Relatórios e Exportação</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Analise seus gastos e exporte relatórios detalhados</p>
            </div>
            <ReportsExport
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              dailyBudget={dailyBudget}
            />
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <PeriodComparison transactions={transactions} />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <NotificationCenter
              transactions={transactions}
              goals={goals}
              monthlyBudget={monthlyBudget}
              dailyBudget={dailyBudget}
              notifications={notifications}
              settings={notificationSettings}
              onUpdateSettings={onUpdateNotificationSettings}
              onMarkAsRead={onMarkNotificationAsRead}
              onDeleteNotification={onDeleteNotification}
            />
          </div>
        </TabsContent>

        <TabsContent value="budget" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Resumo do Orçamento</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Acompanhe seu progresso financeiro mensal e diário</p>
            </div>
            <BudgetSummary
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              dailyBudget={dailyBudget}
            />
          </div>
        </TabsContent>

        <TabsContent value="backup" className="p-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Backup dos Dados</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Mantenha seus dados financeiros seguros com backups automáticos</p>
            </div>
            {onRestoreData && (
              <BackupManager
                transactions={transactions}
                monthlyBudget={monthlyBudget}
                dailyBudget={dailyBudget}
                onRestoreData={onRestoreData}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainTabs;
