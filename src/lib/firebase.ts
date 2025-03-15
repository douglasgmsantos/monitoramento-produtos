import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  // Suas configurações do Firebase aqui
  apiKey: "sua-api-key",
  authDomain: "seu-auth-domain",
  databaseURL: "sua-database-url",
  projectId: "seu-project-id",
  storageBucket: "seu-storage-bucket",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getDatabase(app) 