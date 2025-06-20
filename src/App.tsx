// Note que este código é mais simples que o último que te mandei.
// Ele não tem a lógica de adicionar/remover gastos ainda.
// Ele serve apenas para montar a estrutura visual do Bento Grid.

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <header className="py-4 px-6 shadow-elegant dark:shadow-elegant-lg bg-card flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-semibold tracking-tight">Gastos Organizados</h1>
        <button className="btn-secondary px-4 py-2">
          Mudar Tema
        </button>
      </header>

      <main className="p-6 bento-grid">

        <section id="add-expense-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Adicionar Gasto</h2>
          <form className="space-y-4 flex flex-col flex-grow">
            <div>
              <label htmlFor="expense-name" className="block text-sm font-medium text-muted-foreground">Nome</label>
              <input type="text" id="expense-name" className="mt-1 w-full px-3 py-2 border rounded-md focus-ring bg-input text-foreground" />
            </div>
            <div>
              <label htmlFor="expense-amount" className="block text-sm font-medium text-muted-foreground">Valor (R$)</label>
              <input type="number" id="expense-amount" className="mt-1 w-full px-3 py-2 border rounded-md focus-ring bg-input text-foreground" placeholder="ex: 42.50" />
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-md font-medium mt-auto">Adicionar</button>
          </form>
        </section>

        <section id="recent-expenses-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Gastos Recentes</h2>
          <p className="text-sm text-muted-foreground mt-4">Nenhum gasto adicionado ainda.</p>
        </section>

        <section id="total-spent-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">Total Gasto</h2>
          <p className="text-3xl font-bold text-primary">R$ 0,00</p>
        </section>

        <section id="last-expense-card" className="card-glass shadow-elegant-lg rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">Último Gasto</h2>
          <p className="text-xl font-medium">-</p>
        </section>

      </main>

      <footer className="py-3 text-center text-sm text-muted-foreground">
        © 2025 Gastos Organizados
      </footer>
    </div>
  );
}

export default App;
