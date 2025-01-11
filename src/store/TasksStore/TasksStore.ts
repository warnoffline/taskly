import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { ru } from 'chrono-node';
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/configs/firebaseConfig'; // импортируем конфигурацию Firestore
import { ILocalStore } from '@/utils';

type Task = {
  id: string;
  message: string;
  date: string;
  completed: boolean;
};

class TasksStore implements ILocalStore {
  tasks: Task[] = [];
  loading: boolean = false;
  error: string | null = null;
  private _uid: string = '';

  constructor() {
    makeObservable(this, {
      tasks: observable,
      loading: observable,
      error: observable,
      sortedTasks: computed,
      fetchTasks: action.bound,
      addTask: action.bound,
      updateTask: action.bound,
      removeTask: action.bound,
      toggleTaskCompletion: action.bound,
    });
    this.loadFromLocalStorage();
  }

  get userId(): string | null {
    const user = auth.currentUser;
    return user ? user.uid : null;
  }

  // Получение задач, отсортированных по дате
  get sortedTasks() {
    return [...this.tasks].sort((a, b) => {
      const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd HH:mm');
      const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd HH:mm');
      return dateA < dateB ? -1 : 1;
    });
  }

  // Загрузка задач с Firestore
  async fetchTasks(): Promise<void> {
    const userId = this._uid;
    if (!userId) {
      this.error = 'User is not authenticated';
      return;
    }

    this.loading = true;
    this.error = null;
    try {
      const userDocRef = doc(db, 'users', userId); // Документ пользователя
      const tasksRef = collection(userDocRef, 'tasks'); // Коллекция задач внутри документа пользователя
      const querySnapshot = await getDocs(tasksRef); // Получаем все задачи

      const fetchedTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const taskData = doc.data();
        fetchedTasks.push({
          id: doc.id,
          message: taskData.message,
          date: taskData.date,
          completed: taskData.completed,
        });
      });

      runInAction(() => {
        this.tasks = fetchedTasks.filter((task) => !this.isDatePassed(task.date));
      });
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => {
          this.error = `Failed to fetch tasks: ${err.message}`;
        });
      }
    } finally {
      this.loading = false;
    }
  }

  // Добавление задачи в Firestore
  async addTask(message: string): Promise<void> {
    const userId = this._uid;
    if (!userId) {
      this.error = 'User is not authenticated';
      return;
    }
    const parsedDates = ru.parse(message);
    console.log(userId);
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
        date: extractedDates[0],
        completed: false,
      };

      if (this.isDatePassed(newTask.date)) {
        throw new Error('Дата задачи уже прошла');
      }

      try {
        const userDocRef = doc(db, 'users', userId); // Документ пользователя
        const tasksRef = collection(userDocRef, 'tasks'); // Коллекция задач
        const taskRef = doc(tasksRef, newTask.id); // Документ задачи

        await setDoc(taskRef, newTask); // Добавляем задачу в Firestore
        runInAction(() => {
          this.tasks.push(newTask);
        });
      } catch (err) {
        if (err instanceof Error) {
          runInAction(() => {
            this.error = `Failed to add task: ${err.message}`;
          });
        }
      }
    } else {
      throw new Error('Неправильная дата');
    }
  }

  // Удаление задачи из Firestore
  async removeTask(id: string): Promise<void> {
    const userId = this._uid;
    if (!userId) {
      this.error = 'User is not authenticated';
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId); // Документ пользователя
      const tasksRef = collection(userDocRef, 'tasks'); // Коллекция задач
      const taskRef = doc(tasksRef, id); // Документ задачи

      await deleteDoc(taskRef); // Удаляем задачу
      runInAction(() => {
        this.tasks = this.tasks.filter((task) => task.id !== id);
      });
    } catch (err) {
      if (err instanceof Error) {
        runInAction(() => {
          this.error = `Failed to remove task: ${err.message}`;
        });
      }
    }
  }

  // Обновление задачи в Firestore
  async updateTask(id: string, message?: string, date?: string): Promise<void> {
    const userId = this._uid;
    if (!userId) {
      this.error = 'User is not authenticated';
      return;
    }

    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      if (message !== undefined) {
        task.message = message.trim();
      }
      if (date !== undefined) {
        if (this.isDatePassed(date)) {
          throw new Error('Дата задачи уже прошла');
        }
        task.date = date.trim();
      }

      try {
        const userDocRef = doc(db, 'users', userId); // Документ пользователя
        const tasksRef = collection(userDocRef, 'tasks'); // Коллекция задач
        const taskRef = doc(tasksRef, id); // Документ задачи

        await updateDoc(taskRef, {
          message: task.message,
          date: task.date,
          completed: task.completed,
        }); // Обновляем задачу в Firestore
      } catch (err) {
        if (err instanceof Error) {
          runInAction(() => {
            this.error = `Failed to update task: ${err.message}`;
          });
        }
      }
    }
  }

  // Переключение состояния выполнения задачи
  toggleTaskCompletion(id: string): void {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  // Проверка, прошла ли дата
  private isDatePassed(date: string): boolean {
    const taskDate = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm');
    return taskDate < DateTime.local();
  }

  private loadFromLocalStorage(): void {
    const userData = localStorage.getItem('userItem');
    const savedData = userData && JSON.parse(userData);
    if (savedData) {
      this._uid = savedData.uid;
    }
  }

  destroy(): void {}
}

export default TasksStore;
