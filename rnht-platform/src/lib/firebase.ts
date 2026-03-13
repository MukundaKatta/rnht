import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "rnht-platform",
  appId: "1:323074034442:web:4627b3af30d86be9af88f3",
  storageBucket: "rnht-platform.firebasestorage.app",
  apiKey: "AIzaSyALuttMkBcN_fVDlj2vbLVj5lz6MawY7U0",
  authDomain: "rnht-platform.firebaseapp.com",
  messagingSenderId: "323074034442",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const storage = getStorage(app);
