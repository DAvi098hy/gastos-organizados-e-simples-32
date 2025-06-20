
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Table, BarChart3, Shield, Target, FileText, Bell, TrendingUp } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import BudgetSummary from './BudgetSummary';
import BackupManager from './BackupManager';
import SavingsGoals from './SavingsGoals';
import ReportsExport from './ReportsExport';
import NotificationCenter from './NotificationCenter';
import PeriodComparison from './PeriodComparison';
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
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-gray-50 dark:bg-slate-700 p-2 rounded-none border-b border-gray-100 dark:border-slate-600">
          <TabsTrigger 
            value="add" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar
          </TabsTrigger>
          <TabsTrigger 
            value="view" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <Table className="h-4 w-4" />
            Transações
          </TabsTrigger>
          <TabsTrigger 
            value="goals" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <Target className="h-4 w-4" />
            Metas
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <TrendingUp className="h-4 w-4" />
            Comparação
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs relative"
          >
            <Bell className="h-4 w-4" />
            Alertas
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="budget" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <BarChart3 className="h-4 w-4" />
            Orçamento
          </TabsTrigger>
          <TabsTrigger 
            value="backup" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm rounded-xl font-medium transition-colors text-xs"
          >
            <Shield className="h-4 w-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Nova Transação</h2>
              <p className="text-gray-600 dark:text-gray-300">Adicione uma nova despesa ao seu controle financeiro</p>
            </div>
            <TransactionForm onAddTransaction={onAddTransaction} />
          </div>
        </TabsContent>

        <TabsContent value="view" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Suas Transações</h2>
              <p className="text-gray-600 dark:text-gray-300">Visualize e gerencie todas as suas despesas registradas</p>
            </div>
            <TransactionTable 
              transactions={transactions} 
              onRemoveTransaction={onRemoveTransaction}
              onEditTransaction={onEditTransaction}
            />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="p-0">
          <div className="p-8">
            <SavingsGoals
              goals={goals}
              onAddGoal={onAddGoal}
              onRemoveGoal={onRemoveGoal}
              onUpdateGoal={onUpdateGoal}
            />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Relatórios e Exportação</h2>
              <p className="text-gray-600 dark:text-gray-300">Analise seus gastos e exporte relatórios detalhados</p>
            </div>
            <ReportsExport
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              dailyBudget={dailyBudget}
            />
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="p-0">
          <div className="p-8">
            <PeriodComparison transactions={transactions} />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="p-0">
          <div className="p-8">
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
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Resumo do Orçamento</h2>
              <p className="text-gray-600 dark:text-gray-300">Acompanhe seu progresso financeiro mensal e diário</p>
            </div>
            <BudgetSummary
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              dailyBudget={dailyBudget}
            />
          </div>
        </TabsContent>

        <TabsContent value="backup" className="p-0">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Backup dos Dados</h2>
              <p className="text-gray-600 dark:text-gray-300">Mantenha seus dados financeiros seguros com backups automáticos</p>
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
