import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import { getStorage, ref, deleteObject} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_whVyFh4p90qyjsTn17FJGCInlkkN4s4",
  authDomain: "todo-57258.firebaseapp.com",
  projectId: "todo-57258",
  storageBucket: "todo-57258.appspot.com",
  messagingSenderId: "640925956447",
  appId: "1:640925956447:web:4a748253c65304f9e19eea"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const storage = getStorage()