import React, { createContext, useContext } from 'react';
import { useLocalStore } from '@/utils';
import TasksStore from '@/store/TasksStore';

type TasksStoreProps = {
  children: React.ReactNode;
};

export const TasksStoreContext = createContext<TasksStore | undefined>(undefined);

export const TasksStoreProvider: React.FC<TasksStoreProps> = ({ children }) => {
  const store = useLocalStore(() => new TasksStore());
  return <TasksStoreContext.Provider value={store}>{children}</TasksStoreContext.Provider>;
};

export const useTasksStore = () => {
  const store = useContext(TasksStoreContext);
  if (!store) {
    throw Error('error');
  }
  return store;
};
