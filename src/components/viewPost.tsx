import { Button, Col, Result, Row, Skeleton, Carousel, Grid } from 'antd';
import Axios from 'axios';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  API_BASE_URL,
  GET_ONE_POST,
  PROBE_IMAGE_ENDPOINT,
} from '../service/api';
import { Post } from './interfaces/user.interface';
// import MyPost from './post/post';
// import { SPRITE_IMAGE_URL } from './profile/components/profile.posts.component';
// import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { PostUser } from './post/components/post.component.user';
import { PostActions } from './post/components/post.component.actions';
import { PostLikes } from './post/components/post.component.likes';
import { PostTags } from './post/components/post.component.tags';
import { PostComments } from './post/components/post.component.comments';
import { PostCaption } from './post/components/post.component.caption';
import AsyncMention from './mentions/mentions.component';
import './post/post.css';

interface postIdInterface {
  postId: string;
}
interface ViewPostProps extends RouteComponentProps<any> {}
const ViewPost = (props: ViewPostProps) => {
  const { xl, md, xs, lg, sm, xxl } = useBreakpoint();
  console.log(useBreakpoint());

  const { postId: id }: postIdInterface = useParams();
  const [post, setPost] = useState<Post>();
  const [error, setError] = useState<any>(null);
  const [aspectRation, setAspectRatio] = useState<number>(0);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);
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
  // const [postImagesCarousel, setPostImagesCarousel] = useState<any[]>([]);

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
              console.log('@IMAGE DIM AspecRatio: ', width / height);

              setAspectRatio(width / height);
              // const images = ssh
              //   .val()
              //   .image_url.map((url: string, index: number) => (
              //     <img
              //       style={{
              //         objectFit: 'cover',
              //         height:
              //           initImageDim.height / 2 <= 400
              //             ? 500
              //             : initImageDim.height / 2,
              //          maxHeight: 500,
              //         width: '100%',
              //         aspectRatio: '3/2',
              //       }}
              //       key={index}
              //       src={url}
              //       alt={ssh.val().caption || 'img'}
              //       onDragStart={handleDragStart}
              //       className="img-carousel"
              //     />
              //   ));
              // setPostImagesCarousel(images);
              setInitImageDim(res.data);
              setPost(ssh.val());
              setLoadingPost(false);
            });
          }
        },
        (e: any) => console.log(e)
      );
  };
  useEffect(() => {
    props.currentUserToken !== null &&
      Axios.post(
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
            // setPostImagesCarousel([]);
            setError('Post Not Found');
            return;
          }
          fetchPost(id, res.data, props.currentUserToken!);
        })
        .catch((e) => setError('New endpoint Error :' + e));
    // fetchPost(id);
  }, [props.currentUserToken, id]);

  const { history } = props;
  return (
    <>
      {loadingPost && (
        <Col offset={6} span={12} style={{ paddingTop: '100px' }}>
          <Skeleton avatar active paragraph={{ rows: 4 }} />
        </Col>
      )}
      {error !== null && (
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
      )}

      {post && (
        <Row justify="center" align="middle">
          <Col
            // style={{ paddingLeft: 5 }}
            className="gutter-row"
            xxl={aspectRation > 1 ? 9 : 5}
            xl={aspectRation > 1 ? 10 : 6}
            lg={aspectRation > 1 ? 11 : 8}
            md={aspectRation > 1 ? 18 : 9}
            sm={aspectRation > 1 ? 20 : 13}
            xs={aspectRation > 1 ? 22 : 17}
          >
            <div className="full__post__avatar__container">
              <PostUser post={post!} />
            </div>
            <div>
              {/* <AliceCarousel
                autoHeight
                mouseTracking
                items={postImagesCarousel}
              /> */}
              <Carousel>
                {post.image_url?.map((url, index) => (
                  <div key={index}>
                    <img
                      style={{
                        objectFit: 'cover',
                        minHeight: aspectRation > 1 ? 400 : 500,
                        height:
                          initImageDim.height / 2 <= 400
                            ? 400
                            : initImageDim.height / 2,
                        maxHeight: 700,
                        width: '100%',
                        aspectRatio: '3/2',
                      }}
                      onClick={() => history.push(`/post/${post.id}`)}
                      alt={post.caption}
                      src={url}
                    />
                  </div>
                ))}
              </Carousel>
              {/* <img
                style={{
                  objectFit: 'cover',
                  height:
                    initImageDim.height / 2 <= 400
                      ? 500
                      : initImageDim.height / 2,
                  // minHeight: initImageDim.height,
                  maxHeight: 500,
                  width: '100%',
                  // width: initImageDim.width,
                  // height: '100%',
                  aspectRatio: '3/2',
                }}
                onClick={() => history.push(`/post/${post.id}`)}
                alt={post.caption}
                src={post.image_url![0]}
              /> */}
            </div>
            <Row justify="space-between" align="middle">
              <PostActions currentUser={props.currentUser!} post={post!} />
              <PostTags style={{}} post={post!} limitTags={3} />
            </Row>
            {/* <div style={{ marginTop: -20 }}> */}
            <PostLikes post={post!} />
            {/* </div> */}
          </Col>

          <Col
            // style={{ padding: -5 }}
            className="gutter-row"
            xxl={aspectRation > 1 ? 9 : 5}
            xl={aspectRation > 1 ? 10 : 6}
            lg={aspectRation > 1 ? 11 : 8}
            md={aspectRation > 1 ? 18 : 9}
            sm={aspectRation > 1 ? 20 : 13}
            xs={aspectRation > 1 ? 22 : 17}
          >
            {/* <PostCaption post={post!} /> */}
            <PostUser
              style={{
                visibility: 'hidden',
                display: (sm && !md) || xs || !sm ? 'none' : '',
              }}
              post={post!}
            />
            <div
              style={{
                minHeight: aspectRation > 1 ? 400 : 500,
                height:
                  initImageDim.height / 2 <= 400
                    ? 400
                    : initImageDim.height / 2,
                maxHeight: 700,
              }}
            >
              <PostComments full={!true} post={post!} />
            </div>
            <Row>
              <Row style={{ flex: 1 }} className="post__add__comment">
                <AsyncMention
                  value={'comment.comment'}
                  onChange={() => {}}
                  placeholder="Add a comment..."
                />
              </Row>
              <Button style={{ height: 50 }}>Post</Button>
            </Row>
          </Col>
        </Row>
      )}

      {/* {post && <MyPost post={post} fullPage={true} />} */}
    </>
  );
};

  const { history, match } = props;
  return (
    <>
      {post ? <MyPost post={post} fullPage={true} /> : <h1>404 NOT FOUND!</h1>}
    </>
  );
};

export default connect(mapStateToProps, null)(ViewPost);
