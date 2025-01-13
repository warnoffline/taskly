import { useTheme } from '@/app/providers/ThemeContext';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    const currentTheme = isDark ? 'dark' : 'light';

    const themeColor = currentTheme === 'dark' ? '#242527' : '#FFFFFF';

    metaThemeColor.setAttribute('content', themeColor);
  }, [isDark]);

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">
      {isDark ? 'Светлая тема' : 'Тёмная тема'}
    </button>
  );
};

export default ThemeToggle;
