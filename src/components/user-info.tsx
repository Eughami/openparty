import React, { useEffect, useState } from 'react';
// import { Avatar, Row, Spin, Col } from 'antd';
// import firebase from "firebase";
// import MyCard from '../components/card';
// import { Post, RegistrationObject } from './interfaces/user.interface';
// import { connect } from 'react-redux';
// import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../redux/user/user.actions';

import { UserInfo } from "firebase";

// interface IUserProps {
//     setCurrentUserListener?: () => Promise<any>,
//     setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
//     currentUser?: firebase.User,
//     userInfo?: RegistrationObject,
//     history?: any
// }

// const UserProfile = (props: IUserProps) => {
//     console.log("UserProfile Props: ", props);
//     const { currentUser, userInfo } = props;

//     const [selfUser, setSelfUser] = useState<boolean>(false);

//     const [loading, setLoading] = useState<boolean>(true)

//     const [posts, setPosts] = useState<Array<Post>>([])

//     const awaitFillPosts = async (posts: Array<firebase.database.DataSnapshot>): Promise<Array<Post>> => {
//         let temp: Array<Post> = [];

//         for (let i = 0; i < posts.length; i++) {

//             await firebase.database().ref("Users").child(posts[i].val().uid).once("value", userPosts => {
//                 if (userPosts.exists()) {
//                     temp.push({
//                         caption: posts[i].val().caption,
//                         user: {
//                             image_url: userPosts.val().image_url,
//                             username: userPosts.val().username,
//                         },
//                         likes: posts[i].val().likes,
//                         privacy: posts[i].val().privacy,
//                         user_id: userPosts.key!,
//                         image_url: posts[i].val().image_url,
//                     })
//                 }
//             });

//         }

//         return temp;
//     };


//     useEffect(() => {

//         if (!currentUser) return;

//         const unSub = firebase.database().ref("Posts").on("value", async (snapshot) => {
//             if (snapshot.exists()) {

//                 let ttt: Array<firebase.database.DataSnapshot> = [];
//                 snapshot.forEach((post) => {
//                     if (post.val().privacy === "Public" || post.val().uid === currentUser!.uid) {
//                         ttt.push(post);
//                     }
//                 });

//                 const newPosts = await awaitFillPosts(ttt);

//                 setPosts(newPosts)
//                 setLoading(false);
//             }
//             else {
//                 setPosts([]);
//                 setLoading(false);
//             }
//         })

//         return firebase.database().ref("Posts").off("value", unSub);

//     }, [currentUser])

//     useEffect(() => {
//         let unSub_1: any = null, unSub_2: any = null;

//         if (currentUser && userInfo) {
//             try {
//                 unSub_2 = firebase.database().ref("Credentials").child("Usernames").child(userInfo.username).on("value", usernames => {
//                     if (usernames.exists()) {
//                         const uid = usernames.val().uid;

//                         console.log("usernames.val(): ", usernames.val());

//                         setSelfUser(uid === currentUser!.uid);

//                         unSub_1 = firebase.database().ref("Users").child(uid).on("value", snapshot => {
//                             if (snapshot.exists()) {
//                                 const user = snapshot.val();
//                                 setUserDetails({
//                                     followers_count: user.followers_count,
//                                     following_count: user.following_count,
//                                     username: user.username,
//                                     posts_count: user.posts_count,
//                                     image_url: user.image_url,
//                                     uid: uid,
//                                     real: true,
//                                 })
//                             }
//                             else {
//                                 setPosts([]);
//                             }
//                         })

//                     }
//                     else {
//                         setUserDetails({ ...userDetails, real: false })
//                     }
//                 })
//             }

//             catch (error) {
//                 console.log(error);

//             }
//         }

//         return function cleanup() {
//             if (unSub_1)
//                 firebase.database().ref("Users").child("Posts").off("value", unSub_1);
//             if (unSub_2)
//                 firebase.database().ref("Credentials").child("Usernames").child(username).on("value", unSub_2);

//         };

//     }, [currentUserDone]);

//     useEffect(() => {
//         if (currentUserDone && userDetails.uid !== "") {

//             if (selfUser) {

//                 const unsub = firebase.database().ref("Users").child(currentUser!.uid).child("Posts").on("value", snapshot => {

