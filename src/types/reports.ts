
import { Transaction } from './transaction';

export interface ReportData {
  period: string;
  totalExpenses: number;
  categoryBreakdown: { [key: string]: number };
  averageDaily: number;
  topExpenses: Transaction[];
  trends: {
    thisMonth: number;
    lastMonth: number;
    percentChange: number;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  period: 'all' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  includeCharts: boolean;
}
