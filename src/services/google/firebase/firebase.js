import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const env_var = process.env;

const firebaseConfig = {
    apiKey: env_var.REACT_APP_FIREBASE_API_KEY,
    authDomain: `${env_var.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    // The value of `databaseURL` depends on the location of the database
    databaseURL: `https://${env_var.REACT_APP_FIREBASE_DATABASE_NAME}.firebaseio.com`,
    projectId: env_var.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: `${env_var.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: env_var.REACT_APP_FIREBASE_SENDER_ID,
    appId: env_var.REACT_APP_FIREBASE_APP_ID,
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: `G-${env_var.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
}

const app = initializeApp(firebaseConfig);


export const database = getDatabase(app);