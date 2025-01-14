import ThemeToggle from '@/components/ThemeToggle';

const Settings = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-lg font-medium">Переключение темы</p>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Settings;
