
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface CategoryRule {
  id: string;
  name: string;
  keywords: string[];
  color: string;
  isDefault: boolean;
}

export const DEFAULT_CATEGORIES: CategoryRule[] = [
  {
    id: "uber",
    name: "Uber",
    keywords: ["uber", "viagem uber", "entrega uber"],
    color: "bg-green-100 text-green-800 border-green-200",
    isDefault: true
  },
  {
    id: "facebook",
    name: "Facebook",
    keywords: ["facebook", "instagram", "whatsapp", "anúncio", "marketplace", "facebook ads"],
    color: "bg-blue-100 text-blue-800 border-blue-200",
    isDefault: true
  },
  {
    id: "gasto-mensal",
    name: "Gasto Mensal",
    keywords: ["aluguel", "mensalidade", "conta de luz", "conta de água", "internet", "telefone", "streaming", "academia", "seguro", "parcela", "empréstimo", "condomínio", "iptu", "ipva", "plano de saúde", "escola", "faculdade"],
    color: "bg-red-100 text-red-800 border-red-200",
    isDefault: true
  },
  {
    id: "gasto-benefico",
    name: "Gasto Benéfico e Pessoal",
    keywords: ["curso", "livro", "cinema", "restaurante", "viagem", "lazer", "hobby", "doação", "presente", "cabeleireiro", "salão", "spa", "massagem", "terapia", "psicólogo", "cultura", "teatro", "show", "evento", "desenvolvimento pessoal", "well-being", "bem-estar"],
    color: "bg-purple-100 text-purple-800 border-purple-200",
    isDefault: true
  },
  {
    id: "gasto-variavel",
    name: "Gasto Variável",
    keywords: [],
    color: "bg-orange-100 text-orange-800 border-orange-200",
    isDefault: true
  }
];

// Manter compatibilidade com código existente
export type TransactionCategory = string;

export const CATEGORIES: string[] = DEFAULT_CATEGORIES.map(cat => cat.name);

export const CATEGORY_COLORS: Record<string, string> = DEFAULT_CATEGORIES.reduce((acc, cat) => {
  acc[cat.name] = cat.color;
  return acc;
}, {} as Record<string, string>);
