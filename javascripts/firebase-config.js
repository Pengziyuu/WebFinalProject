// Add your Firebase Project Config here...
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmkSCZtdjZtML2auxGYZBMSszv8pELs0Y",
    authDomain: "ntut-web-84210.firebaseapp.com",
    projectId: "ntut-web-84210",
    storageBucket: "ntut-web-84210.appspot.com",
    messagingSenderId: "782606068910",
    appId: "1:782606068910:web:6bc66c379fd243d0e5d13f"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();