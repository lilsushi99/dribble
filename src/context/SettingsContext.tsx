import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from '../admin/services/adminApi';

export interface SettingsState {
  site_name: string;
  company_name: string;
  email: string;
  phone: string;
  address: string;
  copyright_text: string;
  footer_info: string;
  designer_credit: string;
  designer_url: string;
  white_logo: string;
  black_logo: string;
  favicon: string;
  social_twitter: string;
  social_instagram: string;
  social_linkedin: string;
  social_github: string;
  theme_primary: string;
  theme_button: string;
  theme_accent: string;
  theme_heading: string;
  theme_body: string;
  theme_bg: string;
  [key: string]: string;
}

const defaultSettings: SettingsState = {
  site_name: 'KINETIC',
  company_name: 'KINETIC Studio Ltd.',
  email: 'hello@kinetic-studio.com',
  phone: '+1 (800) 555-0199',
  address: '100 Architectural Way, Studio District, CA 90210',
  copyright_text: '© 2026 KINETIC Studio Ltd. All rights reserved.',
  footer_info: 'An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design.',
  designer_credit: 'KINETIC Atelier',
  designer_url: 'https://kinetic-studio.com',
  white_logo: '/uploads/logos/kinetic-white.svg',
  black_logo: '/uploads/logos/kinetic-black.svg',
  favicon: '/favicon.ico',
  social_twitter: 'https://twitter.com',
  social_instagram: 'https://instagram.com',
  social_linkedin: 'https://linkedin.com',
  social_github: 'https://github.com',
  theme_primary: '#0097FF',
  theme_button: '#0097FF',
  theme_accent: '#E6A800',
  theme_heading: '#FFFFFF',
  theme_body: '#9A9A9E',
  theme_bg: '#050505',
};

interface SettingsContextType {
  settings: SettingsState;
  loading: boolean;
  replaceVars: (text: string) => string;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SettingsState>, category?: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const applyCssVariables = (st: SettingsState) => {
    const root = document.documentElement;
    if (st.theme_primary) root.style.setProperty('--primary-color', st.theme_primary);
    if (st.theme_button) root.style.setProperty('--button-color', st.theme_button);
    if (st.theme_accent) root.style.setProperty('--accent-color', st.theme_accent);
    if (st.theme_heading) root.style.setProperty('--heading-color', st.theme_heading);
    if (st.theme_body) root.style.setProperty('--body-color', st.theme_body);
    if (st.theme_bg) root.style.setProperty('--background-color', st.theme_bg);
  };

  const loadSettings = async () => {
    try {
      const data = await adminApi.getGlobalSettings();
      if (data && Object.keys(data).length > 0) {
        const merged = { ...defaultSettings, ...data };
        setSettings(merged);
        applyCssVariables(merged);
      } else {
        applyCssVariables(defaultSettings);
      }
    } catch (e) {
      console.warn('Using default settings context:', e);
      applyCssVariables(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const replaceVars = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\{\{site_name\}\}/g, settings.site_name)
      .replace(/\{\{company_name\}\}/g, settings.company_name)
      .replace(/\{\{email\}\}/g, settings.email)
      .replace(/\{\{phone\}\}/g, settings.phone)
      .replace(/\{\{address\}\}/g, settings.address)
      .replace(/\{\{designer_credit\}\}/g, settings.designer_credit);
  };

  const updateSettings = async (newSettings: Partial<SettingsState>, category = 'general') => {
    const stringifiedMap: Record<string, string> = {};
    Object.entries(newSettings).forEach(([k, v]) => {
      stringifiedMap[k] = String(v);
    });

    await adminApi.updateGlobalSettings(stringifiedMap, category);
    const updated = { ...settings, ...stringifiedMap };
    setSettings(updated);
    applyCssVariables(updated);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        replaceVars,
        refreshSettings: loadSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
