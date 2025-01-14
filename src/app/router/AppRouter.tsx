import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import { ROUTES } from '@/configs/routeConfig';
import { Suspense } from 'react';
import { AuthLazy, ChatLazy, ProfileLazy, SettingsLazy } from '../pages';
import ProtectedRoute from './ProtectedRoute';
import { useUserStore } from '@/store/RootStore';
import { observer } from 'mobx-react-lite';
import { Loader } from 'lucide-react';

const RouterComponent = observer(() => {
  const { isAuthenticated } = useUserStore();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={ROUTES.chat} replace />,
        },
        {
          path: ROUTES.auth,
          element: <AuthLazy />,
        },
        {
          element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
          children: [
            {
              path: ROUTES.profile,
              element: <ProfileLazy />,
            },
            {
              path: ROUTES.chat,
              element: <ChatLazy />,
            },
            {
              path: ROUTES.settings,
              element: <SettingsLazy />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
});

export default RouterComponent;
