"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Index() {
  const [despesas, setDespesas] = useState<{ descricao: string; valor: string }[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // Carregar dados do localStorage
  useEffect(() => {
    const salvas = localStorage.getItem("despesas");
    if (salvas) {
      setDespesas(JSON.parse(salvas));
    }
  }, []);

  // Salvar sempre que mudar
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Gastos Organizados</h1>

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

      <h2 className="text-2xl font-semibold mb-2">Minhas Despesas</h2>
      <ul className="list-disc pl-5">
        {despesas.map((d, i) => (
          <li key={i}>
            {d.descricao}: R$ {d.valor}
          </li>
        ))}
      </ul>
    </div>
  );
}
