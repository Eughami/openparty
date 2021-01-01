import React, { useEffect, useState } from 'react';
import {
  setCurrentUserListener,
  setCurrentUserToken,
  setCurrentUserRootDatabaseListener,
  setCurrentUserEligiblePosts,
} from '../redux/user/user.actions';
import { Post, RegistrationObject } from './interfaces/user.interface';
import MyPost from './post/post';
import { connect } from 'react-redux';
import axios from 'axios';
import bluebird from 'bluebird';
import firebase from 'firebase';
import { BackTop, Col, List, Row, Skeleton, Tag } from 'antd';
import {
  API_BASE_URL,
  GET_POPULAR_TAGS,
  GET_POST_TAGS_ENDPOINT,
} from '../service/api';
import { getPostTagColor } from './post/post.actions';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
const abbreviate = require('number-abbreviate');

interface ITagsProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>;
  setCurrentUserToken?: (currentUser: firebase.User) => Promise<string | null>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  match?: any;
  currentUserEligiblePosts?: Array<any>;
}

const Tags = (props: ITagsProps) => {
  console.log('Tag Props: ', props);
  const { currentUser, currentUserToken } = props;
  const { tag } = props.match.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Array<Post> | null>([]);
  const [popularTags, setPopularTags] = useState<
    Array<{ count: number; posts: { [key: string]: string }; tag: string }>
  >([]);

  useEffect(() => {
    document.title = `Open Party • Tags • ${tag} 👓`;
  }, [tag]);

  useEffect(() => {
    const getTags = async () => {
      if (!currentUser) return;

      if (!currentUserToken) {
        props.setCurrentUserToken!(currentUser);
        return;
      }

      // const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/tags-post", {
      const result = await axios.post(
        `${API_BASE_URL}${GET_POST_TAGS_ENDPOINT}`,
        {
          tag,
        },
        {
          headers: {
            authorization: `Bearer ${currentUserToken}`,
          },
        }
      );

      console.log(result.data);

      if (result.data.success) {
        if (result.data.uFP.length === 0) {
          setLoading(false);
          setPosts(null);
          return;
        }
        let temp: any = {};

        await bluebird
          .map(
            result.data.uFP,
            async (obj: { uidRef: string; postRef: string }, index: number) => {
              firebase
                .database()
                .ref('Postsv2')
                .child(obj.uidRef)
                .child(obj.postRef)
                .on(
                  'value',
                  async (ssh) => {
                    temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                    temp[`${obj.uidRef + obj.postRef}`].key = `${
                      obj.uidRef + obj.postRef
                    }`;

                    if (localStorage.getItem('tagPostsSet')) {
                      temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                      temp[`${obj.uidRef + obj.postRef}`].key = `${
                        obj.uidRef + obj.postRef
                      }`;

                      setPosts(
                        Object.values(temp).sort(
                          (s1: any, s2: any) =>
                            s2.date_of_post - s1.date_of_post
                        ) as any[]
                      );
                      setLoading(false);
                    }

                    if (
                      index === result.data.uFP.length - 1 &&
                      !localStorage.getItem('tagPostsSet')
                    ) {
                      console.log('IN COND: ', Object.values(temp));

                      setPosts(
                        Object.values(temp).sort(
                          (s1: any, s2: any) =>
                            s2.date_of_post - s1.date_of_post
                        ) as any[]
                      );

                      console.log('@POSTS DEBUG: ', Object.values(temp));

                      localStorage.setItem('tagPostsSet', 'true');
                      setLoading(false);
                    }
                  },
                  (error: any) => {
                    console.log('@SSH ERROR: ', error);
                    if (error.code) {
                      if (error.code === 'PERMISSION_DENIED') {
                        // delete temp[lastKey];
                        // setPosts(Object.values(temp));
                        //TODO: Maybe show 'post not available message'?
                      }
                    }
                  }
                );
            },
            { concurrency: result.data.uFP.length }
          )
          .then(() => {
            console.log('DONE MAPPING');
          });

        await axios
          .get(`${API_BASE_URL}${GET_POPULAR_TAGS}`, {
            headers: {
              authorization: `Bearer ${currentUserToken}`,
            },
          })
          .then((popularTagsRes) => {
            console.log('@POPULAR TAGS RES: ', popularTagsRes.data);

            setPopularTags(popularTagsRes.data);
          });
      }
    };

    getTags();

    // return () => localStorage.removeItem("otherUserProfileLoaded")
  }, [tag, currentUser, currentUserToken, props.setCurrentUserToken]);

  if (loading) {
    return (
      <Col
        xs={{ span: 22, offset: 1 }}
        lg={{ span: 16, offset: 2 }}
        xl={{ span: 10, offset: 4 }}
        span={12}
      >
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Col>
    );
  }

  return (
    <Row justify="center">
      <Col
        span={12}
        md={{ span: 16, offset: 0 }}
        xs={{ span: 24, offset: 0 }}
        xl={10}
      >
        <>
          <BackTop />

          <Col style={{ paddingBottom: 20 }} md={0} sm={24} xs={24}>
            <div
              style={{
                overflow: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {popularTags.map(({ tag, count }, index) => (
                <Link
                  key={index}
                  to={{
                    pathname: `/t/${tag}`,
                  }}
                  onClick={() => setLoading(true)}
                >
                  <Tag
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      padding: 5,
                      textDecoration: 'none',
                      fontWeight: 600,
                      margin: 4,
                      width: '30%',
                    }}
                    color={getPostTagColor(tag as any)}
                  >
                    <span>
                      {index < 1 ? (
                        <>
                          {`🔥 #${
                            tag.length > 10 ? tag.substring(0, 10) + '...' : tag
                          }`}{' '}
                          <p
                            style={{ color: 'rgba(var(--f52,142,142,142),1)' }}
                          >
                            • {abbreviate(count, 1)} Posts
                          </p>
                        </>
                      ) : (
                        <>
                          {`#${
                            tag.length > 10 ? tag.substring(0, 10) + '...' : tag
                          }`}{' '}
                          <p
                            style={{ color: 'rgba(var(--f52,142,142,142),1)' }}
                          >
                            • {abbreviate(count, 1)} Posts
                          </p>
                        </>
                      )}
                    </span>
                  </Tag>
                </Link>
              ))}
            </div>
          </Col>

          {posts === null ? (
            <p style={{ textAlign: 'center' }}>
              No Open Post with that tag found
            </p>
          ) : (
            posts.map((val: any) => <MyPost key={val.key} post={val} />)
          )}
        </>
      </Col>
      <Col sm={0} xs={0} md={{ span: 4, offset: 1 }}>
        <div>
          {popularTags.map(({ tag, count }, index) => (
            <Link
              key={index}
              to={{
                pathname: `/t/${tag}`,
              }}
              onClick={() => setLoading(true)}
            >
              <Tag
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  padding: 5,
                  textDecoration: 'none',
                  fontWeight: 600,
                  margin: 4,
                  width: '100%',
                }}
                color={getPostTagColor(tag as any)}
              >
                <span>
                  {index < 1 ? (
                    <>
                      {`🔥 #${
                        tag.length > 10 ? tag.substring(0, 10) + '...' : tag
                      }`}{' '}
                      <p style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
                        • {abbreviate(count, 1)} Posts
                      </p>
                    </>
                  ) : (
                    <>
                      {`#${
                        tag.length > 10 ? tag.substring(0, 10) + '...' : tag
                      }`}{' '}
                      <p style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
                        • {abbreviate(count, 1)} Posts
                      </p>
                    </>
                  )}
                </span>
              </Tag>
            </Link>
          ))}
        </div>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
    currentUserEligiblePosts: state.user.currentUserEligiblePosts,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserToken: (currentUser: firebase.User) =>
      dispatch(setCurrentUserToken(currentUser)),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
    setCurrentUserEligiblePosts: (currentUser: firebase.User) =>
      dispatch(setCurrentUserEligiblePosts(currentUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
