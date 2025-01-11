const express = require('express');
const cors = require('cors');
const { messaging, firestore } = require('./firebase-admin');
const cron = require('node-cron');
const { DateTime } = require('luxon'); // Импортируем Luxon

const app = express();
app.use(cors());
app.use(express.json());

// Эндпоинт для сохранения токенов
app.post('/api/saveToken', async (req, res) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    return res.status(400).send('Token and userId are required');
  }

  try {
    const userDocRef = firestore.collection('users').doc(userId);
    await userDocRef.set(
      {
        token,
      },
      { merge: true }
    );

    res.status(200).send('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).send('Error saving token');
  }
});

cron.schedule('* * * * *', async () => {
  console.log('[cron] Checking tasks...');
  await checkTasks(); // Вызов основной функции проверки задач
});

const checkTasks = async () => {
  const now = DateTime.now();
  const twoMinutesLater = now.plus({ minutes: 1 });

  const nowFormatted = now.toFormat('yyyy-MM-dd HH:mm');
  const twoMinutesLaterFormatted = twoMinutesLater.toFormat('yyyy-MM-dd HH:mm');

  try {
    const usersSnapshot = await firestore.collection('users').get();
    console.log(`[cron] Found ${usersSnapshot.size} users`);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      console.log(`[cron] Checking tasks for userId: ${userId}`);

      const tasksSnapshot = await firestore
        .collection(`users/${userId}/tasks`)
        .where('date', '>=', nowFormatted)
        .where('date', '<=', twoMinutesLaterFormatted)
        .get();

      if (tasksSnapshot.empty) {
        console.log(`[cron] No tasks found for userId: ${userId}`);
        continue;
      }

      console.log(`[cron] Found ${tasksSnapshot.size} tasks for userId: ${userId}`);

      for (const taskDoc of tasksSnapshot.docs) {
        const task = taskDoc.data();
        const taskId = taskDoc.id;
        console.log(`[cron] Task "${task.message}" is scheduled for ${task.date}`);
        await sendNotification(task, userId, taskId);
      }
    }
  } catch (error) {
    console.error('[cron] Error checking tasks:', error);
  }
};

const sendNotification = async (task, userId, taskId) => {
  try {
    // Получаем токен пользователя из Firestore
    const userDoc = await firestore.collection('users').doc(userId).get();
    const userToken = userDoc.data()?.token;

    if (!userToken) {
      console.warn(`[cron] No token found for userId: ${userId}`);
      return;
    }

    // Настраиваем сообщение для отправки через Firebase Messaging
    const message = {
      notification: {
        title: 'Task Reminder',
        body: `Reminder: ${task.message}`,
      },
      token: userToken,
    };

    // Отправляем сообщение через Firebase Messaging
    await messaging.send(message);

    console.log(`[cron] Notification sent successfully for taskId: ${taskId}, userId: ${userId}`);
  } catch (error) {
    console.error(`[cron] Failed to send notification for taskId: ${taskId}, userId: ${userId}`, error);
  }
};

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
