import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light1' | 'light2' | 'dark1' | 'dark2';

interface ThemeColors {
  background: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  inputBg: string;
  inputBorder: string;
  disabled: string;
  disabledText: string;
}

const themeColors: Record<ThemeMode, ThemeColors> = {
  light1: {
    background: 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100',
    cardBg: 'bg-white',
    text: 'text-neutral-900',
    textSecondary: 'text-neutral-600',
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600',
    primaryHover: 'hover:from-blue-600 hover:to-purple-700',
    secondary: 'bg-neutral-100',
    secondaryHover: 'hover:bg-neutral-200',
    inputBg: 'bg-neutral-50',
    inputBorder: 'border-neutral-200',
    disabled: 'bg-neutral-200',
    disabledText: 'text-neutral-400'
  },
  light2: {
    background: 'bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100',
    cardBg: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    primaryHover: 'hover:from-emerald-600 hover:to-teal-700',
    secondary: 'bg-slate-100',
    secondaryHover: 'hover:bg-slate-200',
    inputBg: 'bg-slate-50',
    inputBorder: 'border-slate-200',
    disabled: 'bg-slate-200',
    disabledText: 'text-slate-400'
  },
  dark1: {
    background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    cardBg: 'bg-slate-800',
    text: 'text-white',
    textSecondary: 'text-slate-300',
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
    primaryHover: 'hover:from-purple-700 hover:to-pink-700',
    secondary: 'bg-slate-700',
    secondaryHover: 'hover:bg-slate-600',
    inputBg: 'bg-slate-700',
    inputBorder: 'border-slate-600',
    disabled: 'bg-slate-700',
    disabledText: 'text-slate-500'
  },
  dark2: {
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    cardBg: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    primaryHover: 'hover:from-blue-700 hover:to-indigo-700',
    secondary: 'bg-gray-700',
    secondaryHover: 'hover:bg-gray-600',
    inputBg: 'bg-gray-700',
    inputBorder: 'border-gray-600',
    disabled: 'bg-gray-700',
    disabledText: 'text-gray-500'
  }
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ablovi-theme');
    return (saved as ThemeMode) || 'light1';
  });

  useEffect(() => {
    localStorage.setItem('ablovi-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}
