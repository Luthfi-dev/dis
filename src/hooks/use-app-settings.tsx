
'use client';
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { AppSettings } from '@/lib/actions';
import { getAppSettings, saveAppSettings } from '@/lib/actions';

interface AppSettingsContextType {
  settings: AppSettings | null;
  loading: boolean;
  setSettings: (newSettings: AppSettings) => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'eduarchive_app_settings';

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          setSettingsState(JSON.parse(storedSettings));
        }
        
        const freshSettings = await getAppSettings();
        setSettingsState(freshSettings);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(freshSettings));
      } catch (error) {
        console.error("Failed to load app settings", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSetSettings = async (newSettings: AppSettings) => {
    setLoading(true);
    const result = await saveAppSettings(newSettings);
    if (result.success) {
      setSettingsState(newSettings);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    }
    setLoading(false);
  };

  const value = { settings, loading, setSettings: handleSetSettings };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}
