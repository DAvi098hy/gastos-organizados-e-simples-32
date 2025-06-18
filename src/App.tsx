import { useState, useEffect } from 'react';

export default function App() {
  // Estado: lista de despesas
  const [despesas, setDespesas] = useState(() => {
    const salvas = localStorage.getItem('despesas');
    return salvas ? JSON.parse(salvas) : [];
  });

  // Estados para os campos de entrada
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  // Sempre que mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
  }, [despesas]);

  // Função para adicionar nova despesa
  const adicionarDespesa = () => {
    if (descricao && valor) {
      setDespesas([...despesas, { descricao, valor }]);
      setDescricao('');
      setValor('');
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Gastos Organizados e Simples</h1>

      <input
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />

      <button onClick={adicionarDespesa}>Adicionar</button>

      <h2>Minhas Despesas:</h2>
      <ul>
        {despesas.map((d, i) => (
          <li key={i}>
            {d.descricao}: R$ {d.valor}
          </li>
        ))}
      </ul>
    </main>
  );
}
