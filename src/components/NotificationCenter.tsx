
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Bell, BellOff, AlertTriangle, Target, TrendingUp, Calendar, Settings, Check, X } from 'lucide-react';
import { Notification, NotificationSettings } from '@/types/notifications';
import { Transaction } from '@/types/transaction';
import { SavingsGoal } from '@/types/goals';
import { formatCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface NotificationCenterProps {
  transactions: Transaction[];
  goals: SavingsGoal[];
  monthlyBudget: number;
  dailyBudget: number;
  notifications: Notification[];
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  transactions,
  goals,
  monthlyBudget,
  dailyBudget,
  notifications,
  settings,
  onUpdateSettings,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'budget_warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'goal_reminder':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'expense_insight':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'monthly_summary':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateSmartNotifications = (): Notification[] => {
    const newNotifications: Notification[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Verificar orçamento mensal
    const monthlyExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    if (settings.budgetAlerts && monthlyExpenses > monthlyBudget * 0.8) {
      const percentage = (monthlyExpenses / monthlyBudget) * 100;
      newNotifications.push({
        id: `budget-warning-${Date.now()}`,
        type: 'budget_warning',
        title: 'Alerta de Orçamento',
        message: `Você já gastou ${percentage.toFixed(0)}% do seu orçamento mensal (R$ ${formatCurrency(monthlyExpenses)} de R$ ${formatCurrency(monthlyBudget)})`,
        createdAt: new Date().toISOString(),
        isRead: false,
        priority: percentage > 100 ? 'high' : 'medium',
      });
    }

    // Verificar metas próximas do prazo
    if (settings.goalReminders) {
      goals.forEach(goal => {
        if (!goal.isCompleted) {
          const deadline = new Date(goal.deadline);
          const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysRemaining <= 30 && daysRemaining > 0) {
            newNotifications.push({
              id: `goal-reminder-${goal.id}-${Date.now()}`,
              type: 'goal_reminder',
              title: 'Lembrete de Meta',
              message: `A meta "${goal.name}" vence em ${daysRemaining} dias. Faltam R$ ${formatCurrency(goal.targetAmount - goal.currentAmount)}`,
              createdAt: new Date().toISOString(),
              isRead: false,
              priority: daysRemaining <= 7 ? 'high' : 'medium',
            });
          }
        }
      });
    }

    // Insights de gastos
    const lastWeekExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactionDate >= weekAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    if (lastWeekExpenses > dailyBudget * 7 * 1.5) {
      newNotifications.push({
        id: `expense-insight-${Date.now()}`,
        type: 'expense_insight',
        title: 'Insight de Gastos',
        message: `Seus gastos da última semana (R$ ${formatCurrency(lastWeekExpenses)}) estão 50% acima do esperado`,
        createdAt: new Date().toISOString(),
        isRead: false,
        priority: 'medium',
      });
    }

    return newNotifications;
  };

  useEffect(() => {
    // Gerar notificações inteligentes periodicamente
    const interval = setInterval(() => {
      const smartNotifications = generateSmartNotifications();
      // Aqui você adicionaria as notificações ao estado global
      // Este é um exemplo de como o sistema funcionaria
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [transactions, goals, settings, monthlyBudget, dailyBudget]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Central de Notificações</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} não lidas
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurações
        </Button>
      </div>

      {showSettings && (
        <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Configurações de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="budgetAlerts">Alertas de Orçamento</Label>
                <Switch
                  id="budgetAlerts"
                  checked={settings.budgetAlerts}
                  onCheckedChange={(checked) => 
                    onUpdateSettings({ ...settings, budgetAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="goalReminders">Lembretes de Metas</Label>
                <Switch
                  id="goalReminders"
                  checked={settings.goalReminders}
                  onCheckedChange={(checked) => 
                    onUpdateSettings({ ...settings, goalReminders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weeklyReports">Relatórios Semanais</Label>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => 
                    onUpdateSettings({ ...settings, weeklyReports: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyReports">Relatórios Mensais</Label>
                <Switch
                  id="monthlyReports"
                  checked={settings.monthlyReports}
                  onCheckedChange={(checked) => 
                    onUpdateSettings({ ...settings, monthlyReports: checked })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expenseThreshold">Limite para Alerta de Gasto Alto (R$)</Label>
              <Input
                id="expenseThreshold"
                type="number"
                value={settings.expenseThreshold}
                onChange={(e) => 
                  onUpdateSettings({ ...settings, expenseThreshold: parseFloat(e.target.value) || 0 })
                }
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Você está em dia! Não há notificações no momento.
            </p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority === 'high' ? 'Alta' : 
                           notification.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      title="Excluir"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
