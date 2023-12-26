import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyB5TK4TS4XFSClhZHX9OAwU_msXakn-3gI",
  authDomain: "slack-clone-6bab2.firebaseapp.com",
  projectId: "slack-clone-6bab2",
  storageBucket: "slack-clone-6bab2.appspot.com",
  messagingSenderId: "396894926730",
  appId: "1:396894926730:web:40e1480ce4b9ec0b4d7a73",
  measurementId: "G-NTN6D8TD5T"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db
