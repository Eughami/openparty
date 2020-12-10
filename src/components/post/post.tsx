import React, { useEffect, useState } from 'react';
import './post.css';
import AsyncMention from '../mentions/mentions.component';
import { Row, Button, Col } from 'antd';
import { Comment, Post as PostInterface } from '../interfaces/user.interface';
import { connect } from 'react-redux';
import firebase from 'firebase';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../../components/interfaces/user.interface';
import { onPostComment } from './post.actions';
import { PostImages } from './components/post.component.images';
import { PostUser } from './components/post.component.user';
import { PostCaption } from './components/post.component.caption';
import { PostLikes } from './components/post.component.likes';
import { PostTags as PostTagsComponent } from './components/post.component.tags';
import { PostComments } from './components/post.component.comments';
import { PostActions } from './components/post.component.actions';
import { PostEventTime } from './components/post.component.event-time';
const probe = require('probe-image-size');
interface IPostProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  post: PostInterface;
  fullPage: boolean;
}

const Post = (props: IPostProps) => {
  console.log('POST.TSX PROPS: ', props.post.likes);
  const [postCommentLoading, setPostCommentLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<Comment>({
    comment: '',
    comments: [],
    id: '',
    likes: 0,
    timestamp: 0,
    user: { image_url: '', user_id: '', username: '' },
  });
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  useEffect(() => {
    var img = document.getElementById('fucking_image');
    //or however you get a handle to the IMG
    var width = img!.clientWidth;
    var height = img!.clientHeight;
    console.log('Image Dimension :', img, width, height);
    setImageHeight(height);
  }, []);
  props.post.likes = Object.keys(props.post.likes ? props.post.likes : {});

  const { image_url: avatar_url, username } = props.post.user;

  const { currentUser, currentUserInfo, currentUserToken, fullPage } = props;

  const resetCommentForm = () =>
    setComment({
      comment: '',
      comments: [],
      id: '',
      likes: 0,
      timestamp: 0,
      user: { image_url: '', user_id: '', username: '' },
    });

  const handleCommentChange = (value: string) => {
    if (value.length > 0) {
      setComment({
        comment: value,
        user: {
          user_id: currentUser ? currentUser.uid : '-user',
          image_url: avatar_url,
          username: currentUserInfo ? currentUserInfo.username : '-user',
        },
        comments: [],
        likes: 0,
        id: '', //generate new comment_id here,
        timestamp: 0,
      });
    } else {
      setComment({ ...comment, comment: '' });
    }
  };

  return (
    <>
      {console.log('Image Dimension :', imageHeight)}
      {fullPage ? (
        <div className="full__page__post">
          <div
            className="full__page__post__divider"
            style={{ height: imageHeight }}
          >
            <PostImages post={props.post} />
          </div>
          <div
            className="full__page__post__divider"
            style={{ height: imageHeight }}
          >
            <div className="full__post__avatar__container">
              <PostUser post={props.post} />
            </div>
            <div className="full__post__comments__container">
              <PerfectScrollbar>
                <PostComments post={props.post} full={true} />
              </PerfectScrollbar>
            </div>
            <div className="full__page__post__actions__container">
              <Row justify="start" align="top">
                <Col span={12}>
                  <PostActions currentUser={currentUser!} post={props.post} />
                </Col>
                <Col span={12}>
                  <PostEventTime post={props.post} />
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <PostLikes post={props.post} />
                </Col>
                <Col span={20}>
                  <PostTagsComponent post={props.post} />
                </Col>
                <Row>
                  <PostCaption post={props.post} />
                </Row>
              </Row>
            </div>
            <Row className="full__post__add__comment__container">
              <Row
                style={{ flex: 1, height: '100%' }}
                className="post__add__comment"
              >
                <AsyncMention
                  value={comment.comment}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                />
              </Row>
              <Button
                loading={postCommentLoading}
                onClick={() =>
                  onPostComment(
                    setPostCommentLoading,
                    currentUserInfo!,
                    props.post.id,
                    username,
                    comment,
                    currentUserToken!
                  ).finally(() => resetCommentForm())
                }
                disabled={comment.comment.length === 0}
                style={{ height: '100%' }}
              >
                Post
              </Button>
            </Row>
          </div>
        </div>
      ) : (
        <article className="Post">
          <PostUser post={props.post} />
          <PostImages post={props.post} />

          <div style={{ padding: '16px 16px' }}>
            <PostActions currentUser={currentUser!} post={props.post} />
            <PostEventTime post={props.post} />
            <PostLikes post={props.post} />
            <PostTagsComponent post={props.post} />
            <PostCaption post={props.post} />
            <br />
            {/* <p style={{ fontWeight: "bold" }}>Comments</p><br /> */}
            <PostComments post={props.post} full={false} />
          </div>
          <Row>
            <Row style={{ flex: 1 }} className="post__add__comment">
              <AsyncMention
                value={comment.comment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
              />
            </Row>
            <Button
              loading={postCommentLoading}
              onClick={() =>
                onPostComment(
                  setPostCommentLoading,
                  currentUserInfo!,
                  props.post.id,
                  username,
                  comment,
                  currentUserToken!
                ).finally(() => resetCommentForm())
              }
              disabled={comment.comment.length === 0}
              style={{ height: 50 }}
            >
              Post
            </Button>
          </Row>
        </article>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
