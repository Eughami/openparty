import React, { useEffect, useState } from 'react';
import { Avatar, Row, Spin, Col } from 'antd';
import firebase from "firebase";
import MyCard from '../components/card';
import { Post, RegistrationObject } from '../constants/interfaces';

interface IUserProps {
  match: any,
  // user: {username: "jake", id: "0", followers_count: 55, following_count: 100, image_url: "https://api.adorable.io/avatars/285/abott@adorable", posts_count: 103}
}

interface LocalUser {
  followers_count: number,
  following_count: number,
  username: string,
  posts_count: number,
  image_url: string,
  uid: string,
  real: boolean,
}

const UserProfile = (props: IUserProps) => {
  // console.log("UserProfile Props: ", props);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();
  const [userDetails, setUserDetails] = useState<LocalUser>({ followers_count: 0, image_url: "", username: "", uid: "", following_count: 0, posts_count: 0, real: true });
  const [currentUserDone, setCurrentUserDone] = useState<boolean>(false);
  const [selfUser, setSelfUser] = useState<boolean>(false);

  const { username } = props.match.params;

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setCurrentUserDone(true);
    });

    return unsub;
  }, []);

  useEffect(() => {
    let unsub_1: any = null, unsub_2: any = null;
    if (currentUserDone) {
      try {
        unsub_2 = firebase.database().ref("Credentials").child("Usernames").child(username).on("value", usernames => {
          if (usernames.exists()) {
            const uid = usernames.val().uid;

            console.log("usernames.val(): ", usernames.val());

            setSelfUser(uid === currentUser!.uid);

            unsub_1 = firebase.database().ref("Users").child(uid).on("value", snapshot => {
              if (snapshot.exists()) {
                const user = snapshot.val();
                setUserDetails({
                  followers_count: user.followers_count,
                  following_count: user.following_count,
                  username: user.username,
                  posts_count: user.posts_count,
                  image_url: user.image_url,
                  uid: uid,
                  real: true,
                })
              }
              else {
                setPosts([]);
              }
            })

          }
          else {
            setUserDetails({ ...userDetails, real: false })
          }
        })
      }

      catch (error) {
        console.log(error);

      }
    }

    return function cleanup() {
      if (unsub_1)
        firebase.database().ref("Users").child("Posts").off("value", unsub_1);
      if (unsub_2)
        firebase.database().ref("Credentials").child("Usernames").child(username).on("value", unsub_2);

    };

  }, [currentUserDone]);

  useEffect(() => {
    if (currentUserDone && userDetails.uid !== "") {

      if (selfUser) {

        const unsub = firebase.database().ref("Users").child(currentUser!.uid).child("Posts").on("value", snapshot => {

          if (snapshot.exists()) {
            let temp_posts_ids: Array<string> = [];
            let temp_posts: Array<Post> = [];
            snapshot.forEach(post => {
              temp_posts_ids.push(post.key!);
            });
            console.log("ROOT POSTS v2: ", userDetails);

            temp_posts_ids.map(async (post_id, index) => {
              await firebase.database().ref("Posts").child(post_id).once("value", thisPost => {
                if (thisPost.exists()) {
                  temp_posts.push({
                    caption: thisPost.val().caption,
                    user: {
                      image_url: userDetails.image_url,
                      username: userDetails.username,
                    },
                    likes: thisPost.val().likes,
                    privacy: thisPost.val().privacy,
                    user_id: userDetails.uid,
                    image_url: thisPost.val().image_url,
                  })
                }
                else {
                  temp_posts = [];
                }
              })
              if (index === temp_posts_ids.length - 1) {
                setPosts(temp_posts);
              }
            })

            temp_posts = [];
          }
          else {
            setPosts([]);
          }
        })

        return firebase.database().ref("Users").child("Posts").off("value", unsub);

      }
    }
  }, [currentUserDone, selfUser, userDetails])

  if (!userDetails.real) {
    return (
      <h1 style={{ textAlign: "center", marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>This page does not exist</h1>
    )
  }

  if (!currentUserDone || userDetails.uid === "") {
    return (
      <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center" }}>
        <Spin size="large" />
      </Col>
    );
  }


  return (

    <div>
      <div style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>
        <Row style={{ alignItems: "center" }}>
          <Avatar
            src={userDetails.image_url}
            size={150}
          />
          <div style={{ marginLeft: 50 }}>
            <Col style={{ justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ marginBottom: 5, marginTop: 15, fontWeight: "bold", }}>
                {username}
              </h1>
              <h1>
                {
                  selfUser ? "Edit" : "Follow"
                }

              </h1>
            </Col>

            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ marginRight: 20 }}>{userDetails.posts_count} Posts</p>
              <p style={{ marginRight: 20 }}>{userDetails.followers_count} Followers</p>
              <p>{userDetails.following_count} Following</p>
            </Row>
          </div>
        </Row>
        <hr />
        <div className='posts__container'>
          {posts.length > 0 ? (
            posts.map((post, index) =>
              <MyCard key={index} Post={post} />
            )
          ) : (
              // console.log('not defined')
              <h1 style={{ textAlign: "center" }}>You Have No Posts</h1>
            )
          }
        </div>
      </div>
    </div>
  )

}

export default UserProfile;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = {
  screen: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 200,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
};