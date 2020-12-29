import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAOUvTYYwB7o_2AADRvdkOJ3HdkbsSinAc",
  authDomain: "ticctactoee.firebaseapp.com",
  projectId: "ticctactoee",
  storageBucket: "ticctactoee.appspot.com",
  messagingSenderId: "1088964664906",
  appId: "1:1088964664906:web:08f5427b484574467ed0b3",
  measurementId: "G-0KNK4BGJ4Y",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };
