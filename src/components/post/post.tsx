import React, { useEffect, useState } from 'react';
import './post.css';
import AsyncMention from '../mentions/mentions.component';
import {
  Input,
  Row,
  Form,
  Button,
  Avatar,
  Tag,
  message,
  Tooltip,
  Carousel,
  Col,
} from 'antd';
import {
  ShareAltOutlined,
  HeartTwoTone,
  CommentOutlined,
  LockTwoTone,
} from '@ant-design/icons';
import {
  Comment,
  Post as PostInterface,
  PostTags,
} from '../interfaces/user.interface';
import TimeAgo from 'react-timeago';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';

import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../../components/interfaces/user.interface';
import { Link } from 'react-router-dom';
import { ADD_COMMENT_ENDPOINT, API_BASE_URL } from '../../service/api';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import ViewComment from '../viewComment';

interface IPostProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  post: PostInterface;
  fullPage: boolean;
}

/**
 * Make a unique id for a comment or whatever we want
 *
 * @deprecated We now use the database auto id instead
 */
export const makeId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const Post = (props: IPostProps) => {
  console.log('POST.TSX PROPS: ', props.post.likes);
  // const { post } = props;
  const [postCommentLoading, setPostCommentLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<Comment>({
    comment: '',
    comments: [],
    id: '',
    likes: 0,
    timestamp: 0,
    user: { image_url: '', user_id: '', username: '' },
  });
  // const [userLikePost, setUserLikesPost] = useState<boolean>(false);

  props.post.likes = Object.keys(props.post.likes ? props.post.likes : {});

  const {
    uid: user_id,
    likes,
    image_url,
    caption,
    comments,
    users_showing_up,
    date_of_event,
    date_of_post,
    tags,
    id: post_id,
    privacy,
  } = props.post;

  const { image_url: avatar_url, username } = props.post.user;

  const { currentUser, currentUserInfo, currentUserToken } = props;

  const [userLikePost, setUserLikePost] = useState<boolean>(
    props.post.likes.indexOf(currentUser?.uid!) !== -1
  );

  const resetCommentForm = () =>
    setComment({
      comment: '',
      comments: [],
      id: '',
      likes: 0,
      timestamp: 0,
      user: { image_url: '', user_id: '', username: '' },
    });

  const onPostComment = async () => {
    console.log('Finish: ', props.post);
    if (!currentUserInfo)
      return alert("We're having trouble posting your comment. Please wait...");

    setPostCommentLoading(true);

    const result = await axios.post(
      // 'http://localhost:5000/openpaarty/us-central1/api/v1/posts/add-comment',
      `${API_BASE_URL}${ADD_COMMENT_ENDPOINT}`,
      {
        postId: post_id,
        user: {
          username: currentUserInfo?.username,
          image_url: currentUserInfo?.image_url,
        },
        targetUsername: username,
        comment: comment.comment,
      },
      {
        headers: {
          authorization: `Bearer ${currentUserToken}`,
        },
      }
    );

    console.log('@ADD COMMENT RESULT: ', result);

    setPostCommentLoading(false);
    resetCommentForm();
    if (result.status !== 201) {
      message.error('Your comment could not be added at this time.');
    }
  };

  const getPostTagColor = (tag: PostTags): string => {
    switch (tag) {
      case PostTags.BEACH_PARTY:
        return 'magenta';
      case PostTags.COCAINE_PARTY:
        return 'processing';
      case PostTags.DRUG_PARTY:
        return 'red';
      default:
        return 'green';
    }
  };

  const handleCommentChange = (value: string) => {
    // event.preventDefault();
    // const { value } = event.target;
    console.log('COMM V: ', value);

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
        id: makeId(26), //generate new comment_id here,
        timestamp: 0,
      });
    } else {
      setComment({ ...comment, comment: '' });
    }
  };

  // useEffect(() => {
  //     setUserLikePost(props.post.likes.indexOf(currentUser?.uid!) !== -1)

  // }, [props.post.likes, currentUser])

  //TODO: Maybe to make things appear faster, we can fake increase/decrease the
  //number of likes-- before posting to our endpoint. We can catch any errors afterwards and
  // act appropriately
  const handlePostLike = async () => {
    if (userLikePost) {
      await firebase
        .database()
        .ref('Postsv2')
        .child(user_id)
        .child(post_id)
        .child('likes')
        .child(currentUser?.uid!)
        .remove();

      message.success('You dislike this post');

      setUserLikePost(false);

      // delete props.post.likes[currentUser?.uid! as any];

      // await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/unlike-post", {
      //     id: post_id,
      //     targetUsername: username
      // }, {
      //     headers: {
      //         authorization: `Bearer ${currentUserToken}`
      //     }
      // });
    } else {
      await firebase
        .database()
        .ref('Postsv2')
        .child(user_id)
        .child(post_id)
        .child('likes')
        .child(currentUser?.uid!)
        .set(currentUser?.uid!);

      // await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/like-post", {
      //     id: post_id,
      //     targetUsername: username,
      // }, {
      //     headers: {
      //         authorization: `Bearer ${currentUserToken}`
      //     }
      // });

      setUserLikePost(true);

      message.success('You 💖 this post');
    }
  };

  return props.fullPage ? (
    <div className="full__page__post">
      {console.log('full page View')}
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <div className="full__page__post__divider">
          <Carousel dotPosition="top">
            {image_url?.map((url, idx) => (
              <div key={idx}>
                {/* Caroussel is shit and couldn't made that shit responsive through css
                  but do we really need it ?
                */}
                <img alt={caption} src={url} width="100%" height="600px" />
              </div>
            ))}
          </Carousel>
        </div>
        {/* <div className="full__page__post__divider">
          {image_url && <img alt="" src={image_url[1]} />}
        </div> */}
        <div className="full__page__post__divider avatar__comment__container">
          <Row
            justify="start"
            align="middle"
            className="full__post__avatar__container"
          >
            <Avatar alt="user Avatar" src={avatar_url} size={64} />
            <div className="Post-user-nickname">
              <Link
                to={{
                  pathname: `/${username}`,
                }}
              >
                <span> {username} </span>
              </Link>
            </div>
          </Row>
          <Row className="full__post__comments__container">
            <PerfectScrollbar>
              {comments &&
                Object.values(comments).map(
                  (comment: Comment, index: number) => (
                    <Row justify="start" key={index}>
                      <ViewComment comment={comment} />
                    </Row>
                  )
                )}
            </PerfectScrollbar>
          </Row>
          <Row className="full__post__add__comment__container">
            <Row style={{ flex: 1 }} className="post__add__comment">
              <AsyncMention
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                value={comment.comment}
              />
            </Row>
            <Button
              loading={postCommentLoading}
              onClick={onPostComment}
              disabled={comment.comment.length === 0}
              style={{ height: 50 }}
            >
              Post
            </Button>
          </Row>
        </div>
      </Row>
    </div>
  ) : (
    <article className="Post">
      <header>
        <div className="Post-user">
          <div className="Post-user-avatar">
            <img src={avatar_url} alt={username} />
          </div>
          <div className="Post-user-nickname">
            <Link
              to={{
                pathname: `/${username}`,
              }}
            >
              <span> {username} </span>
            </Link>
          </div>
          <span style={{ marginLeft: '22%', fontWeight: 'bold' }}>
            <TimeAgo
              live
              date={`${
                date_of_post ? new Date(date_of_post).toISOString() : ''
              }`}
            />
          </span>
          {(privacy as any) === 'hard-closed' && (
            <Tooltip title="Only you can see this post 🙈 ">
              <span
                style={{
                  fontSize: '25px',
                  marginLeft: '35%',
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <LockTwoTone twoToneColor="#eb2f96" />
              </span>
            </Tooltip>
          )}
        </div>
      </header>
      <div className="Post-image">
        <div className="Post-image-bg">
          {/* How to handle posts w/out images?? */}
          <Carousel adaptiveHeight swipeToSlide touchMove dotPosition="top">
            {image_url?.map((url, idx) => (
              <div key={idx}>
                <img alt={caption} src={url} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <div className="Post-caption">
        <Row className="post__clikes__and__comments" align="middle">
          <span style={{ fontSize: '25px' }}>
            <HeartTwoTone
              onClick={handlePostLike}
              twoToneColor={userLikePost ? '#eb2f96' : '#ccc'}
            />
          </span>
          <span style={{ fontSize: '25px' }}>
            <CommentOutlined />
          </span>
          <span style={{ fontSize: '25px' }}>
            <ShareAltOutlined />
          </span>
        </Row>
        {date_of_event && (
          <p>
            Event on{' '}
            <TimeAgo
              live
              date={`${new Date(date_of_event * 1000).toISOString()}`}
            />{' '}
          </p>
        )}
        <Row style={{}} align="middle">
          <p style={{ textAlign: 'left', fontWeight: 'bold' }}>
            {' '}
            {likes.length} {likes.length <= 1 ? 'like' : 'likes'}
          </p>
        </Row>
        <Row
          style={{ marginBottom: 10 }}
          className="post__clikes__and__comments"
          align="middle"
        >
          {tags && (
            <Tooltip title="Click to view posts with this tags">
              {tags &&
                tags.map((tag: PostTags, index: number) => (
                  <Tag color={getPostTagColor(tag)} key={index}>
                    <Link
                      to={{
                        pathname: `/t/${tag}`,
                      }}
                    >
                      {tag}
                    </Link>{' '}
                  </Tag>
                ))}
            </Tooltip>
          )}
        </Row>
        <strong>{username}</strong> {caption}
        <br />
        {comments &&
          Object.values(comments).map((comment: Comment, index: number) => (
            <Row style={{ alignContent: 'center' }} key={index}>
              <Link
                to={{
                  pathname: `/${comment.user.username}`,
                }}
              >
                <span style={{ fontWeight: 'bold' }}>
                  {comment.user.username}{' '}
                </span>
              </Link>

              <span style={{ marginLeft: 10 }}>{comment.comment}</span>
              <br />
            </Row>
          ))}
      </div>
      <Row>
        <Row style={{ flex: 1 }} className="post__add__comment">
          <AsyncMention
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            value={comment.comment}
          />
        </Row>
        <Button
          loading={postCommentLoading}
          onClick={onPostComment}
          disabled={comment.comment.length === 0}
          style={{ height: 50 }}
        >
          Post
        </Button>
      </Row>
    </article>
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
