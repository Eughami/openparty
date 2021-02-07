import {
  Post,
  RegistrationObject,
} from '../../components/interfaces/user.interface';
import UserActionTypes from './user.types';
import firebase from 'firebase';
import axios from 'axios';
import {
  ALIEN_AUTH_ENDPOINT,
  API_BASE_URL,
  API_BASE_URL_OPEN,
  GET_USER_ELIGIBLE_POST_ENDPOINT,
  REGISTRATION_ENDPOINT,
} from '../../service/api';
import bluebird from 'bluebird';
// import _ from 'lodash';

export const googleSignInStart = (history: any) => (dispatch: any) =>
  new Promise(async (resolve, reject) => {
    dispatch({ type: UserActionTypes.GOOGLE_SIGN_IN_START });
    try {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(async (user) => {
          console.log('googleSignIn', user.user);

          if (!user.user) {
            dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
            reject('Unknown error occurred');
            return;
          }
          // clear alert box fon unauth users
          dispatch({
            type: 'SET_UNAUTH_LOGIN',
            payload: false,
          });

          // does not matter what's next user is logged in at this point

          const token = await user.user.getIdToken();

          // set tbe user token
          dispatch({
            type: UserActionTypes.SET_CURRENT_USER_TOKEN,
            payload: token,
          });

          // check for RAL
          const RAL = localStorage.getItem('RAL');
          console.log('Google login RAL', RAL);
          RAL ? history.replace(RAL) : history.replace('/');

          const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user.user),
          };
          const url = `${API_BASE_URL}${ALIEN_AUTH_ENDPOINT}`;
          return fetch(url, requestOptions)
            .then((response) => {
              response
                .json()
                .then((jsonResponse) => {
                  console.log('@SIGN IN SUCCESS: ', jsonResponse);

                  dispatch({
                    type: UserActionTypes.SIGN_IN_SUCCESS,
                    payload: user.user,
                  });

                  resolve(user.user);
                })
                .catch((error) => {
                  console.log('@ALIEN ENDPOINT.JSON RES ERROR: ', error);
                  dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
                  reject(error);
                });
            })
            .catch((error) => {
              console.log('@ALIEN ENDPOINT ERROR: ', error);
              dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
              reject(error);
            });
        })
        .catch((error) => {
          dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
          reject(error);
        });
    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
      reject(error);
    }
  });

export const signInSuccess = (user: any) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error: any) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

export const emailSignInStart = (
  emailAndPassword: {
    email: string;
    password: string;
  },
  history: any
) => (dispatch: (arg0: { type: string; payload?: any }) => void) =>
  new Promise((resolve, reject) => {
    dispatch({ type: UserActionTypes.EMAIL_SIGN_IN_START });

    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          emailAndPassword.email,
          emailAndPassword.password
        )
        .then(async (user) => {
          if (!user.user) {
            dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
            reject('Unknown error occurred');
            return;
          }

          const token = await user.user.getIdToken();

          // clear alert box fon unauth users
          dispatch({
            type: 'SET_UNAUTH_LOGIN',
            payload: false,
          });

          // set the user token
          dispatch({
            type: UserActionTypes.SET_CURRENT_USER_TOKEN,
            payload: token,
          });

          dispatch({
            type: UserActionTypes.SIGN_IN_SUCCESS,
            payload: user.user,
          });
          resolve(user);
          // check for RAL
          const RAL = localStorage.getItem('RAL');
          RAL ? history.replace(RAL) : history.replace('/');
        })
        .catch((error) => {
          dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
          reject(error);
        });
    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
      reject(error);
    }
  });

export const setCurrentUserListener = () => (dispatch: any) =>
  new Promise(async (resolve, reject) => {
    console.log('AUTH STATE CHANGED! Called');

    try {
      firebase.auth().onAuthStateChanged(async (user) => {
        console.log('AUTH STATE CHANGED! ', user);

        if (user) {
          dispatch({ type: UserActionTypes.SET_CURRENT_USER, payload: user });
        } else {
          dispatch({ type: UserActionTypes.SIGN_OUT_SUCCESS });
        }
        resolve(user);
      });
    } catch (error) {
      console.log('AUTH STATE CHANGED! ', error);
      reject(error);
    }
  });

