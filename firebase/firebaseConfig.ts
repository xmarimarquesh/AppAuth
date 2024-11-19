// firebase/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCnwabS06sBoO3u5CPiFmNiSjcSib5MaRw",
  authDomain: "myhome-c70d1.firebaseapp.com",
  projectId: "myhome-c70d1",
  storageBucket: "myhome-c70d1.firebasestorage.app",
  messagingSenderId: "885534949031",
  appId: "1:885534949031:web:e40bfbececa417382b2582",
  measurementId: "G-5WKGMKW3PZ",
  databaseURL: "https://myhome-c70d1-default-rtdb.firebaseio.com" // URL do banco de dados Realtime
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
