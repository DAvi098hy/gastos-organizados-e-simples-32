"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ExpenseTracker = () => {
  const [despesas, setDespesas] = useState<{ descricao: string; valor: string }[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // Carregar despesas do localStorage
  useEffect(() => {
    const salvas = localStorage.getItem("despesas");
    if (salvas) {
      setDespesas(JSON.parse(salvas));
    }
  }, []);

  // Salvar despesas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("despesas", JSON.stringify(despesas));
  }, [despesas]);

  const adicionarDespesa = () => {
    if (descricao.trim() && valor.trim()) {
      setDespesas([...despesas, { descricao, valor }]);
      setDescricao("");
      setValor("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Gastos Organizados</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <Button onClick={adicionarDespesa}>Adicionar</Button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Minhas Despesas:</h2>
      <ul className="list-disc pl-5">
        {despesas.map((d, i) => (
          <li key={i} className="mb-1">
            {d.descricao}: R$ {d.valor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
