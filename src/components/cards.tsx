import React,{useEffect, useState} from 'react';
import MyCard from './card';
import firebase from "firebase";

const Cards = () => {


  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  const onChange = (checked: boolean) => {
    setLoading(!loading)
  };

  useEffect( () => {
    
    firebase.database().ref("Posts").on("value", (snapshot)=>{
      if (snapshot.exists()) {
        console.log("SNAP ", snapshot.val());
        
        let temp: any = [];
        snapshot.forEach(post => {
          temp.push(post.val())
        })
        setPosts(temp);
        console.log(temp);
        
        temp = [];
      }
    })
  },[])

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
      {posts !== null ? (
        posts.map((post, index) =>
          <MyCard key={index} Post={post}/>
        )
      ) :(
        // console.log('not defined')
        <span>No Posts</span>
      ) 
      }
    </div>
  );
};

export default Cards;