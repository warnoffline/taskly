import { messaging } from '@/configs/firebaseConfig';
import axios from 'axios';
import { getToken } from 'firebase/messaging';
import { action, computed, makeObservable, observable } from 'mobx';
import { vapidKey, apiBaseUrl } from '@/configs/firebaseConfig';

type PrivateFields = '_uid';

class NotificationStore {
  private _uid: string = '';

  constructor() {
    makeObservable<NotificationStore, PrivateFields>(this, {
      _uid: observable,
      uid: computed,
      requestNotificationToken: action.bound,
    });
    this.loadFromLocalStorage();
  }

  get uid() {
    return this._uid;
  }

  requestNotificationToken = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'notifications' });

      if (permissionStatus.state === 'granted') {
        await this.generateToken();
      } else if (permissionStatus.state === 'prompt') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await this.generateToken();
        } else {
          console.log('Notifications permission was denied.');
        }
      } else {
        console.log('Notifications permission denied. Ask user to enable it in browser settings.');
      }
    } catch (error) {
      console.error('Error while requesting notification permission:', error);
    }
  };

  private generateToken = async () => {
    try {
      if (this._uid) {
        const token = await getToken(messaging, {
          vapidKey,
        });
        localStorage.setItem('token', token);

        try {
          await axios.post(`${apiBaseUrl}/saveToken`, {
            token,
            userId: this._uid,
          });
          console.log('Token saved successfully');
        } catch (error) {
          console.error('Error saving token:', error);
        }

        return token;
      } else {
        console.error('User ID is missing. Cannot generate token.');
      }
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  private loadFromLocalStorage(): void {
    const userData = localStorage.getItem('userItem');
    const savedData = userData && JSON.parse(userData);
    if (savedData) {
      this._uid = savedData.uid;
    }
  }
}

export default NotificationStore;
