import { Input, Row, Avatar } from 'antd';
import React from 'react';
import { ShareAltOutlined, HeartTwoTone, CommentOutlined } from '@ant-design/icons';
import { Post } from '../constants/interfaces';

type CardsProps = {
  Post: Post,
};

const MyCard = (CardProp: CardsProps) => {

  const { user_id, likes, image_url, caption, comments, users_showing_up, date_of_event, date_of_post } = CardProp.Post

  const { image_url: avatar_url, username } = CardProp.Post.user

  return (
    <div className='post__container'>
      <Row className='post__header' align='middle'>
        <Avatar
          size='large'
          icon={
            <img
              alt='user avatar'
              src={avatar_url}
            />}
        />
        <span>{username}</span>
      </Row>
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
        <b>#_DON'T_FORGET</b>&nbsp;&nbsp;{caption}
      </Row>
      <Row className='post__add__comment'>
        <Input placeholder="Add a Comment" />
      </Row>
    </div>
  );
};

export default MyCard;