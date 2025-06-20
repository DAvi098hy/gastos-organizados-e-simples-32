
import { useEffect, useRef } from 'react';
import { useBackup } from './useBackup';
import { Transaction } from '@/types/transaction';

interface UseAutoBackupProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
  enabled?: boolean;
}

export const useAutoBackup = ({ 
  transactions, 
  monthlyBudget, 
  dailyBudget, 
  enabled = true 
}: UseAutoBackupProps) => {
  const { saveBackup, shouldCreateAutoBackup } = useBackup();
  const lastTransactionCount = useRef(transactions.length);
  const backupInterval = useRef<NodeJS.Timeout>();

  // Backup automático baseado em tempo (24 horas)
  useEffect(() => {
    if (!enabled) return;

    const checkAndCreateBackup = () => {
      if (shouldCreateAutoBackup() && transactions.length > 0) {
        console.log('Criando backup automático...');
        saveBackup(transactions, monthlyBudget, dailyBudget, true);
      }
    };

    // Verifica imediatamente
    checkAndCreateBackup();

    // Configura verificação periódica (a cada hora)
    backupInterval.current = setInterval(checkAndCreateBackup, 60 * 60 * 1000);

    return () => {
      if (backupInterval.current) {
        clearInterval(backupInterval.current);
      }
    };
  }, [enabled, transactions.length, monthlyBudget, dailyBudget, saveBackup, shouldCreateAutoBackup]);

  // Backup automático baseado em mudanças significativas
  useEffect(() => {
    if (!enabled) return;

    const currentCount = transactions.length;
    const countDiff = Math.abs(currentCount - lastTransactionCount.current);

    // Cria backup se houve mudança significativa (5+ transações)
    if (countDiff >= 5 && currentCount > 0) {
      console.log('Criando backup devido a mudanças significativas...');
      saveBackup(transactions, monthlyBudget, dailyBudget, true);
    }

    lastTransactionCount.current = currentCount;
  }, [transactions.length, monthlyBudget, dailyBudget, enabled, saveBackup]);
};
