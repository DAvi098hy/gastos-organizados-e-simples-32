
import { CategoryRule } from "@/types/transaction";

export const categorizeTransaction = (description: string, categories: CategoryRule[]): string => {
  const desc = description.toLowerCase();
  
  // Procura pela primeira categoria que tenha uma palavra-chave correspondente
  for (const category of categories) {
    if (category.keywords.some(keyword => desc.includes(keyword.toLowerCase()))) {
      return category.name;
    }
  }
  
  // Se não encontrar nenhuma correspondência, retorna "Gasto Variável" ou a última categoria
  const fallbackCategory = categories.find(cat => cat.name === "Gasto Variável") || categories[categories.length - 1];
  return fallbackCategory.name;
};

export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2).replace(".", ",");
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(",", ".")) || 0;
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};
