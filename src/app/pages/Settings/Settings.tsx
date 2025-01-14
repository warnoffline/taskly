import ThemeToggle from '@/components/ThemeToggle';
import { useNotificationStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';

const Settings = observer(() => {
  const { notificationsEnabled, enableNotifications } = useNotificationStore();

  const handleNotifications = async () => {
    await enableNotifications();
  };
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-lg font-medium">Переключение темы</p>
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-lg font-medium">Уведомления</p>
        <button
          onClick={handleNotifications}
          className={`px-4 py-2 rounded-md ${
            notificationsEnabled
              ? 'bg-blue-500/20 dark:bg-blue-500/10 text-gray-400'
              : 'bg-blue-500 dark:bg-blue-500/70 text-white'
          }`}
          disabled={notificationsEnabled}
        >
          Разрешить
        </button>
      </div>
    </div>
  );
});

export default Settings;
