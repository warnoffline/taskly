import React, { createContext, useContext } from 'react';
import RootStore from '../RootStore';
import { useLocalStore } from '@/utils/useLocalStore';

type RootStoreProps = {
  children: React.ReactNode;
};

export const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider: React.FC<RootStoreProps> = ({ children }) => {
  const store = useLocalStore(() => new RootStore());

  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
};

export const useRootStore = () => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw Error('error');
  }
  return store;
};
