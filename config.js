import firebase from 'firebase/compat';
import 'firebase/compat/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAkwoLjpP-gTICg51D5MQhgC_1RAimvd84",
  authDomain: "booksclub-k1935294.firebaseapp.com",
  projectId: "booksclub-k1935294",
  storageBucket: "booksclub-k1935294.appspot.com",
  messagingSenderId: "274123439641",
  appId: "1:274123439641:web:8ec42af9cb6a067772b488",
  measurementId: "G-TFFZ521VDG"
};
let app;
if(firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig)
}else{
  app = firebase.app()
}
const auth = firebase.auth();
const db = firebase.firestore(app);
export{auth,db }
