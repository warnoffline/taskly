import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../useTasksStore';
import TaskCard from '../TaskCard/TaskCard';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const TasksList = observer(() => {
  const { tasks, removeExpiredTasks, hasExpiredTasks, loading } = useTasksStore();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {hasExpiredTasks && (
        <div className="self-end px-2 pt-2">
          <Button
            onClick={removeExpiredTasks}
            className="bg-chatLight-bg dark:bg-chatDark-bg shadow-none text-black dark:text-white"
          >
            Очистить
          </Button>
        </div>
      )}
      {loading ? (
        <div className="w-full flex justify-center py-80">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="w-center flex flex-col gap-2 pt-2 pb-44 max-h-screen overflow-auto no-scrollbar">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
});

export default TasksList;
