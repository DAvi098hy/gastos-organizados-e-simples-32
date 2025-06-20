
export interface Notification {
  id: string;
  type: 'budget_warning' | 'goal_reminder' | 'expense_insight' | 'monthly_summary';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  expenseThreshold: number;
}
