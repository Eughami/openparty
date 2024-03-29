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
  setCurrentUserPostViewing,
} from '../redux/user/user.actions';
import RelatedPosts from './relatedPosts';

interface postIdInterface {
  postId: string;
}
interface ViewPostProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserPostViewing?: (uid: Post | null) => void;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  post: PostInterface;
  fullPage: boolean;
  postUrl?: string;
  commentId?: string;
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
  const { xs } = useBreakpoint();

  const {
    currentUser,
    currentUserInfo,
    currentUserToken,
    fullPage,
    setCurrentUserPostViewing,
    commentId,
  } = props;

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

  // scroll to comment if user is coming from notification
  function scrollToTargetAdjusted(elementId: string) {
    var element = document.getElementById(elementId);
    // skip if element is not found
    if (!element) return;

    element.scrollIntoView(false);

    // make the background blinking with some css

    element.style.backgroundColor = '#fc9';
    setTimeout(() => (element!.style.backgroundColor = 'transparent'), 500);
    setTimeout(() => (element!.style.backgroundColor = '#fc9'), 1000);
    setTimeout(() => (element!.style.backgroundColor = 'transparent'), 1500);
  }

  const fetchPost = async (postId: string, userId: string, token: string) => {
    setLoadingPost(true);
    let fvPostsSub: any;
    fvPostsSub = firebase
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
              if (commentId) {
                scrollToTargetAdjusted(commentId);
              }
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
    return () => {
      if (fvPostsSub) {
        firebase
          .database()
          .ref('Postsv2')
          .child(userId)
          .child(postId)
          .off('value', fvPostsSub);
      }
    };
  };

  useEffect(() => {
    if (post) {
      document.title = `@${post.user.username} • "${post.caption}"`;
      setCurrentUserPostViewing!(post);
      // return;
    }
    //clean up
    return () => setCurrentUserPostViewing!(null);
  }, [post, setCurrentUserPostViewing]);

  useEffect(() => {
    const getPost = async () => {
      await Axios.post(
        `${API_BASE_URL}${GET_ONE_POST}`,
        {
          postId: props.postUrl ? props.postUrl : id,
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
        <>
          {/* TODO: Find a way of dealing with square images. i.e ratio ~ 1 */}
          <Row justify="center" align="middle" className="full__page__post">
            <Col
              lg={24}
              md={aspectRation > 1.15 ? 0 : 24}
              sm={0}
              xs={0}
              style={{ height: '50px', width: '100%' }}
            />
            <Col
              className="full__post__left__container"
              xxl={aspectRation > 0.85 ? (aspectRation > 1.15 ? 9 : 6) : 7}
              xl={aspectRation > 0.85 ? (aspectRation > 1.15 ? 10 : 8) : 8}
              lg={aspectRation > 0.85 ? (aspectRation > 1.15 ? 11 : 9) : 9}
              md={aspectRation > 0.85 ? (aspectRation > 1.15 ? 18 : 12) : 12}
              sm={aspectRation > 0.85 ? (aspectRation > 1.15 ? 20 : 15) : 18}
              xs={24}
            >
              <Col lg={0} md={aspectRation > 1.15 ? 24 : 0} sm={24}>
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
                          minHeight: xs
                            ? 'auto'
                            : aspectRation > 0.85
                            ? aspectRation > 1.15
                              ? 400
                              : 500
                            : 600,
                          height: xs
                            ? 'auto'
                            : initImageDim.height / 2 <= 400
                            ? 400
                            : initImageDim.height / 2,
                          maxHeight: 600,
                          width: '100%',
                        }}
                        onClick={() => history.push(`/post/${post.id}`)}
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
              xxl={aspectRation > 0.85 ? (aspectRation > 1.15 ? 7 : 5) : 6}
              xl={aspectRation > 0.85 ? (aspectRation > 1.15 ? 8 : 7) : 8}
              lg={aspectRation > 0.85 ? (aspectRation > 1.15 ? 9 : 7) : 9}
              md={aspectRation > 0.85 ? (aspectRation > 1.15 ? 18 : 11) : 12}
              sm={aspectRation > 0.85 ? (aspectRation > 1.15 ? 20 : 15) : 18}
              xs={24}
            >
              {/* hide on small size screen */}
              <Col lg={24} md={aspectRation > 1.15 ? 0 : 24} sm={0} xs={0}>
                <div className="full__post__avatar__container">
                  <PostUser currentUser={currentUser!} post={post!} />
                </div>
                <div
                  className="full__post__comments__container"
                  style={{
                    minHeight:
                      aspectRation > 0.85
                        ? aspectRation > 1.15
                          ? 160
                          : 260
                        : 360,
                    height:
                      initImageDim.height / 2 <= 400
                        ? 160
                        : initImageDim.height / 2 - 240,
                    maxHeight: 360,
                  }}
                >
                  <PerfectScrollbar>
                    <PostComments
                      currentUserId={currentUserInfo?.uid}
                      token={currentUserToken}
                      full={true}
                      post={post!}
                    />
                  </PerfectScrollbar>
                </div>
                <div className="full__page__post__actions__container">
                  <PerfectScrollbar>
                    <Row justify="start" align="top">
                      <Col span={24}>
                        <PostActions currentUser={currentUser!} post={post} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <PostLikes post={post} />
                      </Col>
                      <Col span={24}>
                        <PostTags post={post} />
                      </Col>
                      <Row>
                        <PostCaption post={post} />
                      </Row>
                    </Row>
                  </PerfectScrollbar>
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
              <Col lg={0} md={aspectRation > 1.15 ? 24 : 0} sm={24}>
                <div style={{ height: '100%', padding: 10 }}>
                  <Row justify="start" align="top">
                    <Col span={24}>
                      <PostActions currentUser={currentUser!} post={post} />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <PostLikes post={post} />
                    </Col>
                    <Col span={24}>
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
                <div className="full__post__comments__container">
                  <PostComments
                    currentUserId={currentUserInfo?.uid}
                    token={currentUserToken}
                    full={false}
                    post={post!}
                  />
                </div>
              </Col>

              <Col
                lg={24}
                md={aspectRation > 1.15 ? 0 : 24}
                sm={0}
                xs={0}
              ></Col>
            </Col>
          </Row>
          <Row justify="center">
            <Col
              xl={18}
              lg={20}
              md={24}
              sm={0}
              xs={0}
              style={{ height: 400, marginTop: 50, marginBottom: 50 }}
            >
              <Divider orientation="left">
                More from{' '}
                <a
                  href={`/${post.user.username}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <strong>{post.user.username}</strong>
                </a>
              </Divider>
              {morePosts.length > 0 && <RelatedPosts posts={morePosts} />}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
    commentId: state.user.commentId,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
    setCurrentUserPostViewing: (post: Post | null) =>
      dispatch(setCurrentUserPostViewing(post)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPost);
