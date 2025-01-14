import { messaging } from '@/configs/firebaseConfig';
import axios from 'axios';
import { getToken } from 'firebase/messaging';
import { action, computed, makeObservable, observable } from 'mobx';
import { vapidKey, apiBaseUrl } from '@/configs/firebaseConfig';

type PrivateFields = '_uid' | '_notificationsEnabled';

class NotificationStore {
  private _uid: string = '';
  private _notificationsEnabled: boolean = false;

  constructor() {
    makeObservable<NotificationStore, PrivateFields>(this, {
      _uid: observable,
      _notificationsEnabled: observable,
      uid: computed,
      notificationsEnabled: computed,
      requestNotificationToken: action.bound,
      enableNotifications: action.bound,
      generateToken: action.bound,
      setUid: action.bound,
      setNotificationsEnabled: action.bound,
    });
    this.loadFromLocalStorage();
  }

  get uid() {
    return this._uid;
  }

  get notificationsEnabled() {
    return this._notificationsEnabled;
  }

  // Setter for UID
  setUid(uid: string) {
    this._uid = uid;
  }

  // Setter for notificationsEnabled
  setNotificationsEnabled(enabled: boolean) {
    this._notificationsEnabled = enabled;
  }

  enableNotifications = async () => {
    const permission = await this.requestNotificationToken();
    if (permission === 'granted') {
      this.setNotificationsEnabled(true); // Use setter to update state
      localStorage.setItem('notificationsEnabled', JSON.stringify(this.notificationsEnabled));
    }
  };

  requestNotificationToken = async (): Promise<NotificationPermission> => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'notifications' });

      if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
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

  private loadFromLocalStorage = async () => {
    const userData = localStorage.getItem('userItem');
    const savedData = userData && JSON.parse(userData);
    const storedState = localStorage.getItem('notificationsEnabled');
    if (savedData) {
      this.setUid(savedData.uid); // Use setter to update state
    }
    if (storedState) {
      const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
      if (permissionStatus.state === 'granted') {
        this.setNotificationsEnabled(true); // Use setter to update state
      } else {
        this.setNotificationsEnabled(false); // Use setter to update state
      }
    }
  };
}

export default NotificationStore;
