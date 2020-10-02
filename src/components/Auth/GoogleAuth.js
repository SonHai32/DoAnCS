import firebase from '../../firebase'

const ggProvider = new firebase.auth.GoogleAuthProvider

const ggSignIn = () =>{
     firebase.auth().signInWithPopup(ggProvider).then(result =>{
        console.log(result.user)
    }).catch(err =>{
        console.log(err)
    })
}

export default ggSignIn; 

