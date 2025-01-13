import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../useTasksStore';
import TaskCard from '../TaskCard/TaskCard';
import { Button } from '@/components/ui/button';

const TasksList = observer(() => {
  const { tasks, removeExpiredTasks, hasExpiredTasks } = useTasksStore();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {hasExpiredTasks && (
        <div className="self-end px-2 py-2">
          <Button
            onClick={removeExpiredTasks}
            className="bg-chatLight-bg dark:bg-chatDark-bg shadow-none dark:text-white"
          >
            Очистить
          </Button>
        </div>
      )}
      <div className="w-center flex flex-col gap-5 pt-4 pb-20">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
});

export default TasksList;
