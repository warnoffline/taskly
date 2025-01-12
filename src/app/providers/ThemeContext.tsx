// ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

// Тип для контекста
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

// Создаём сам контекст
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Провайдер для темы
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Хук для использования темы в любом компоненте
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
