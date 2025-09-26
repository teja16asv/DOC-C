import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaxy8Q0Qi18e122TswholFqwZRMevzins",
  authDomain: "doc-c-plus.firebaseapp.com",
  projectId: "doc-c-plus",
  storageBucket: "doc-c-plus.firebasestorage.app",
  messagingSenderId: "473612236217",
  appId: "1:473612236217:web:c5c4324475f93fed5fb268",
  measurementId: "G-YS5BMZH321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);