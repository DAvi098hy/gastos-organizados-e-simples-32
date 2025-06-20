
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Upload, 
  Save, 
  RefreshCw, 
  Trash2, 
  Calendar,
  FileText,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useBackup } from '@/hooks/useBackup';
import { Transaction } from '@/types/transaction';
import { formatDate } from '@/utils/categorizationUtils';

interface BackupManagerProps {
  transactions: Transaction[];
  monthlyBudget: number;
  dailyBudget: number;
  onRestoreData: (
    transactions: Transaction[],
    monthlyBudget: number,
    dailyBudget: number
  ) => void;
}

const BackupManager: React.FC<BackupManagerProps> = ({
  transactions,
  monthlyBudget,
  dailyBudget,
  onRestoreData
}) => {
  const {
    backups,
    lastBackupTime,
    saveBackup,
    exportBackup,
    importBackup,
    restoreBackup,
    deleteBackup,
    shouldCreateAutoBackup
  } = useBackup();

  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBackup = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula processamento
    saveBackup(transactions, monthlyBudget, dailyBudget, false);
    setIsProcessing(false);
  };

  const handleExportBackup = () => {
    exportBackup(transactions, monthlyBudget, dailyBudget);
  };

  const handleImportBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const backup = await importBackup(file);
    
    if (backup) {
      onRestoreData(backup.transactions, backup.monthlyBudget, backup.dailyBudget);
    }
    
    setIsProcessing(false);
    event.target.value = ''; // Reset input
  };

  const handleRestoreBackup = (backupId: string) => {
    setIsProcessing(true);
    const backup = restoreBackup(backupId);
    
    if (backup) {
      onRestoreData(backup.transactions, backup.monthlyBudget, backup.dailyBudget);
    }
    
    setIsProcessing(false);
  };

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  const getTimeSinceLastBackup = (): string => {
    if (!lastBackupTime) return 'Nunca';
    
    const lastBackup = new Date(lastBackupTime);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Há menos de 1 hora';
    if (diffHours < 24) return `Há ${diffHours} horas`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays} dias`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Backup e Restauração
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Proteja seus dados financeiros com backups automáticos e manuais
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status do Último Backup */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-600" />
            <div>
              <p className="text-sm font-medium">Último Backup</p>
              <p className="text-xs text-muted-foreground">{getTimeSinceLastBackup()}</p>
            </div>
          </div>
          {shouldCreateAutoBackup() && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Backup Recomendado
            </Badge>
          )}
        </div>

        {/* Ações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleCreateBackup}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isProcessing ? 'Criando...' : 'Criar Backup'}
          </Button>
          
          <Button
            onClick={handleExportBackup}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          
          <Button
            onClick={handleImportBackup}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Separator />

        {/* Histórico de Backups */}
        <div>
          <h3 className="text-sm font-medium mb-3">Histórico de Backups</h3>
          
          {backups.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum backup encontrado</p>
              <p className="text-xs">Crie seu primeiro backup para proteger seus dados</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">
                        {formatDate(backup.createdAt.split('T')[0])}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {backup.transactionCount} transações
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{new Date(backup.createdAt).toLocaleTimeString()}</span>
                      <span>{formatFileSize(backup.size)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={isProcessing}
                      title="Restaurar este backup"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteBackup(backup.id)}
                      title="Excluir este backup"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações de Segurança */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Seus dados estão seguros</p>
              <p>
                Os backups são armazenados localmente no seu navegador e podem ser exportados 
                para um arquivo seguro no seu computador.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupManager;
