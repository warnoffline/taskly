importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCwXwRAZzVUs4zbYwxcrQ7jv_LUktUoWtI',
  authDomain: 'food-d60d1.firebaseapp.com',
  projectId: 'food-d60d1',
  storageBucket: 'food-d60d1.firebasestorage.app',
  messagingSenderId: '674663975409',
  appId: '1:674663975409:web:122de92064ad57625c5c50',
  measurementId: 'G-LXVFP2VHZR',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, click_action } = payload.data;
  const options = {
    body,
    data: { click_action },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.click_action;

  // Открыть ссылку в новой вкладке
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const client = clientList.find((client) => client.url === url);
      if (client) {
        return client.focus();
      }

      return clients.openWindow(url);
    })
  );
});
