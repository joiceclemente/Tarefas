
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAYprILYnRlxltUyuQfMIRWKkKhzsT8YdU",
  authDomain: "tarefas-1ed01.firebaseapp.com",
  projectId: "tarefas-1ed01",
  storageBucket: "tarefas-1ed01.appspot.com",
  messagingSenderId: "979967203949",
  appId: "1:979967203949:web:e2d6f0768a2a8767eb7d64"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }