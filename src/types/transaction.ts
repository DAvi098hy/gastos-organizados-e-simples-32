
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
}

export type TransactionCategory = 
  | "Uber"
  | "Facebook" 
  | "Gasto Mensal"
  | "Gasto Benéfico e Pessoal"
  | "Gasto Variável";

export const CATEGORIES: TransactionCategory[] = [
  "Uber",
  "Facebook",
  "Gasto Mensal", 
  "Gasto Benéfico e Pessoal",
  "Gasto Variável"
];

export const CATEGORY_COLORS = {
  "Uber": "bg-green-100 text-green-800 border-green-200",
  "Facebook": "bg-blue-100 text-blue-800 border-blue-200", 
  "Gasto Mensal": "bg-red-100 text-red-800 border-red-200",
  "Gasto Benéfico e Pessoal": "bg-purple-100 text-purple-800 border-purple-200",
  "Gasto Variável": "bg-orange-100 text-orange-800 border-orange-200"
};
