import ThemeToggle from '@/components/ThemeToggle';

const Settings = () => {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <p>Переключение темы</p>
      <ThemeToggle />
    </div>
  );
};

export default Settings;
