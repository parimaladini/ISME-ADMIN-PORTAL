import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCIInjGiIRVI1r1G8QSBEPgwRol3yG7YYE",
    authDomain: "isme-d786c.firebaseapp.com",
    databaseURL: "https://isme-d786c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "isme-d786c",
    storageBucket: "isme-d786c.appspot.com",
    messagingSenderId: "85959155813",
    appId: "1:85959155813:web:8ae1ca7b5191617552268c",
    measurementId: "G-RQ7K101RSD"
  };
  
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
