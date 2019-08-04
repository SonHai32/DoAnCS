import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyDtX1rd4EEzBD8bWdgIr5_x8vkfLNNL9Zc",
    authDomain: "react-slack-ceeef.firebaseapp.com",
    databaseURL: "https://react-slack-ceeef.firebaseio.com",
    projectId: "react-slack-ceeef",
    storageBucket: "react-slack-ceeef.appspot.com",
    messagingSenderId: "873088624200",
    appId: "1:873088624200:web:584a4edbf8fee733"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;