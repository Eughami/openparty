import React, { useEffect, useState } from 'react';
import { Avatar, Row  } from 'antd';
import firebase from "firebase";
import MyCard from '../components/card';
import { RegistrationObject } from './register';

interface IUserProps  {
    match: any,
    // user: {username: "jake", id: "0", followers_count: 55, following_count: 100, image_url: "https://api.adorable.io/avatars/285/abott@adorable", posts_count: 103}
}


const UserProfile = (props: IUserProps) => {
    console.log("UserProfile Props: ", props); 
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();
    const [userDetails, setUserDetails] = useState({});

    const { username } = props.match.params;
    const  user = {username: "jake", id: "userID0", followers_count: 55, following_count: 100, image_url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5d546e2c-9b74-474a-b611-52ca190f519c/dbell1k-30511769-cfe3-4f6a-bdac-fdef21cfa415.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNWQ1NDZlMmMtOWI3NC00NzRhLWI2MTEtNTJjYTE5MGY1MTljXC9kYmVsbDFrLTMwNTExNzY5LWNmZTMtNGY2YS1iZGFjLWZkZWYyMWNmYTQxNS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.8cv8qZPs0Ojw_gfzK6shb2JIl6JkQhMgixKVwC57Cy4", posts_count: 103};
    

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user); 
    })

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = firebase.database().ref("Users").child(currentUser!.uid).on("value", snapshot => {
        if(snapshot.exists()) {
            const user = snapshot.val();
            setUserDetails({
                followers_count: user.followers_count, 
                following_count: user.following_count,  
            })
        }
        else {
            setPosts([]);
        }
    })

    return firebase.database().ref("Users").child("Posts").off("value", unsub);
  }, []);

    useEffect(() => {
        const unsub = firebase.database().ref("Users").child(currentUser!.uid).child("Posts").on("value", snapshot => {
            if(snapshot.exists()) {
                let temp_posts: any = [];
                snapshot.forEach(post => {
                    temp_posts.push(post.val()); 
                });
                setPosts(temp_posts);
                
                temp_posts = [];
            }
            else {
                setPosts([]);
            }
        })

        return firebase.database().ref("Users").child("Posts").off("value", unsub);
    }, [])
   
    return (  

        <div>
            <div style={{marginLeft: "20%", marginRight: "20%", marginTop: "5%"}}>
                <Row style={{alignItems: "center"}}>
                    <Avatar
                        src={user.image_url}
                        size={150}
                    />
                    <div style={{marginLeft: 50}}>
                        <h1 style={{ marginBottom: 5, marginTop: 15, fontWeight: "bold",}}>
                            {username}
                        </h1>
                        <Row style={{justifyContent: "space-between", alignItems: "center"}}>
                            <p style={{marginRight: 20}}>{user.posts_count} Posts</p>
                            <p style={{marginRight: 20}}>{user.followers_count} Followers</p>
                            <p>{user.following_count} Following</p>
                        </Row>
                    </div>
                </Row>
                <hr/>
                <div className='posts__container'>
                {posts !== null ? (
                    posts.map((post, index) =>
                    <MyCard key={index} Post={post}/>
                    )
                ) :(
                    // console.log('not defined')
                    <span>You Have No Posts</span>
                ) 
                }
                </div>
            </div>
        </div>
    )

}

export default UserProfile;

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