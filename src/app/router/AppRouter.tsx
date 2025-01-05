import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import { ROUTES } from '@/configs/routeConfig';
import { useUserStore } from '@/store/RootStore';

import { Suspense } from 'react';
import { AuthLazy, ChatLazy, ProfileLazy, SettingsLazy } from '../pages';
import ProtectedRoute from './ProtectedRoute';

const RouterComponent = () => {
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
          path: ROUTES.chat,
          element: <ChatLazy />,
        },
        {
          path: ROUTES.settings,
          element: <SettingsLazy />,
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
          ],
        },
      ],
    },
  ]);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default RouterComponent;
