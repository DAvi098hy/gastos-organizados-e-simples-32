
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  canInstall: boolean;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    platform: 'unknown',
    canInstall: false,
  });

  const detectPlatform = (): PWAState['platform'] => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else {
      return 'desktop';
    }
  };

  const isStandalone = (): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  };

  const isIOSInstallable = (): boolean => {
    const platform = detectPlatform();
    return platform === 'ios' && !isStandalone() && 'serviceWorker' in navigator;
  };

  useEffect(() => {
    const platform = detectPlatform();
    const standalone = isStandalone();
    
    setPwaState(prev => ({
      ...prev,
      platform,
      isStandalone: standalone,
      isInstalled: standalone,
    }));

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        canInstall: true,
      }));
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        canInstall: false,
      }));
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if iOS can install
    if (isIOSInstallable()) {
      setPwaState(prev => ({
        ...prev,
        canInstall: true,
        isInstallable: true,
      }));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setPwaState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          canInstall: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful:', registration);
        return registration;
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
        return null;
      }
    }
    return null;
  };

  return {
    ...pwaState,
    installPWA,
    registerServiceWorker,
    deferredPrompt,
  };
};
