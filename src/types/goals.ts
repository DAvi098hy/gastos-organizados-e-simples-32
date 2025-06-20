
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
  description?: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface GoalProgress {
  goalId: string;
  percentage: number;
  remainingAmount: number;
  daysRemaining: number;
  monthlyRequiredSaving: number;
}
