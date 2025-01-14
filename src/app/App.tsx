import { useEffect } from 'react';
import RouterComponent from './router';
import { RootStoreProvider, useNotificationStore, useUserStore } from '@/store/RootStore';
import { ThemeProvider } from './providers/ThemeContext';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  const { requestNotificationToken } = useNotificationStore();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    requestNotificationToken();
  }, [requestNotificationToken, isAuthenticated]);

  return (
    <RootStoreProvider>
      <ThemeProvider>
        <RouterComponent />
      </ThemeProvider>
    </RootStoreProvider>
  );
});

export default App;
