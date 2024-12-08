import { ILocalStore } from '@/utils';
import { action, computed, makeObservable, observable } from 'mobx';
import { Task } from '@/types/task';
import { ru } from 'chrono-node';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

type PrivateFields = '_tasks';

class TasksStore implements ILocalStore {
  private _tasks: Task[] = [];

  constructor() {
    makeObservable<TasksStore, PrivateFields>(this, {
      _tasks: observable,
      tasks: computed,
      addTask: action.bound,
      removeTask: action.bound,
      updateTask: action.bound,
    });

    this.loadTasksFromLocalStorage();
  }

  get tasks() {
    return this._tasks;
  }

  addTask(message: string): void {
    const parsedDates = ru.parse(message);
    console.log(parsedDates);
    let cleanedMessage = message;
    const extractedDates: string[] = [];

    parsedDates.forEach((parsedDate) => {
      const dateString = parsedDate.text;
      const formattedDate = DateTime.fromJSDate(parsedDate.start.date()).toFormat('yyyy-MM-dd HH:mm');
      extractedDates.push(formattedDate);

      cleanedMessage = cleanedMessage.replace(dateString, '').replace(/\s+/g, ' ').trim();
    });

    const newTask: Task = {
      id: uuidv4(),
      message: cleanedMessage,
      date: extractedDates.length > 0 ? extractedDates[0] : '',
    };

    this._tasks.push(newTask);
    this.saveTasksToLocalStorage();
  }

  removeTask(id: string): void {
    this._tasks = this._tasks.filter((task) => task.id !== id);
    this.saveTasksToLocalStorage();
  }

  updateTask(id: string, message?: string, date?: string): void {
    const task = this._tasks.find((task) => task.id === id);
    if (task) {
      if (message !== undefined) {
        task.message = message.trim();
      }
      if (date !== undefined) {
        task.date = date.trim();
      }
    }
    this.saveTasksToLocalStorage();
  }

  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this._tasks));
  }

  private loadTasksFromLocalStorage(): void {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this._tasks = JSON.parse(savedTasks);
    }
  }

  destroy(): void {}
}

export default TasksStore;
