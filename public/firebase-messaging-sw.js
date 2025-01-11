importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyDxZDoVhNrykmp9V6Ya1ViKBFiWfkAVuYY',
  authDomain: 'taskly-f8bf1.firebaseapp.com',
  projectId: 'taskly-f8bf1',
  storageBucket: 'taskly-f8bf1.firebasestorage.app',
  messagingSenderId: '992239614071',
  appId: '1:992239614071:web:79cd1eb22d136e51e92e72',
  measurementId: 'G-B27LTW8X56',
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = app.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] onBackgroundMessage ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
