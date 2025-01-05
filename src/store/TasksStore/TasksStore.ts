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
    return [...this._tasks].sort((a, b) => {
      const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd HH:mm');
      const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd HH:mm');
      return dateA < dateB ? -1 : 1;
    });
  }

  addTask(message: string): void {
    const parsedDates = ru.parse(message);

    if (parsedDates.length > 0) {
      let cleanedMessage = message;
      const extractedDates: string[] = [];

      parsedDates.forEach((parsedDate) => {
        const dateString = parsedDate.text;
        const formattedDate = DateTime.fromJSDate(parsedDate.start.date()).toFormat('yyyy-MM-dd HH:mm');
        extractedDates.push(formattedDate);

        cleanedMessage = cleanedMessage.replace(dateString, '').replace(/\s+/g, ' ').trim();
      });

      if (!cleanedMessage) {
        throw new Error('Что нужно сделать в это время?');
      }
      const newTask: Task = {
        id: uuidv4(),
        message: cleanedMessage,
        date: extractedDates.length > 0 ? extractedDates[0] : '',
      };

      if (this.checkIfDatePassed(newTask.date)) {
        throw new Error('Дата задачи уже прошла');
      }

      this._tasks.push(newTask);
      this.saveTasksToLocalStorage();
    } else {
      throw new Error('Неправильная дата');
    }
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
        if (this.checkIfDatePassed(date)) {
          throw new Error('Дата задачи уже прошла');
        }
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
      this._tasks = JSON.parse(savedTasks).filter((task: Task) => {
        return !this.checkIfDatePassed(task.date);
      });
    }
  }

  private checkIfDatePassed(date: string): boolean {
    const taskDate = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm');
    return taskDate < DateTime.local();
  }

  destroy(): void {}
}

export default TasksStore;
