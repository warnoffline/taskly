import { observer } from 'mobx-react-lite';
import { Task } from '@/types/task';
import { DateTime } from 'luxon';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useTasksStore } from '../../useTasksStore';
import { ru } from 'chrono-node';
import { useForm, Controller } from 'react-hook-form';
import { checkIfDatePassed } from '@/utils/checkIfDatePassed';

type TaskProps = {
  task: Task;
};

const TaskCard: React.FC<TaskProps> = observer(({ task }) => {
  const dateTime = DateTime.fromFormat(task.date, 'yyyy-MM-dd HH:mm').setLocale('ru');
  const formattedDate = dateTime.toFormat('dd MMMM HH:mm');
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { updateTask, removeTask, isDatePassed } = useTasksStore();
  const isPassed = isDatePassed(task.date);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      message: task.message,
      date: formattedDate,
    },
  });

  const handleSave = (data: { message: string; date: string }) => {
    const parsed = ru.parse(data.date);
    const backendFormatDate =
      parsed.length > 0 ? DateTime.fromJSDate(parsed[0].start.date()).toFormat('yyyy-MM-dd HH:mm') : task.date;
    if (!checkIfDatePassed(backendFormatDate)) {
      const displayFormatDate =
        parsed.length > 0
          ? DateTime.fromJSDate(parsed[0].start.date()).setLocale('ru').toFormat('dd MMMM HH:mm')
          : formattedDate;

      setValue('date', displayFormatDate);
      updateTask(task.id, data.message, backendFormatDate);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await removeTask(task.id);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const themeColor = isOpen
      ? currentTheme === 'dark'
        ? '#070707' // Цвет для открытого диалога в тёмной теме
        : '#333333' // Цвет для открытого диалога в светлой теме
      : currentTheme === 'dark'
      ? '#242527' // Цвет для закрытого диалога в тёмной теме
      : '#FFFFFF'; // Цвет для закрытого диалога в светлой теме

    metaThemeColor.setAttribute('content', themeColor);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`cursor-pointer flex w-full items-center rounded-md justify-between`}>
          <div className="relative w-full flex gap-3 px-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`border-blue-500 border-2 w-4 h-4 rounded-full ${isPassed && 'bg-blue-500'}`}>
                <div className="w-3 h-3 rounded-full border-chatLight-bg dark:border-chatDark-bg border-2"></div>
              </div>
              <div className="bg-blue-500 w-0.5 h-full"></div>
            </div>
            <div
              className={`w-full flex flex-col active:bg-blue-100 dark:active:bg-blue-950 dark:hover:bg-blue-950 hover:bg-blue-100 ${
                isPassed ? 'bg-blue-500/40 dark:bg-blue-500/50' : 'bg-chatLight-card dark:bg-chatDark-card'
              }
              py-2 px-4 rounded-xl
              `}
            >
              <div
                className={`text-lg font-semibold ${
                  isPassed ? 'text-blue-800 dark:text-blue-200' : 'text-blue-500 dark:text-chatDark-secondaryText'
                }`}
              >
                {formattedDate}
              </div>
              <div className="text-lg text-chatLight-text dark:text-chatDark-text">
                <div className="w-full max-w-xs truncate overflow-hidden whitespace-nowrap font-semibold text-base">
                  {task.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="flex max-w-sm">
          {isEditing ? (
            <>
              <p className="flex text-gray-400">Задача</p>
              <Controller
                name="message"
                control={control}
                rules={{ required: 'Это поле обязательно' }}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full p-2 border bg-chatLight-input dark:bg-chatDark-input rounded mb-2"
                  />
                )}
              />
              {errors.message && <span className="flex text-red-400 text-sm">{errors.message.message}</span>}

              <p className="flex text-gray-400">Дата</p>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: 'Это поле обязательно',
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full p-2 border bg-chatLight-input dark:bg-chatDark-input rounded"
                  />
                )}
              />
              {errors.date && <span className="flex text-red-400 text-sm">{errors.date.message}</span>}
            </>
          ) : (
            <>
              <DialogTitle className="font-bold text-lg text-start max-w-xs break-words">{task.message}</DialogTitle>
              <DialogDescription className="text-start">{formattedDate}</DialogDescription>
            </>
          )}
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between gap-2">
          {isEditing ? (
            <>
              <Button
                className="w-full bg-blue-500 border-blue-500 dark:border-blue-800 active:bg-blue-800 hover:bg-blue-700"
                type="button"
                onClick={handleSubmit(handleSave)}
              >
                Сохранить
              </Button>
              <Button
                className="w-full border-blue-500 text-blue-500"
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Отменить
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-full bg-blue-500 border-blue-500 dark:border-blue-800 active:bg-blue-800 hover:bg-blue-700"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Изменить
              </Button>
              <DialogClose asChild>
                <Button
                  className="w-full border-red-500 text-red-500"
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default TaskCard;
