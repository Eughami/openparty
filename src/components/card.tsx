import { Input, Row,Avatar } from 'antd';
import React from 'react';
import { ShareAltOutlined , HeartTwoTone, CommentOutlined  } from '@ant-design/icons';


type Comment = {
  user_id: string,
  comment: string,
  likes: number,
  id: string,
}

enum IAgeRatingEnum {
  "18+",
  "21+",
  "16+",
  "12+",
  //...
}

type Post = {
  user_id: string, //ID of the user owning the post
  location?: Map<number, number> //Lat & Lng of the location of the post
  likes: number,
  age_rating?: IAgeRatingEnum,
  image_url: string,
  caption: string,
  comments: Array<Comment>,
  users_showing_up: number, //Indicating how many users would be showing up to this event,
  date_of_post: Date,
  date_of_event: Date,
  user: {
    username: string,
    image_url: string
  }
}

type CardsProps = {
  Post: Post,
}




const MyCard = (CardProp: CardsProps) => {

  

  const {user_id,likes,image_url,caption,comments,users_showing_up,date_of_event,date_of_post} = CardProp.Post

  // const {image_url:avatar_url, username} = CardProp.Post.user

  return (
    <div className='post__container'>
      {/* <Row className='post__header' align='middle'>
        <Avatar 
          size='large' 
          icon={
            <img 
              alt='user avatar' 
              src={avatar_url} 
            />} 
          />
        <span>{username}</span>
      </Row> */}
      <Row className='post__image'>
        <img alt='' src={image_url} />
      </Row>
      <Row className='post__clikes__and__comments' align='middle'>
          <span style={{ fontSize: "25px" }}>  
            <HeartTwoTone twoToneColor="#eb2f96" />
          </span>
          <span style={{ fontSize: "25px" }}>
            <CommentOutlined />
          </span>
          <span style={{ fontSize: "25px" }}>
            <ShareAltOutlined />
          </span>
          {/* <span>Comments</span><br/>
          {comments ? (
            <>
              <span>{comments[0].user_id} </span>
              <span>{comments[0].comment}</span><br/>
            </>
          ): (
            <span>No Comment</span>
          )} */}
      </Row>
      <Row className='post__captions' align='middle'>
        <b>#_DONT_FORGET</b>&nbsp;&nbsp;{caption}
      </Row>
      <Row className='post__add__comment'>
        <Input placeholder="Add a Comment" />
      </Row>
    </div>
  );
};

export default MyCard;