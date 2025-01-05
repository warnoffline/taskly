import rootStore from '../instance';

export const useUserStore = () => {
  return rootStore.user;
};
