import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { withProvider } from '@/hoc/withProvider';
import { TasksStoreProvider } from './useTasksStore';
import { DataType } from '@/types/task';
import TasksList from './components/TasksList/TasksList';
import { useToast } from '@/hooks/use-toast';
import { useTasksStore } from './useTasksStore';
import { useEffect } from 'react';

const Chat = observer(() => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      message: '',
    },
  });
  const { addTask, fetchTasks } = useTasksStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    console.log('some');
  }, [fetchTasks]);

  const onSubmit = async (data: DataType) => {
    try {
      if (!data.message.trim()) {
        throw new Error('Сообщение не может быть пустым.');
      }
      await addTask(data.message);
      console.log(data.message);
      reset();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        variant: 'destructive',
      });
    }
  };

  const message = watch('message');
  return (
    <div>
      <TasksList />
      <form
        className="fixed bottom-0 w-full bg-gray-100 px-4 py-2 flex items-center gap-2 border-t border-gray-300"
        onSubmit={handleSubmit(onSubmit)}
      >
        <textarea
          className="flex-1 border-none resize-none outline-none bg-gray-200 rounded-lg px-3 py-3 text-sm"
          rows={1}
          style={{
            maxHeight: '150px',
            overflowY: 'auto',
          }}
          placeholder="Введите сообщение"
          {...register('message', { required: true })}
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-3 rounded-lg ${
            message.trim() ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}
        >
          Отправить
        </button>
      </form>
    </div>
  );
});

const ChatWithProvider = withProvider(TasksStoreProvider, Chat);

export default ChatWithProvider;
