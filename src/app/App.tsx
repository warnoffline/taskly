import RouterComponent from './router';
import { RootStoreProvider } from '@/store/RootStore';

function App() {
  return (
    <RootStoreProvider>
      <RouterComponent />
    </RootStoreProvider>
  );
}

export default App;
