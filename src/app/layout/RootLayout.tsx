import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

const RootLayout = () => {
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const themeColor = currentTheme === 'dark' ? '#242527' : '#FFFFFF';

    metaThemeColor.setAttribute('content', themeColor);
  }, []);

  return (
    <div className="min-h-screen bg-chatLight-bg dark:bg-chatDark-bg">
      <Toaster />
      <Header />
      <Outlet />
    </div>
  );
};

export default RootLayout;
