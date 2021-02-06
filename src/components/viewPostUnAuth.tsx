import {
  Button,
  Col,
  Result,
  Row,
  Skeleton,
  Carousel,
  Grid,
  Space,
} from 'antd';
import { RightCircleTwoTone, LeftCircleTwoTone } from '@ant-design/icons';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, RouteComponentProps } from 'react-router-dom';
import {
  GET_UNAUTH_POST,
  API_BASE_URL_OPEN,
  PROBE_IMAGE_OPEN_ENDPOINT,
} from '../service/api';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { Post } from './interfaces/user.interface';
import { PostUser } from './post/components/post.component.user';
import { PostActions } from './post/components/post.component.actions';
import { PostLikes } from './post/components/post.component.likes';
import { PostComments } from './post/components/post.component.comments';
import { PostCaption } from './post/components/post.component.caption';
import AsyncMention from './mentions/mentions.component';
import './post/post.css';
import { PostTags } from './post/components/post.component.tags';
import { useDispatch } from 'react-redux';

interface ChildComponentProps extends RouteComponentProps<any> {
  /* other props for ChildComponent */
}
interface postIdInterface {
  postId: string;
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

const ViewPostUnAuth = (props: ChildComponentProps) => {
  const dispatch = useDispatch();
  const { postId: id }: postIdInterface = useParams();
  const [post, setPost] = useState<Post>();
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

  const { xs } = useBreakpoint();

  useEffect(() => {
    if (post) {
      document.title = `@${post.user.username} • "${post.caption}"`;
    }
  }, [post]);

  useEffect(() => {
    const getPost = async () => {
      await Axios.post(`${API_BASE_URL_OPEN}${GET_UNAUTH_POST}`, {
        postId: id,
      })
        .then((res) => {
          console.log('New endpoint', res.data);

          if (res.data === null) {
            setPostExists(false);
            setLoadingPost(false);
            return;
          }
          Axios.post(`${API_BASE_URL_OPEN}${PROBE_IMAGE_OPEN_ENDPOINT}`, {
            imageUrl: res.data.image_url[0],
          })
            .then((response) => {
              const image = response.data;
              console.log('@IMAGE DIM: ', image);
              const { width, height } = image;
              console.log('@IMAGE DIM AspectRatio: ', width / height);

              setAspectRatio(width / height);

              setInitImageDim(image);
              setPost(res.data);
              setPostExists(true);
              setLoadingPost(false);
            })
            .catch((e) => {
              console.log('@GET Image Prob ERROR: ', e);
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
  }, []);

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
          <Button type="primary" onClick={() => window.location.replace('/')}>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Row
        align="middle"
        justify="center"
        style={{ width: '100%', height: 60 }}
      >
        <Space size="middle">
          <span>Join Us today</span>
          <Button
            type="primary"
            onClick={() => {
              props.history.push('/login');
              // clear RAL
              localStorage.removeItem('RAL');
            }}
          >
            Login
          </Button>
          <Button
            type="primary"
            onClick={() => {
              props.history.push('/register');

              // clear RAL
              localStorage.removeItem('RAL');
            }}
          >
            Join
          </Button>
        </Space>
      </Row>
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
                  onClick={() => {
                    dispatch({
                      type: 'SET_UNAUTH_LOGIN',
                      payload: true,
                    });
                    props.history.push('/login');
                  }}
                >
                  <PostUser post={post} />
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
              onClick={() => {
                dispatch({
                  type: 'SET_UNAUTH_LOGIN',
                  payload: true,
                });
                props.history.push('/login');
              }}
            >
              {/* hide on small size screen */}
              <Col lg={24} md={aspectRation > 1.15 ? 0 : 24} sm={0} xs={0}>
                <div className="full__post__avatar__container">
                  <PostUser post={post!} />
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
                    <PostComments full={true} post={post} />
                  </PerfectScrollbar>
                </div>
                <div className="full__page__post__actions__container">
                  <PerfectScrollbar>
                    <Row justify="start" align="top">
                      <Col span={24}>
                        <PostActions post={post} />
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
                      placeholder="Add a comment..."
                    />
                  </Col>
                  <Col flex="50px">
                    <Button
                      style={{
                        height: '100%',
                        // background: 'transparent',
                        border: 'none',
                      }}
                      disabled
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
                      <PostActions post={post} />
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
                    <AsyncMention placeholder="Add a comment..." />
                  </Col>
                  <Col flex="50px">
                    <Button
                      disabled
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
                  <PostComments full={false} post={post} />
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
        </>
      )}
    </>
  );
};

export default ViewPostUnAuth;
