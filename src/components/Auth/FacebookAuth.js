import firebase from '../../firebase'

const fbProvider = new firebase.auth.FacebookAuthProvider
fbProvider.setCustomParameters({
  'display': 'popup',
});
fbProvider.addScope('email')

const fbSignIn = () =>{
    return firebase.auth().signInWithPopup(fbProvider).then(result =>{
        console.log(result.user);
    })
    .catch(err => console.log(err))
}


export default fbSignIn;