export const setCurrentUserToken = (_currentUser: firebase.User) => (
  dispatch: any
) =>
  new Promise(async (resolve, reject) => {
    try {
      firebase.auth().onIdTokenChanged(async (user) => {
        console.log('ID TOKEN STATE CHANGED! ', user);

        if (user) {
          const token = await user.getIdToken();

          dispatch({
            type: UserActionTypes.SET_CURRENT_USER_TOKEN,
            payload: token,
          });
          resolve(token);
        } else {
          resolve('');
          return;
        }
      });
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserRootDatabaseListener = (uid: string) => (
  dispatch: (arg0: { type: string; payload: any }) => void,
  getState: any
) => {
  return new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Users')
        .child(uid)
        .on('value', (userSnap) => {
          console.log('NOW LISTENING ON NODE: ', userSnap.val());
          console.log('PREV USER INFO: ', getState());
          if (getState().user.userInfo) {
            console.log('USER INFO PREV STATE ACTIVE');

            // const prevUserInfo = getState().user.userInfo as RegistrationObject;
            // const newUserInfo = userSnap.val() as RegistrationObject;
            // if (newUserInfo.followers_count !== prevUserInfo.followers_count) {
            //   console.log('NOT DISPATCHING FOR FOLLOW COUNT');
            //   return;
            // }
            // if (newUserInfo.following_count < prevUserInfo.following_count) {
            //   console.log('NOT DISPATCHING FOR FOLLOWING LESS COUNT');
            //   return;
            // }
          }

          dispatch({
            type: UserActionTypes.DATABASE_LISTENER_START,
            payload: userSnap.val(),
          });
          resolve(userSnap.val());
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const setCurrentUserEligiblePosts = (currentUser: firebase.User) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  new Promise(async (resolve, reject) => {
    try {
      const token = await currentUser.getIdToken();

      //Get eligible posts for the user
      const result = await axios.get(
        // 'http://localhost:5000/openpaarty/us-central1/api/v1/posts/users-eligible-post',
        `${API_BASE_URL}${GET_USER_ELIGIBLE_POST_ENDPOINT}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS,
        payload: result.data.uFP,
      });
      resolve(result.data.uFP);
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserEligiblePostsListener = (
  posts: Array<{ postRef: string; uidRef: string; username: string }>
) => (dispatch: (arg0: { type: string; payload?: any }) => void) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!posts) {
        return dispatch({
          type: UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS_LISTENER,
          payload: [],
        });
      }
      if (posts.length === 0) {
        return dispatch({
          type: UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS_LISTENER,
          payload: [],
        });
      }
      let temp: any = {};
      return bluebird
        .map(
          posts,
          async (obj, index: number) => {
            firebase
              .database()
              .ref('Postsv2')
              .child(obj.uidRef)
              .child(obj.postRef)

              .on(
                'value',
                async (ssh) => {
                  //No need to check post privacy again because all posts we have access to are here?
                  if (!ssh.exists()) {
                    return;
                  }
                  temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                  temp[`${obj.uidRef + obj.postRef}`].key = `${
                    obj.uidRef + obj.postRef
                  }`;

                  // if (localStorage.getItem('postsSet')) {
                  //   temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                  //   temp[`${obj.uidRef + obj.postRef}`].key = `${
                  //     obj.uidRef + obj.postRef
                  //   }`;

                  //   const cachedPosts = Object.values(temp).sort(
                  //     (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
                  //   );
                  //   dispatch({
                  //     type:
                  //       UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS_LISTENER,
                  //     payload: cachedPosts,
                  //   });
                  //   resolve(cachedPosts);
                  // }

                  if (
                    index ===
                    posts.length - 1
                    // &&  !localStorage.getItem('postsSet')
                  ) {
                    const cachedPosts = Object.values(temp).sort(
                      (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
                    );
                    dispatch({
                      type:
                        UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS_LISTENER,
                      payload: cachedPosts,
                    });
                    resolve(cachedPosts);
                  }
                },
                (error: any) => {
                  console.log('@SSH ERROR: ', error);
                  if (error.code) {
                    if (error.code === 'PERMISSION_DENIED') {
                      // delete temp[lastKey];
                      // setPosts(Object.values(temp));
                      //TODO: Maybe show 'post not available message'?
                    }
                  }
                }
              );
          },
          {
            concurrency: posts.length,
          }
        )
        .then(() => {
          console.log('DONE MAPPING');
        });
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserActivityListener = () => (
  dispatch: (arg0: { type: string; payload?: any }) => void
) =>
  new Promise(async (resolve, reject) => {
    try {
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserUsernameDatabaseListener = (uid: string) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Users')
        .child(uid)
        .child('username')
        .on('value', (userSnap) => {
          console.log('NOW LISTENING ON USERNAME NODE: ', userSnap.val());

          dispatch({
            type: UserActionTypes.USERNAME_NODE_DATABASE_LISTENER_START,
            payload: userSnap.val(),
          });
          resolve(userSnap.val());
        });
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserFollowingChangedListener = (
  uid: string,
  uFP: Array<{ postRef: string; uidRef: string; username: string }>
) => (dispatch: (arg0: { type: string; payload: any }) => void) =>
  new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Following')
        .child(uid)
        .on('child_removed', (userFollowingSnap) => {
          console.log(
            'NOW LISTENING ON FOLLOWING NODE: ',
            userFollowingSnap.val()
          );

          //whenever user stops following someone, dispatch action to get eligible posts again.
          // setCurrentUserEligiblePosts(firebase.auth().currentUser!);
          const newEligiblePosts = uFP.filter(
            (ref) => ref.uidRef !== userFollowingSnap.val().uid
          );
          dispatch({
            type: UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS,
            payload: newEligiblePosts.length > 0 ? newEligiblePosts : null,
          });
          resolve(userFollowingSnap.val());
        });
    } catch (error) {
      reject(error);
    }
  });

export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION,
});

export const userUpated = (currentUser: any) => ({
  type: UserActionTypes.USER_UPDATED,
  payload: currentUser,
});

export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START,
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error: any) => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error,
});
export const signUpStart = (userObj: RegistrationObject) => {
  let object: any = userObj;
  //attaching the auth
  object.auth = 'api@openparty.com';
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `EnHzwn2fBib4tgzKNBzXBcNAHSq1`,
    },
    body: JSON.stringify(object),
  };
  const url = `${API_BASE_URL_OPEN}${REGISTRATION_ENDPOINT}`;
  console.log('before sending register request', userObj);

  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      dispatch({ type: UserActionTypes.SIGN_UP_START });
      return fetch(url, requestOptions).then(
        (response) => {
          if (response.ok) {
            response.json().then((resJson) => {
              dispatch({
                type: UserActionTypes.SIGN_UP_SUCCESS,
                payload: userObj,
              });
              resolve(true);
            });
          } else if (response.status === 409) {
            response.json().then((res) => {
              dispatch({
                type: UserActionTypes.SIGN_UP_FAILURE,
                payload: res.message,
              });
              reject(res.message);
            });
          } else if (response.status === 500) {
            response.json().then((res) => {
              dispatch({
                type: UserActionTypes.SIGN_UP_FAILURE,
                payload: res.message,
              });
              console.log(res);
              reject(res.message.message);
            });
          } else {
            dispatch({
              type: UserActionTypes.SIGN_UP_FAILURE,
              payload: 'Unauthorized',
            });
            reject('Unauthorized');
          }
        },
        (error) => {
          dispatch({
            type: UserActionTypes.SIGN_UP_FAILURE,
            payload: error,
          });
          console.log('Error :', error);
          reject('SignUp Failed');
        }
      );
    });
};

export const signUpSuccess = (userObj: RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userObj,
});

export const signUpFailure = (error: any) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error,
});

export const setCurrentUserViewing = (user: RegistrationObject | null) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  dispatch({
    type: UserActionTypes.SET_CURRENT_USER_VIEWING,
    payload: user,
  });

export const setCurrentUserPostViewing = (post: Post | null) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  dispatch({
    type: UserActionTypes.SET_CURRENT_USER_POST_VIEWING,
    payload: post,
  });
