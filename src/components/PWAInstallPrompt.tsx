
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Smartphone, X, Share } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWAInstallPromptProps {
  onClose?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onClose }) => {
  const { platform, canInstall, isInstalled, installPWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Show prompt after 3 seconds if can install and not installed
    const timer = setTimeout(() => {
      if (canInstall && !isInstalled) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIOSInstructions(true);
      return;
    }

    const success = await installPWA();
    if (success) {
      setIsVisible(false);
      onClose?.();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setShowIOSInstructions(false);
    onClose?.();
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    Instalar no iOS
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Siga os passos abaixo
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300">1</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Toque no botão <Share className="w-4 h-4 inline mx-1" /> de compartilhar no Safari
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Role para baixo e toque em "Adicionar à Tela de Início"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Confirme tocando em "Adicionar"
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Entendi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-white dark:bg-slate-800 shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Instalar App</h3>
                  <p className="text-xs text-blue-100">
                    Acesso rápido e offline
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Instale o Gastos Financeiro para ter acesso rápido e usar offline.
            </p>
            
            <div className="flex gap-2">
              <Button onClick={handleInstall} className="flex-1" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {platform === 'ios' ? 'Como Instalar' : 'Instalar'}
              </Button>
              <Button variant="outline" onClick={handleClose} size="sm">
                Depois
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
