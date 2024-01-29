import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyArXBw08EqEVrgx0638wIy0QS7XDmYCRsw",
  authDomain: "chatsphere-92e0d.firebaseapp.com",
  projectId: "chatsphere-92e0d",
  storageBucket: "chatsphere-92e0d.appspot.com",
  messagingSenderId: "489625636293",
  appId: "1:489625636293:web:045be793833cac8ea50fac",
  measurementId: "G-RQ31RD8RC0"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db
