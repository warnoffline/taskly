import { getToken } from 'firebase/messaging';
import { messaging } from '@/configs/firebaseConfig';
import axios from 'axios';

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  const data = localStorage.getItem('userItem');
  const user = data && JSON.parse(data);
  const uid = user.uid;
  if (permission === 'granted' && uid) {
    const token = await getToken(messaging, {
      vapidKey: 'BLJqV4lkuPcOJlUuj_7nDyxYEOK2v9Vg3F2DZBDdgov-TTqG4FDkuIVNiN7D83Av9jA9L7JnE7prQNwAKsAtKXk',
    });
    localStorage.setItem('token', token);
    axios
      .post('https://taskly-service.ru/api/saveToken', {
        token,
        userId: uid,
      })
      .then(() => {
        console.log('Token saved successfully');
      })
      .catch((error) => {
        console.error('Error saving token:', error);
      });
    console.log(token);
    return token;
  }
};
