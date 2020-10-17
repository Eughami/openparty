import React,{useEffect, useState} from 'react';
import MyCard from './card';

const Cards = () => {


  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  const onChange = (checked: boolean) => {
    setLoading(!loading)
  };

  useEffect( () => {
    fetch('http://localhost:7896')
    .then(response => response.json())
    .then(responseJSON =>{
      console.log(responseJSON)
      setPosts(responseJSON)
    })
    .catch(e => console.log(e))
  },[])
  
  return (
    <div className='posts__container'>
      {posts !== null ? (
        posts.map(post =>
          <MyCard Post={post}/>
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