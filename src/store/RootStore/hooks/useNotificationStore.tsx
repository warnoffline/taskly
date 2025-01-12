import rootStore from '../instance';

export const useNotificationStore = () => {
  return rootStore.notification;
};
