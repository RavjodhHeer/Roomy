import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDAk22Df4AN8xwwK0PNIcztgqaJRArwWDQ",
    authDomain: "roomy-2d029.firebaseapp.com",
    projectId: "roomy-2d029",
    storageBucket: "roomy-2d029.appspot.com",
    messagingSenderId: "155903804482",
    appId: "1:155903804482:web:8d5f1fe298c285665699db",
    measurementId: "G-TG68SYRE94"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
