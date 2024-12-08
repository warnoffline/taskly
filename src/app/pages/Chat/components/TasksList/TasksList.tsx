import { observer } from 'mobx-react-lite';
import { useTasksStore } from '../../useTasksStore';
import TaskCard from '../TaskCard/TaskCard';

const TasksList = observer(() => {
  const { tasks } = useTasksStore();

  return (
    <div className="w-full flex justify-center">
      <div className="w-center flex flex-col gap-5 pb-20">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
});

export default TasksList;