//                     if (snapshot.exists()) {
//                         let temp_posts_ids: Array<string> = [];
//                         let temp_posts: Array<Post> = [];
//                         snapshot.forEach(post => {
//                             temp_posts_ids.push(post.key!);
//                         });
//                         console.log("ROOT POSTS v2: ", userDetails);

//                         temp_posts_ids.map(async (post_id, index) => {
//                             await firebase.database().ref("Posts").child(post_id).once("value", thisPost => {
//                                 if (thisPost.exists()) {
//                                     temp_posts.push({
//                                         caption: thisPost.val().caption,
//                                         user: {
//                                             image_url: userDetails.image_url,
//                                             username: userDetails.username,
//                                         },
//                                         likes: thisPost.val().likes,
//                                         privacy: thisPost.val().privacy,
//                                         user_id: userDetails.uid,
//                                         image_url: thisPost.val().image_url,
//                                     })
//                                 }
//                                 else {
//                                     temp_posts = [];
//                                 }
//                             })
//                             if (index === temp_posts_ids.length - 1) {
//                                 setPosts(temp_posts);
//                             }
//                         })

//                         temp_posts = [];
//                     }
//                     else {
//                         setPosts([]);
//                     }
//                 })

//                 return firebase.database().ref("Users").child("Posts").off("value", unsub);

//             }
//         }
//     }, [currentUserDone, selfUser, userDetails])

//     if (!userDetails.real) {
//         return (
//             <h1 style={{ textAlign: "center", marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>This page does not exist</h1>
//         )
//     }

//     if (!currentUserDone || userDetails.uid === "") {
//         return (
//             <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center" }}>
//                 <Spin size="large" />
//             </Col>
//         );
//     }


//     return (

//         <div>
//             <div style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>
//                 <Row style={{ alignItems: "center" }}>
//                     <Avatar
//                         src={userDetails.image_url}
//                         size={150}
//                     />
//                     <div style={{ marginLeft: 50 }}>
//                         <Col style={{ justifyContent: "space-between", alignItems: "center" }}>
//                             <h1 style={{ marginBottom: 5, marginTop: 15, fontWeight: "bold", }}>
//                                 {username}
//                             </h1>
//                             <h1>
//                                 {
//                                     selfUser ? "Edit" : "Follow"
//                                 }

//                             </h1>
//                         </Col>

//                         <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
//                             <p style={{ marginRight: 20 }}>{userDetails.posts_count} Posts</p>
//                             <p style={{ marginRight: 20 }}>{userDetails.followers_count} Followers</p>
//                             <p>{userDetails.following_count} Following</p>
//                         </Row>
//                     </div>
//                 </Row>
//                 <hr />
//                 <div className='posts__container'>
//                     {posts.length > 0 ? (
//                         posts.map((post, index) =>
//                             <MyCard key={index} Post={post} />
//                         )
//                     ) : (
//                             // console.log('not defined')
//                             <h1 style={{ textAlign: "center" }}>You Have No Posts</h1>
//                         )
//                     }
//                 </div>
//             </div>
//         </div>
//     )

// }

// const mapStateToProps = (state: any) => {
//     return {
//         currentUser: state.user.currentUser,
//         currentUserInfo: state.user.userInfo,
//     };
// };

// const mapDispatchToProps = (dispatch: any) => {
//     return {
//         setCurrentUserListener: () => dispatch(setCurrentUserListener()),
//         setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
//     }

// }

// export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const styles = {
//     screen: {
//         flex: 1,
//     },
//     userInfoSection: {
//         paddingHorizontal: 200,
//         marginBottom: 25,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//     },
//     caption: {
//         fontSize: 14,
//         lineHeight: 14,
//         fontWeight: 500,
//     },
//     row: {
//         flexDirection: "row",
//         marginBottom: 10,
//     },
//     infoBoxWrapper: {
//         borderBottomColor: "#dddddd",
//         borderBottomWidth: 1,
//         borderTopColor: "#dddddd",
//         borderTopWidth: 1,
//         flexDirection: "row",
//         height: 100,
//     },
//     infoBox: {
//         width: "50%",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     menuWrapper: {
//         marginTop: 10,
//     },
//     menuItem: {
//         flexDirection: "row",
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//     },
//     menuItemText: {
//         color: "#777777",
//         marginLeft: 20,
//         fontWeight: "600",
//         fontSize: 16,
//         lineHeight: 26,
//     },
// };

const UserProfile = () => {
    return (<></>)
}

export default UserProfile;