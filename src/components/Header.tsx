
import React from 'react';
import { Wallet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
        <Wallet className="text-white h-8 w-8" />
      </div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
        Organizador Financeiro
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Categorize e organize suas despesas automaticamente com inteligência artificial
      </p>
    </div>
  );
};

export default Header;
