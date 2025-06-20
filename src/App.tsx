import { useState, useEffect, FormEvent } from 'react';

// Definição de Tipos (Boa prática em TypeScript)
// Define o formato de um objeto de despesa.
type Expense = {
  id: number;
  name: string;
  amount: number;
};

// O Componente Principal da Aplicação
function App() {
  // PARTE 1: GERENCIAMENTO DE ESTADO (useState)
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // PARTE 2: EFEITOS COLATERAIS (useEffect)
  
  // Efeito para CARREGAR os dados do localStorage QUANDO o app inicia.
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []); // O array vazio `[]` significa que este efeito roda apenas uma vez.

  // Efeito para SALVAR os dados no localStorage SEMPRE QUE a lista `expenses` muda.
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  // Efeito para controlar o tema claro/escuro no HTML
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);


  // PARTE 3: LÓGICA E FUNÇÕES
  const handleAddExpense = (event: FormEvent) => {
    event.preventDefault(); // Impede que a página recarregue

    if (!expenseName.trim() || !expenseAmount) {
      alert("Por favor, preencha o nome e o valor da despesa.");
      return;
    }
    
    const newExpense: Expense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount)
    };

    setExpenses([...expenses, newExpense]);

    setExpenseName('');
    setExpenseAmount('');
  };

  const handleDeleteExpense = (idToDelete: number) => {
    setExpenses(expenses.filter(expense => expense.id !== idToDelete));
  };
  
  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PARTE 4: CÁLCULOS E DADOS DERIVADOS
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastExpense = expenses.length > 0 ? expenses[expenses.length - 1] : null;
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };


  // PARTE 5: RENDERIZAÇÃO (JSX)
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <header className="py-4 px-6 shadow-elegant dark:shadow-elegant-lg bg-card flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-semibold tracking-tight">Gastos Organizados</h1>
        <button onClick={handleThemeToggle} className="btn-secondary px-4 py-2 rounded-lg">
          Tema {theme === 'light' ? 'Escuro' : 'Claro'}
        </button>
      </header>

      <main className="p-6 bento-grid">

        <section id="add-expense-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Adicionar Gasto</h2>
          <form onSubmit={handleAddExpense} className="space-y-4 flex flex-col flex-grow">
            <div>
              <label htmlFor="expense-name" className="block text-sm font-medium text-muted-foreground">Nome</label>
              <input 
                type="text" 
                id="expense-name" 
                value={expenseName} 
                onChange={(e) => setExpenseName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md focus-ring bg-input text-foreground" 
                required
              />
            </div>
            <div>
              <label htmlFor="expense-amount" className="block text-sm font-medium text-muted-foreground">Valor (R$)</label>
              <input 
                type="number" 
                id="expense-amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md focus-ring bg-input text-foreground" 
                step="0.01" 
                placeholder="ex: 42.50"
                required 
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-md font-medium mt-auto">Adicionar</button>
          </form>
        </section>

        <section id="recent-expenses-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Gastos Recentes</h2>
          {expenses.length > 0 ? (
            <ul className="space-y-3 overflow-y-auto pr-2 flex-grow">
              {expenses.map(expense => (
                <li key={expense.id} className="flex justify-between items-center bg-secondary p-3 rounded-lg animate-fadeIn">
                  <div>
                    <p className="font-medium text-secondary-foreground">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(expense.amount)}</p>
                  </div>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 hover:text-red-700 font-bold text-xl px-2 rounded-full transition-colors">
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mt-4">Nenhum gasto adicionado ainda.</p>
          )}
        </section>

        <section id="total-spent-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <h2 className="text
