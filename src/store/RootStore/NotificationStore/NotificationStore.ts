import { apiBaseUrl, messaging } from '@/configs/firebaseConfig';
import { getToken } from 'firebase/messaging';
import { action, computed, makeObservable, observable } from 'mobx';
import { vapidKey } from '@/configs/firebaseConfig';
import axios from 'axios';

type PrivateFields = '_uid';

class NotificationStore {
  private _uid: string = '';

  constructor() {
    makeObservable<NotificationStore, PrivateFields>(this, {
      _uid: observable,
      uid: computed,
      requestNotificationToken: action.bound,
      generateToken: action.bound,
      setUid: action.bound,
    });
    this.loadFromLocalStorage();
  }

  get uid() {
    return this._uid;
  }

  setUid(uid: string) {
    this._uid = uid;
  }

  requestNotificationToken = async (): Promise<NotificationPermission> => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
      await this.loadFromLocalStorage();

      if (permissionStatus.state === 'granted') {
        await this.generateToken();
      } else {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await this.generateToken();
        } else {
          console.log('Notifications permission was denied.');
        }
        return permission;
      }
      return permissionStatus.state;
    } catch (error) {
      console.error('Error while requesting notification permission:', error);
      return 'denied';
    }
  };

  generateToken = async () => {
    try {
      if (this._uid) {
        const token = await getToken(messaging, {
          vapidKey,
        });
        localStorage.setItem('token', token);
        await this.saveToken();

        return token;
      } else {
        console.error('User ID is missing. Cannot generate token.');
      }
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  private async saveToken(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error();

      await axios.post(`${apiBaseUrl}/saveToken`, {
        token,
        userId: this._uid,
      });
      console.log('Token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private loadFromLocalStorage = async () => {
    const userData = localStorage.getItem('userItem');
    const savedData = userData && JSON.parse(userData);
    if (savedData) {
      this.setUid(savedData.uid);
    }
  };
}

export default NotificationStore;
