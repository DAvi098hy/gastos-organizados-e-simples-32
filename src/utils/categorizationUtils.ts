
import { TransactionCategory } from "@/types/transaction";

export const categorizeTransaction = (description: string): TransactionCategory => {
  const desc = description.toLowerCase();
  
  // Regra 1: Uber
  if (desc.includes("uber") || desc.includes("viagem uber") || desc.includes("entrega uber")) {
    return "Uber";
  }
  
  // Regra 1: Facebook
  if (desc.includes("facebook") || desc.includes("instagram") || desc.includes("whatsapp") || 
      desc.includes("anúncio") || desc.includes("marketplace") || desc.includes("facebook ads")) {
    return "Facebook";
  }
  
  // Regra 2: Gasto Mensal (despesas fixas/recorrentes)
  const gastoMensalKeywords = [
    "aluguel", "mensalidade", "conta de luz", "conta de água", "internet", 
    "telefone", "streaming", "academia", "seguro", "parcela", "empréstimo",
    "condomínio", "iptu", "ipva", "plano de saúde", "escola", "faculdade"
  ];
  
  if (gastoMensalKeywords.some(keyword => desc.includes(keyword))) {
    return "Gasto Mensal";
  }
  
  // Regra 3: Gasto Benéfico e Pessoal
  const gastoBeneficoPessoalKeywords = [
    "curso", "livro", "cinema", "restaurante", "viagem", "lazer", "hobby",
    "doação", "presente", "cabeleireiro", "salão", "spa", "massagem", 
    "terapia", "psicólogo", "cultura", "teatro", "show", "evento",
    "desenvolvimento pessoal", "well-being", "bem-estar"
  ];
  
  if (gastoBeneficoPessoalKeywords.some(keyword => desc.includes(keyword))) {
    return "Gasto Benéfico e Pessoal";
  }
  
  // Regra 4: Gasto Variável (padrão para todo o resto)
  return "Gasto Variável";
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
