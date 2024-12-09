import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = () => {
  return (
    <>
      <Toaster />
      <Header />
      <Outlet />
    </>
  );
};

export default RootLayout;
