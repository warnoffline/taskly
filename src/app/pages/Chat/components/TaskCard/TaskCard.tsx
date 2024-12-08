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
import { LucideChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useTasksStore } from '../../useTasksStore';
import { ru } from 'chrono-node';

type TaskProps = {
  task: Task;
};

const TaskCard: React.FC<TaskProps> = observer(({ task }) => {
  const dateTime = DateTime.fromFormat(task.date, 'yyyy-MM-dd HH:mm').setLocale('ru');
  const formattedDate = dateTime.toFormat('dd MMMM HH:mm');
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(task.message);
  const [editedDateInput, setEditedDateInput] = useState(formattedDate);

  const { updateTask } = useTasksStore();

  const handleSave = () => {
    const parsed = ru.parse(editedDateInput);
    const backendFormatDate =
      parsed.length > 0 ? DateTime.fromJSDate(parsed[0].start.date()).toFormat('yyyy-MM-dd HH:mm') : task.date;

    const displayFormatDate =
      parsed.length > 0
        ? DateTime.fromJSDate(parsed[0].start.date()).setLocale('ru').toFormat('dd MMMM HH:mm')
        : formattedDate;

    setEditedDateInput(displayFormatDate);
    updateTask(task.id, editedMessage, backendFormatDate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMessage(task.message);
    setEditedDateInput(formattedDate);
    setIsEditing(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer flex w-full items-center justify-between active:bg-blue-100 hover:bg-blue-100">
          <div className="relative w-full flex gap-3">
            <div className="w-1 bg-blue-500"></div>
            <div className="flex flex-col">
              <div className="text-sm text-blue-500">{formattedDate}</div>
              <div className="text-lg text-gray-800">
                <div className="w-full max-w-xs truncate overflow-hidden whitespace-nowrap">{task.message}</div>
              </div>
            </div>
          </div>
          <LucideChevronRight />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex max-w-sm">
          {isEditing ? (
            <>
              <p className="flex text-gray-400">Задача</p>
              <input
                type="text"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <p className="flex text-gray-400">Дата</p>
              <input
                type="text"
                value={editedDateInput}
                onChange={(e) => setEditedDateInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
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
                className="w-full bg-blue-500 border-blue-500 active:bg-blue-800 hover:bg-blue-700"
                type="button"
                onClick={handleSave}
              >
                Сохранить
              </Button>
              <Button className="w-full border-blue-500" type="button" variant="outline" onClick={handleCancel}>
                Отменить
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-full bg-blue-500 border-blue-500 active:bg-blue-800 hover:bg-blue-700"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Изменить
              </Button>
              <DialogClose asChild>
                <Button className="w-full border-blue-500" type="button" variant="outline">
                  Закрыть
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
