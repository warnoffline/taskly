import { useEffect } from 'react';
import RouterComponent from './router';
import { RootStoreProvider, useNotificationStore } from '@/store/RootStore';
import { useUserStore } from '@/store/RootStore';
import { ThemeProvider } from './providers/ThemeContext';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  const { isAuthenticated } = useUserStore();
  const { generateToken } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      generateToken();
    }
  }, [generateToken, isAuthenticated]);

  return (
    <RootStoreProvider>
      <ThemeProvider>
        <RouterComponent />
      </ThemeProvider>
    </RootStoreProvider>
  );
});

export default App;
