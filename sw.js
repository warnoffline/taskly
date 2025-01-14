importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js');
import { firebaseConfig } from './src/configs/firebaseConfig';

if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Сервисный работник обновлен! Перезагрузите страницу.');
  });
}

firebase.initializeApp(firebaseConfig);

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
