
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Transaction, TransactionCategory, CATEGORIES } from '@/types/transaction';
import { formatCurrency } from '@/utils/categorizationUtils';
import { toast } from 'sonner';

interface DataImporterProps {
  onImportTransactions: (transactions: Transaction[]) => void;
}

interface ImportMapping {
  dateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
  categoryColumn?: string;
  defaultCategory: TransactionCategory;
}

const DataImporter: React.FC<DataImporterProps> = ({ onImportTransactions }) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ImportMapping>({
    dateColumn: '',
    descriptionColumn: '',
    amountColumn: '',
    defaultCategory: 'Gasto Variável',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<Transaction[]>([]);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const data = lines.map(line => 
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      
      if (data.length > 0) {
        setHeaders(data[0]);
        setCsvData(data.slice(1));
        setStep('mapping');
        toast.success('Arquivo carregado com sucesso!');
      }
    };
    
    reader.readAsText(uploadedFile);
  };

  const generatePreview = () => {
    if (!mapping.dateColumn || !mapping.descriptionColumn || !mapping.amountColumn) {
      toast.error('Por favor, mapeie todos os campos obrigatórios');
      return;
    }

    setIsProcessing(true);

    try {
      const dateIndex = headers.indexOf(mapping.dateColumn);
      const descriptionIndex = headers.indexOf(mapping.descriptionColumn);
      const amountIndex = headers.indexOf(mapping.amountColumn);
      const categoryIndex = mapping.categoryColumn ? headers.indexOf(mapping.categoryColumn) : -1;

      const transactions: Transaction[] = csvData.slice(0, 10).map((row, index) => {
        const dateStr = row[dateIndex];
        const description = row[descriptionIndex];
        const amountStr = row[amountIndex].replace(/[^\d,-]/g, '').replace(',', '.');
        const amount = parseFloat(amountStr) || 0;
        
        let category: TransactionCategory = mapping.defaultCategory;
        if (categoryIndex >= 0 && row[categoryIndex]) {
          const csvCategory = row[categoryIndex];
          const matchedCategory = CATEGORIES.find(cat => 
            cat.toLowerCase().includes(csvCategory.toLowerCase()) ||
            csvCategory.toLowerCase().includes(cat.toLowerCase())
          );
          if (matchedCategory) {
            category = matchedCategory;
          }
        }

        // Tentar diferentes formatos de data
        let date = '';
        if (dateStr) {
          const dateFormats = [
            /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
            /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
            /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
          ];

          for (const format of dateFormats) {
            const match = dateStr.match(format);
            if (match) {
              if (format === dateFormats[0]) {
                date = dateStr; // Já está no formato correto
              } else {
                // Converter para YYYY-MM-DD
                const [, day, month, year] = match;
                date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
              break;
            }
          }
          
          if (!date) {
            date = new Date().toISOString().split('T')[0];
          }
        }

        return {
          id: `import-${Date.now()}-${index}`,
          date,
          description: description || `Transação ${index + 1}`,
          amount: Math.abs(amount),
          category,
        };
      });

      setPreview(transactions);
      setStep('preview');
    } catch (error) {
      toast.error('Erro ao processar o arquivo. Verifique o formato dos dados.');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    setIsProcessing(true);

    try {
      const dateIndex = headers.indexOf(mapping.dateColumn);
      const descriptionIndex = headers.indexOf(mapping.descriptionColumn);
      const amountIndex = headers.indexOf(mapping.amountColumn);
      const categoryIndex = mapping.categoryColumn ? headers.indexOf(mapping.categoryColumn) : -1;

      const allTransactions: Transaction[] = csvData.map((row, index) => {
        const dateStr = row[dateIndex];
        const description = row[descriptionIndex];
        const amountStr = row[amountIndex].replace(/[^\d,-]/g, '').replace(',', '.');
        const amount = parseFloat(amountStr) || 0;
        
        let category: TransactionCategory = mapping.defaultCategory;
        if (categoryIndex >= 0 && row[categoryIndex]) {
          const csvCategory = row[categoryIndex];
          const matchedCategory = CATEGORIES.find(cat => 
            cat.toLowerCase().includes(csvCategory.toLowerCase()) ||
            csvCategory.toLowerCase().includes(cat.toLowerCase())
          );
          if (matchedCategory) {
            category = matchedCategory;
          }
        }

        let date = '';
        if (dateStr) {
          const dateFormats = [
            /(\d{4})-(\d{2})-(\d{2})/,
            /(\d{2})\/(\d{2})\/(\d{4})/,
            /(\d{2})-(\d{2})-(\d{4})/,
          ];

          for (const format of dateFormats) {
            const match = dateStr.match(format);
            if (match) {
              if (format === dateFormats[0]) {
                date = dateStr;
              } else {
                const [, day, month, year] = match;
                date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
              break;
            }
          }
          
          if (!date) {
            date = new Date().toISOString().split('T')[0];
          }
        }

        return {
          id: `import-${Date.now()}-${index}`,
          date,
          description: description || `Transação ${index + 1}`,
          amount: Math.abs(amount),
          category,
        };
      });

      onImportTransactions(allTransactions);
      setStep('complete');
      toast.success(`${allTransactions.length} transações importadas com sucesso!`);
    } catch (error) {
      toast.error('Erro ao importar as transações');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      ['Data', 'Descrição', 'Valor', 'Categoria'],
      ['2024-01-15', 'Supermercado XYZ', '150.50', 'Gasto Mensal'],
      ['2024-01-16', 'Combustível', '80.00', 'Gasto Variável'],
      ['2024-01-17', 'Restaurante', '45.30', 'Gasto Benéfico e Pessoal'],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo-importacao.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setMapping({
      dateColumn: '',
      descriptionColumn: '',
      amountColumn: '',
      defaultCategory: 'Gasto Variável',
    });
    setPreview([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Importação de Dados
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Importe suas transações de arquivos CSV ou Excel
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {['upload', 'mapping', 'preview', 'complete'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepName || (index < ['upload', 'mapping', 'preview', 'complete'].indexOf(step))
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && <div className="w-full h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Upload</span>
            <span>Mapeamento</span>
            <span>Preview</span>
            <span>Concluído</span>
          </div>
        </CardContent>
      </Card>

      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload do Arquivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Aceito apenas arquivos CSV. O arquivo deve conter colunas para data, descrição e valor.
                Para melhor compatibilidade, baixe nosso modelo de exemplo.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button onClick={downloadTemplate} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Baixar Modelo CSV
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Clique para fazer upload</p>
                  <p className="text-sm text-gray-500">ou arraste o arquivo CSV aqui</p>
                </div>
              </Label>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Arquivo selecionado: {file.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>Mapear Colunas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Mapeie as colunas do seu arquivo CSV para os campos correspondentes no sistema.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Coluna de Data *</Label>
                <Select
                  value={mapping.dateColumn}
                  onValueChange={(value) => setMapping({ ...mapping, dateColumn: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna..." />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coluna de Descrição *</Label>
                <Select
                  value={mapping.descriptionColumn}
                  onValueChange={(value) => setMapping({ ...mapping, descriptionColumn: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna..." />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coluna de Valor *</Label>
                <Select
                  value={mapping.amountColumn}
                  onValueChange={(value) => setMapping({ ...mapping, amountColumn: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna..." />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coluna de Categoria (opcional)</Label>
                <Select
                  value={mapping.categoryColumn || ''}
                  onValueChange={(value) => setMapping({ ...mapping, categoryColumn: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Categoria Padrão</Label>
              <Select
                value={mapping.defaultCategory}
                onValueChange={(value: TransactionCategory) => 
                  setMapping({ ...mapping, defaultCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={generatePreview} disabled={isProcessing}>
                {isProcessing ? 'Processando...' : 'Gerar Preview'}
              </Button>
              <Button variant="outline" onClick={resetImport}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview das Transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Verifique se os dados estão corretos. Mostrando as primeiras 10 transações de {csvData.length} total.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {preview.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
                    </p>
                  </div>
                  <span className="font-bold text-red-600">
                    R$ {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={confirmImport} disabled={isProcessing}>
                {isProcessing ? 'Importando...' : `Importar ${csvData.length} Transações`}
              </Button>
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Importação Concluída!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Suas transações foram importadas com sucesso e já estão disponíveis no sistema.
            </p>
            <Button onClick={resetImport}>
              <Upload className="h-4 w-4 mr-2" />
              Importar Mais Dados
            </Button>
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="font-medium">Processando arquivo...</p>
                <Progress value={33} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataImporter;
