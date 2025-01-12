import { useEffect } from 'react';
import RouterComponent from './router';
import { RootStoreProvider, useNotificationStore } from '@/store/RootStore';
import { useUserStore } from '@/store/RootStore';
import { ThemeProvider } from './providers/ThemeContext';

function App() {
  const { uid } = useUserStore();
  const { generateToken } = useNotificationStore();

  useEffect(() => {
    if (uid) {
      generateToken();
    }
  }, [generateToken, uid]);

  return (
    <RootStoreProvider>
      <ThemeProvider>
        <RouterComponent />
      </ThemeProvider>
    </RootStoreProvider>
  );
}

export default App;
