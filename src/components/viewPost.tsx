import {
  Button,
  Col,
  Result,
  Row,
  Skeleton,
  Carousel,
  Grid,
  Divider,
} from 'antd';
import { RightCircleTwoTone, LeftCircleTwoTone } from '@ant-design/icons';
import Axios from 'axios';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  API_BASE_URL,
  GET_ONE_POST,
  PROBE_IMAGE_ENDPOINT,
  GET_MORE_POSTS_FROM_USER,
} from '../service/api';
import { Comment, Post as PostInterface } from './interfaces/user.interface';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { Post, RegistrationObject } from './interfaces/user.interface';
// import MyPost from './post/post';
// import { SPRITE_IMAGE_URL } from './profile/components/profile.posts.component';
// import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { PostUser } from './post/components/post.component.user';
import { PostActions } from './post/components/post.component.actions';
import { PostLikes } from './post/components/post.component.likes';
import { PostComments } from './post/components/post.component.comments';
import { PostCaption } from './post/components/post.component.caption';
import AsyncMention from './mentions/mentions.component';
import './post/post.css';
import { PostEventTime } from './post/components/post.component.event-time';
import { PostTags } from './post/components/post.component.tags';
import { onPostComment } from './post/post.actions';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../redux/user/user.actions';

interface postIdInterface {
  postId: string;
}
interface ViewPostProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  post: PostInterface;
  fullPage: boolean;
}

interface ProbeResult {
  width: number;
  height: number;
  type: string;
  mime: string;
  wUnits: string;
  hUnits: string;
  length: number;
  url: string;
}

const { useBreakpoint } = Grid;

// const handleDragStart = (e: any) => e.preventDefault();

