// Firebase 配置 - 比 Supabase 简单得多！
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 配置（从 Firebase Console 获取）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 导出服务
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 简单的认证助手函数
export const getCurrentUser = () => {
  return auth.currentUser;
};

// 检查是否登录
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

export default app;



