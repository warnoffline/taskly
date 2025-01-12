import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-chatLight-bg dark:bg-chatDark-bg">
      <Toaster />
      <Header />
      <Outlet />
    </div>
  );
};

export default RootLayout;
