// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD84bXQXN9VFkO15p3EXXJnyDQ_hpUt6zE",
  authDomain: "teleloto-app.firebaseapp.com",
  projectId: "teleloto-app",
  storageBucket: "teleloto-app.appspot.com",
  messagingSenderId: "6936219394",
  appId: "1:6936219394:web:6131590d4afbf84c87fc1b",
  measurementId: "G-QV6CKJ5XJ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };
export default app;
