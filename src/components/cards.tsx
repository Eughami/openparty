import React, { useEffect, useState } from 'react';
import MyCard from './card';
import firebase from "firebase";
import { Post } from '../constants/interfaces';

const Cards = () => {


  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Array<Post>>([])

  const onChange = (checked: boolean) => {
    setLoading(!loading)
  };

  useEffect(() => {

    if (firebase.auth().currentUser !== null) {
      firebase.database().ref("Posts").on("value", (snapshot) => {
        if (snapshot.exists()) {

          let temp: Array<Post> = [];
          let ttt: Array<firebase.database.DataSnapshot> = [];
          snapshot.forEach((post) => {
            if (post.val().privacy === "Public" || post.val().uid === firebase.auth().currentUser!.uid) {
              ttt.push(post);
            }
          })
          ttt.map(async (thisPost, index) => {
            await firebase.database().ref("Users").child(thisPost.val().uid).once("value", userPosts => {
              if (userPosts.exists()) {
                temp.push({
                  caption: thisPost.val().caption,
                  user: {
                    image_url: userPosts.val().image_url,
                    username: userPosts.val().username,
                  },
                  likes: thisPost.val().likes,
                  privacy: thisPost.val().privacy,
                  user_id: userPosts.key!,
                  image_url: thisPost.val().image_url,
                })
              }
            });

            if (index === ttt.length - 1) {

              setPosts(temp);
            }

          })

          temp = [];
        }
      })

    }
  }, [])

  // useEffect( () => {
  //   fetch('http://localhost:7896')
  //   .then(response => response.json())
  //   .then(responseJSON =>{
  //     console.log(responseJSON)
  //     setPosts(responseJSON)
  //   })
  //   .catch(e => console.log(e))
  // },[])

  return (
    <div className='posts__container'>
      {posts.length > 0 ? (
        posts.map((post, index) =>
          <MyCard key={index} Post={post} />
        )
      ) : (
          // console.log('not defined')
          <h1 style={{ textAlign: "center" }}>No Posts</h1>
        )
      }
    </div>
  );
};

export default Cards;