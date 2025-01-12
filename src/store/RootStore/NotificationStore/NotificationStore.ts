import { messaging } from '@/configs/firebaseConfig';
import axios from 'axios';
import { getToken } from 'firebase/messaging';
import { action, computed, makeObservable, observable } from 'mobx';

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type PrivateFields = '_uid';

class NotificationStore {
  private _uid: string = '';

  constructor() {
    makeObservable<NotificationStore, PrivateFields>(this, {
      _uid: observable,
      uid: computed,
      generateToken: action.bound,
    });
    this.loadFromLocalStorage();
  }

  get uid() {
    return this._uid;
  }

  async generateToken() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted' && this._uid) {
      const token = await getToken(messaging, {
        vapidKey,
      });
      localStorage.setItem('token', token);
      axios
        .post(`${apiBaseUrl}/saveToken`, {
          token,
          userId: this._uid,
        })
        .then(() => {
          console.log('Token saved successfully');
        })
        .catch((error) => {
          console.error('Error saving token:', error);
        });
      return token;
    }
  }

  private loadFromLocalStorage(): void {
    const userData = localStorage.getItem('userItem');
    const savedData = userData && JSON.parse(userData);
    if (savedData) {
      this._uid = savedData.uid;
    }
  }
}

export default NotificationStore;
