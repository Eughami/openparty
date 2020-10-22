import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {userUpated} from '../redux/user/user.actions'

const config = {
  apiKey: "AIzaSyAqmmh2U3EF0D5H7cU_gtUDGua6J-pJmT8",
  authDomain: "openpaarty.firebaseapp.com",
  databaseURL: "https://openpaarty.firebaseio.com",
  projectId: "openpaarty",
  storageBucket: "openpaarty.appspot.com",
  messagingSenderId: "1068571012809",
  appId: "1:1068571012809:web:fe037ded9b36d40fdfe718",
  measurementId: "G-1GCM1NG8CM"
};

firebase.initializeApp(config);


export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  console.log('userAuth : ', userAuth)
  console.log('additional data : ', additionalData)
  let email = null
  let username = null
  let prefix = null
  let phone = null

  if (additionalData) {

    email = additionalData.email
    username = additionalData.username
    prefix = additionalData.prefix
    phone = additionalData.phone
  }
  //update user in the database
  await firebase.database().ref("Users").child(userAuth.uid).update({
    email,
    username,
    phoneNumber: `+${prefix}${phone}`
  })
  // to link userCredentials to user in the database
  await firebase.database().ref("Credentials").child("Usernames").child(username).update({ uid: userAuth.uid })

  return {
    email,
    username,
    phoneNumber: `+${prefix}${phone}`
  }
  // 
  // await firebase.database().ref("Users").child(uid).once("value", snapshot => userObject = snapshot.val())


  // await firebase.database().ref("Users").child(userAuth.uid).once("value", snapShot => {
  //   if(!snapShot.exists()) {
  //     const { displayName, email } = userAuth;
  //     const createdAt = new Date();

  //     await firebase.database().ref("Users").child(userAuth.uid).set({
  //       displayName,
  //       email,
  //       createdAt,
  //       ...additionalData
  //     });      
  //   } 
  //   return snapShot.val();
  // })
  // let userRef = firebase.database().ref(`Users/${userAuth.uid}`)
  // let userSnap = await userRef.once('value', async(snapShot) => {
  //   if (!snapShot.exists()) {
  //     try {
  //       userRef.set(
  //       {
  //         email,
  //         username,
  //         phoneNumber: `+${prefix}${phone}`
  //       });
  //       return  {
  //         email,
  //         username,
  //         phoneNumber: `+${prefix}${phone}`
  //       }
  //     } catch (error) {
  //       console.log('error creating user', error.message);
  //     }
  //   }
  //   console.log('test ' ,snapShot.val());
  //   return snapShot

  // });
  // return userSnap


  // firebase.database().ref("Users").child(current_userId).on("value", snapshot => if(snapshot.exists() {})

  // const snapShot = await userRef.get();


};

export const userUpdated = () =>{
  console.log("Action dispatched")

  console.log(firebase.auth().currentUser)
  if(firebase.auth().currentUser !== null ){
    firebase.database().ref("Users").child(firebase.auth().currentUser.uid).on("value", snapshot => {
      console.log("called")
      userUpated(snapshot.val())
      // dispatch({
      //   type: "USER_UPDATED",
      //   payload: snapshot.val(),
      // });
    })
  }
} 

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
