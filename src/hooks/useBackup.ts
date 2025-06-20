
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Transaction } from '@/types/transaction';

interface BackupData {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
  createdAt: string;
  version: string;
}

interface BackupMetadata {
  id: string;
  createdAt: string;
  size: number;
  transactionCount: number;
}

export const useBackup = () => {
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);

  // Carrega histórico de backups ao inicializar
  useEffect(() => {
    loadBackupHistory();
    const lastBackup = localStorage.getItem('lastBackupTime');
    setLastBackupTime(lastBackup);
  }, []);

  const loadBackupHistory = () => {
    try {
      const history = localStorage.getItem('backupHistory');
      if (history) {
        setBackups(JSON.parse(history));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de backups:', error);
    }
  };

  const saveBackupHistory = (newBackups: BackupMetadata[]) => {
    try {
      localStorage.setItem('backupHistory', JSON.stringify(newBackups));
      setBackups(newBackups);
    } catch (error) {
      console.error('Erro ao salvar histórico de backups:', error);
    }
  };

  const createBackup = (
    transactions: Transaction[],
    monthlyBudget: number,
    dailyBudget: number
  ): BackupData => {
    return {
      transactions,
      monthlyBudget,
      dailyBudget,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };
  };

  const saveBackup = (
    transactions: Transaction[],
    monthlyBudget: number,
    dailyBudget: number,
    isAutomatic: boolean = false
  ) => {
    try {
      const backup = createBackup(transactions, monthlyBudget, dailyBudget);
      const backupId = `backup_${Date.now()}`;
      
      // Salva o backup
      localStorage.setItem(backupId, JSON.stringify(backup));
      
      // Atualiza o histórico
      const metadata: BackupMetadata = {
        id: backupId,
        createdAt: backup.createdAt,
        size: JSON.stringify(backup).length,
        transactionCount: transactions.length
      };
      
      const newBackups = [metadata, ...backups].slice(0, 10); // Mantém apenas os 10 mais recentes
      saveBackupHistory(newBackups);
      
      // Atualiza o tempo do último backup
      const now = new Date().toISOString();
      localStorage.setItem('lastBackupTime', now);
      setLastBackupTime(now);

      if (!isAutomatic) {
        toast.success('Backup criado com sucesso! 💾', {
          description: `${transactions.length} transações salvas`
        });
      }

      return backupId;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup');
      return null;
    }
  };

  const exportBackup = (
    transactions: Transaction[],
    monthlyBudget: number,
    dailyBudget: number
  ) => {
    try {
      const backup = createBackup(transactions, monthlyBudget, dailyBudget);
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gastos-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast.success('Backup exportado com sucesso! 📁', {
        description: 'Arquivo salvo na pasta de downloads'
      });
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      toast.error('Erro ao exportar backup');
    }
  };

  const importBackup = (file: File): Promise<BackupData | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const backup: BackupData = JSON.parse(content);
          
          // Validação básica
          if (!backup.transactions || !Array.isArray(backup.transactions)) {
            throw new Error('Formato de backup inválido');
          }
          
          toast.success('Backup importado com sucesso! 📂', {
            description: `${backup.transactions.length} transações restauradas`
          });
          
          resolve(backup);
        } catch (error) {
          console.error('Erro ao importar backup:', error);
          toast.error('Erro ao importar backup', {
            description: 'Verifique se o arquivo está no formato correto'
          });
          resolve(null);
        }
      };
      
      reader.readAsText(file);
    });
  };

  const restoreBackup = (backupId: string): BackupData | null => {
    try {
      const backupData = localStorage.getItem(backupId);
      if (!backupData) {
        toast.error('Backup não encontrado');
        return null;
      }
      
      const backup: BackupData = JSON.parse(backupData);
      
      toast.success('Dados restaurados com sucesso! ♻️', {
        description: `${backup.transactions.length} transações restauradas`
      });
      
      return backup;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error('Erro ao restaurar backup');
      return null;
    }
  };

  const deleteBackup = (backupId: string) => {
    try {
      localStorage.removeItem(backupId);
      const newBackups = backups.filter(b => b.id !== backupId);
      saveBackupHistory(newBackups);
      
      toast.success('Backup removido');
    } catch (error) {
      console.error('Erro ao remover backup:', error);
      toast.error('Erro ao remover backup');
    }
  };

  const shouldCreateAutoBackup = (): boolean => {
    if (!lastBackupTime) return true;
    
    const lastBackup = new Date(lastBackupTime);
    const now = new Date();
    const diffHours = (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60);
    
    return diffHours >= 24; // Backup automático a cada 24 horas
  };

  return {
    backups,
    lastBackupTime,
    saveBackup,
    exportBackup,
    importBackup,
    restoreBackup,
    deleteBackup,
    shouldCreateAutoBackup
  };
};