const ViewPost = (props: ViewPostProps) => {
  const { postId: id }: postIdInterface = useParams();
  const [post, setPost] = useState<Post>();
  const [morePosts, setMorePost] = useState<Post[]>([]);
  const [postExists, setPostExists] = useState<boolean>(true);
  const [aspectRation, setAspectRatio] = useState<number>(0);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [initImageDim, setInitImageDim] = useState<ProbeResult>({
    width: 0,
    height: 0,
    type: '',
    mime: '',
    wUnits: '',
    hUnits: '',
    length: 0,
    url: '',
  });
  const [postCommentLoading, setPostCommentLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<Comment>({
    comment: '',
    comments: [],
    id: '',
    likes: 0,
    timestamp: 0,
    user: { image_url: '', user_id: '', username: '' },
  });

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
          image_url: post!.user.image_url,
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

  const fetchPost = async (postId: string, userId: string, token: string) => {
    setLoadingPost(true);
    firebase
      .database()
      .ref('Postsv2')
      .child(userId)
      .child(postId)
      .on(
        'value',
        async (ssh) => {
          if (ssh.exists()) {
            await Axios.post(
              `${API_BASE_URL}${PROBE_IMAGE_ENDPOINT}`,
              {
                imageUrl: ssh.val().image_url[0],
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).then((res) => {
              console.log('@IMAGE DIM: ', res.data);
              const { width, height } = res.data;
              console.log('@IMAGE DIM AspectRatio: ', width / height);

              setAspectRatio(width / height);

              setInitImageDim(res.data);
              setPost(ssh.val());
              setPostExists(true);
              setLoadingPost(false);
              Axios.post(
                `${API_BASE_URL}${GET_MORE_POSTS_FROM_USER}`,
                {
                  postId: id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${props.currentUserToken}`,
                  },
                }
              ).then((res) => {
                const morePosts = res.data as Post[];
                setMorePost(morePosts);
                console.log('@AXIOS MORE POSTS RES: ', morePosts);
              });
            });
          }
        },
        (e: any) => {
          console.log('@POST LISTENER DB ERROR: ', e);
          setLoadingPost(false);
          setPostExists(true);
        }
      );
  };

  useEffect(() => {
    if (post) {
      document.title = `@${post.user.username} • "${post.caption}"`;
      return;
    }
  }, [post]);

  useEffect(() => {
    const getPost = async () => {
      await Axios.post(
        `${API_BASE_URL}${GET_ONE_POST}`,
        {
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${props.currentUserToken}`,
          },
        }
      )
        .then((res) => {
          console.log('New endpoint', res.data);

          if (res.data === null) {
            setPostExists(false);
            setLoadingPost(false);
            return;
          }
          fetchPost(id, res.data, props.currentUserToken!).catch((e) => {
            console.log('@FETCH POST ERROR: ', e);
            setPostExists(false);
            setLoadingPost(false);
          });
        })
        .catch((e) => {
          console.log('@GET POST ERROR: ', e);
          setPostExists(false);
          setLoadingPost(false);
        });
    };
    getPost();
  }, [props.currentUserToken, id]);

  const { history } = props;

  if (loadingPost) {
    return (
      <Col offset={6} span={12} style={{ paddingTop: '100px' }}>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Col>
    );
  }

  if (!postExists) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the Post you visited does not exist."
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <>
      {post && (
        <Row justify="center" align="middle" className="full__page__post">
          <Col
            lg={24}
            md={aspectRation > 1 ? 0 : 24}
            sm={0}
            xs={0}
            style={{ height: '50px', width: '100%' }}
          />
          <Col
            className="full__post__left__container"
            xxl={aspectRation > 1 ? 9 : 5}
            xl={aspectRation > 1 ? 10 : 6}
            lg={aspectRation > 1 ? 11 : 8}
            md={aspectRation > 1 ? 18 : 9}
            sm={aspectRation > 1 ? 20 : 13}
            xs={24}
          >
            <Col lg={0} md={aspectRation > 1 ? 24 : 0} sm={24}>
              <div
                className="full__post__avatar__container"
                style={{ borderRight: '#f1e6e6 solid 1px' }}
              >
                <PostUser currentUser={currentUser!} post={post!} />
              </div>
            </Col>
            <div>
              <Carousel
                nextArrow={<RightCircleTwoTone twoToneColor="#ccc" />}
                prevArrow={<LeftCircleTwoTone twoToneColor="#ccc" />}
                arrows
              >
                {post.image_url?.map((url, index) => (
                  <div key={index}>
                    <img
                      style={{
                        objectFit: 'cover',
                        minHeight: aspectRation > 1 ? 400 : 600,
                        height:
                          initImageDim.height / 2 <= 400
                            ? 400
                            : initImageDim.height / 2,
                        maxHeight: 600,
                        width: '100%',
                      }}
                      // onClick={() => history.push(`/post/${post.id}`)}
                      alt={post.caption}
                      src={url}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </Col>
          <Col
            className="full__post__right__container"
            xxl={aspectRation > 1 ? 7 : 5}
            xl={aspectRation > 1 ? 8 : 6}
            lg={aspectRation > 1 ? 9 : 8}
            md={aspectRation > 1 ? 18 : 9}
            sm={aspectRation > 1 ? 20 : 13}
            xs={24}
          >
            {/* hide on small size screen */}
            <Col lg={24} md={aspectRation > 1 ? 0 : 24} sm={0} xs={0}>
              <div className="full__post__avatar__container">
                <PostUser currentUser={currentUser!} post={post!} />
              </div>
              <div
                className="full__post__comments__container"
                style={{
                  minHeight: aspectRation > 1 ? 160 : 360,
                  height:
                    initImageDim.height / 2 <= 400
                      ? 160
                      : initImageDim.height / 2 - 240,
                  maxHeight: 360,
                }}
              >
                <PerfectScrollbar>
                  <PostComments full={true} post={post!} />
                </PerfectScrollbar>
              </div>
              <div className="full__page__post__actions__container">
                <Row justify="start" align="top">
                  <Col span={14}>
                    <PostActions currentUser={currentUser!} post={post} />
                  </Col>
                  <Col span={10}>
                    <PostEventTime post={post} />
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <PostLikes post={post} />
                  </Col>
                  <Col span={20}>
                    <PostTags post={post} />
                  </Col>
                  <Row>
                    <PostCaption post={post} />
                  </Row>
                </Row>
              </div>
              <Row className="full__post__add__comment__container">
                <Col flex="auto">
                  <AsyncMention
                    border="none"
                    value={comment.comment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                  />
                </Col>
                <Col flex="50px">
                  <Button
                    loading={postCommentLoading}
                    onClick={() =>
                      onPostComment(
                        setPostCommentLoading,
                        currentUserInfo!,
                        post.id,
                        post.user.username,
                        comment,
                        currentUserToken!
                      ).finally(() => resetCommentForm())
                    }
                    disabled={comment.comment.length === 0}
                    style={{
                      height: '100%',
                      // background: 'transparent',
                      border: 'none',
                    }}
                  >
                    Post
                  </Button>
                </Col>
              </Row>
            </Col>
            {/* show on small size screen */}
            <Col lg={0} md={aspectRation > 1 ? 24 : 0} sm={24}>
              <div className="full__page__post__actions__container">
                <Row justify="start" align="top">
                  <Col span={12}>
                    <PostActions currentUser={currentUser!} post={post} />
                  </Col>
                  <Col span={12}>
                    <PostEventTime post={post} />
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <PostLikes post={post} />
                  </Col>
                  <Col span={20}>
                    <PostTags post={post} />
                  </Col>
                  <Row>
                    <PostCaption post={post} />
                  </Row>
                </Row>
              </div>
              <Row className="full__post__add__comment__container">
                <Col flex="auto">
                  <AsyncMention
                    value={comment.comment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                  />
                </Col>
                <Col flex="50px">
                  <Button
                    loading={postCommentLoading}
                    onClick={() =>
                      onPostComment(
                        setPostCommentLoading,
                        currentUserInfo!,
                        post.id,
                        post.user.username,
                        comment,
                        currentUserToken!
                      ).finally(() => resetCommentForm())
                    }
                    disabled={comment.comment.length === 0}
                    style={{
                      height: '100%',
                      // background: 'transparent',
                      border: 'none',
                    }}
                  >
                    Post
                  </Button>
                </Col>
              </Row>
              <div
                className="full__post__comments__container"
                style={{
                  minHeight: aspectRation > 1 ? 160 : 360,
                  height:
                    initImageDim.height / 2 <= 400
                      ? 160
                      : initImageDim.height / 2 - 240,
                  maxHeight: 360,
                }}
              >
                <PerfectScrollbar>
                  <PostComments full={true} post={post!} />
                </PerfectScrollbar>
              </div>
            </Col>
            <Col lg={24} md={aspectRation > 1 ? 0 : 24} sm={0} xs={0}></Col>
          </Col>
          {/* HIDE THIS IN MOBILE */}
          {/* <Col
            xxl={aspectRation > 1 ? 7 : 5}
            xl={aspectRation > 1 ? 8 : 6}
            lg={aspectRation > 1 ? 9 : 8}
            md={aspectRation > 1 ? 18 : 9}
            sm={aspectRation > 1 ? 20 : 13}
            xs={aspectRation > 1 ? 22 : 17}
          > */}
          {morePosts.length > 0 && (
            <>
              <Divider orientation="left">
                More Posts from {post.user.username}
              </Divider>
              <Row>
                {morePosts.map((morePost, index) => (
                  <Col
                    style={{ padding: 5 }}
                    key={index}
                    className="gutter-row"
                    xl={8}
                    md={12}
                    xs={24}
                  >
                    <img
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '50vh',
                      }}
                      src={morePost.image_url![0]}
                      alt={morePost.caption}
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}
          {/* </Col> */}
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewPost);
