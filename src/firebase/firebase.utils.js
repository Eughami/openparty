import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

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

  // console.log(`${userAuth.uid}`)

  let userRef = await firebase.database().ref(`Users/${userAuth.uid}`)
  // console.log('test ref: ', userRef)
  await userRef.on('value', async(snapShot) => {
    if (!snapShot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        });
        console.log("snapshot created successfully")
      } catch (error) {
        console.log('error creating user', error.message);
      }
      return snapShot.val()
    }
    console.log('test ' ,snapShot.val());

    return snapShot.val()
  });


  // firebase.database().ref("Users").child(current_userId).on("value", snapshot => if(snapshot.exists() {})

  // const snapShot = await userRef.get();


};


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
