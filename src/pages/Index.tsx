"use client";

import { useState, useEffect } from "react";

export default function Index() {
  const [despesas, setDespesas] = useState(() => {
    const salvas = localStorage.getItem("despesas");
    return salvas ? JSON.parse(salvas) : [];
  });

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    localStorage.setItem("despesas", JSON.stringify(despesas));
  }, [despesas]);

  const adicionarDespesa = () => {
    if (descricao && valor) {
      setDespesas([...despesas, { descricao, valor }]);
      setDescricao("");
      setValor("");
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Gastos Organizados</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={adicionarDespesa}
        >
          Adicionar
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Minhas Despesas:</h2>
      <ul className="list-disc pl-5">
        {despesas.map((d, i) => (
          <li key={i}>
            {d.descricao}: R$ {d.valor}
          </li>
        ))}
      </ul>
    </main>
  );
}
