const admin = require('firebase-admin');
const serviceAccount = require('./tasklyAdminKey.json'); // Скачай этот файл с Firebase Console

// Инициализация Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();
const firestore = admin.firestore();

module.exports = { messaging, firestore };
