import { useEffect } from 'react';
import RouterComponent from './router';
import { RootStoreProvider } from '@/store/RootStore';
import { generateToken } from '@/notification/notification';
import { useUserStore } from '@/store/RootStore';

function App() {
  const { uid } = useUserStore();
  useEffect(() => {
    generateToken();
  }, [uid]);
  return (
    <RootStoreProvider>
      <RouterComponent />
    </RootStoreProvider>
  );
}

export default App;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function (error) {
      console.log('Service Worker registration failed:', error);
    });
}
