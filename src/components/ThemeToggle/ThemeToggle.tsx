import { useTheme } from '@/app/providers/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">
      {isDark ? 'Светлая тема' : 'Тёмная тема'}
    </button>
  );
};

export default ThemeToggle;
