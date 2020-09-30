import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANPCFVQeH_XXGivL-vQDqiquFqrYcUbV8",
  authDomain: "cchat-1569606476920.firebaseapp.com",
  databaseURL: "https://cchat-1569606476920.firebaseio.com",
  projectId: "cchat-1569606476920",
  storageBucket: "cchat-1569606476920.appspot.com",
  messagingSenderId: "306732381208",
  appId: "1:306732381208:web:9c93bb368ae8be3875ff6d",
  measurementId: "G-RDG7RZEZSR"
};
// var firebaseConfig = {
//     apiKey: "AIzaSyDtX1rd4EEzBD8bWdgIr5_x8vkfLNNL9Zc",
//     authDomain: "react-slack-ceeef.firebaseapp.com",
//     databaseURL: "https://react-slack-ceeef.firebaseio.com",
//     projectId: "react-slack-ceeef",
//     storageBucket: "react-slack-ceeef.appspot.com",
//     messagingSenderId: "873088624200",
//     appId: "1:873088624200:web:584a4edbf8fee733"
// };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;