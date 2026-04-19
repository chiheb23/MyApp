importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBvpqPvSE-cSA2cGHV0mi1tc90e29iDyR8",
  authDomain: "football-1a271.firebaseapp.com",
  projectId: "football-1a271",
  storageBucket: "football-1a271.firebasestorage.app",
  messagingSenderId: "605161827570",
  appId: "1:605161827570:web:1e38823223861b86bb746b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
