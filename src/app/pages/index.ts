import React from 'react';

export const SettingsLazy = React.lazy(() => import('./Settings/Settings'));
export const ProfileLazy = React.lazy(() => import('./Profile/Profile'));
export const ChatLazy = React.lazy(() => import('./Chat/Chat'));
export const AuthLazy = React.lazy(() => import('./Auth/Auth'));
