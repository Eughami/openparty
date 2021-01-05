import React, { useEffect, useState } from 'react';
import MyPost from './post';
import firebase from 'firebase';
import {
  Comment,
  Post,
  RegistrationObject,
} from '../interfaces/user.interface';
import { Col, Skeleton, BackTop, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import {
  setCurrentUserEligiblePosts,
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import bluebird from 'bluebird';
import Axios from 'axios';
import { API_BASE_URL, GET_POPULAR_USERS } from '../../service/api';
import UserSuggestions from '../userSuggestions';
import { FloatingButton, Item } from 'react-floating-button';

interface IPostsProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  fromProfile?: boolean;
  currentUserEligiblePosts?: Array<any>;
  currentUserToken?: string;
}

/**
 * Assign posts object and return an array of posts
 * @param posts the postsRef pointing to the database node
 * @param user optional user object to be with the post
 * @returns Array of Posts
 * @deprecated We now make request to our server
 */

export const awaitFillPosts = async (
  posts: Array<firebase.database.DataSnapshot>,
  user?: RegistrationObject
): Promise<Array<Post>> => {
  if (user) {
    let temp: Array<Post> = [];

    console.log('GETTING ALL POSTS... ', posts.length);
    for (let i = 0; i < posts.length; i++) {
      temp.push({
        caption: posts[i].val().caption,
        user: {
          image_url: user.image_url,
          username: user.username,
        },
        likes: posts[i].val().likes,
        privacy: posts[i].val().privacy,
        uid: user.uid,
        image_url: posts[i].val().image_url,
        tags: posts[i].val().tags,
        id: posts[i].key!,
      });
      console.log('INNER COMMENT: ', posts[i].val());
      if (posts[i].val().comments) {
        const commentKeys = Object.keys(posts[i].val().comments);
        let thisCommentArray: Array<Comment> = [];

        commentKeys.map((commentKey: string) => {
          const thisComment: Comment = posts[i].val().comments[commentKey];
          return thisCommentArray.push(thisComment);
        });

        // console.log("INNER COMMENT: ", thisCommentArray);

        temp[i].comments = thisCommentArray;

        thisCommentArray = [];
      }
    }

    return temp;
  }

  let temp: Array<Post> = [];
  // console.log("GETTING ALL POSTS... ");

  for (let i = 0; i < posts.length; i++) {
    await firebase
      .database()
      .ref('Users')
      .child(posts[i].val().uid)
      .once('value', (userPosts) => {
        if (userPosts.exists()) {
          // console.log("CHECKER: ", posts[i].val());
          temp.push({
            caption: posts[i].val().caption,
            user: {
              image_url: userPosts.val().image_url,
              username: userPosts.val().username,
            },
            likes: posts[i].val().likes,
            privacy: posts[i].val().privacy,
            uid: userPosts.key!,
            image_url: posts[i].val().image_url,
            tags: posts[i].val().tags,
            id: posts[i].key!,
          });
          if (posts[i].val().comments) {
            const commentKeys = Object.keys(posts[i].val().comments);
            // console.log("INNER COMMENT: ", commentKeys);
            let thisCommentArray: Array<Comment> = [];

            commentKeys.map((commentKey: string) => {
              const thisComment: Comment = posts[i].val().comments[commentKey];
              return thisCommentArray.push(thisComment);
            });

            // console.log("INNER COMMENT: ", thisCommentArray);

            temp[i].comments = thisCommentArray;

            thisCommentArray = [];
          }
        }
      });
  }

  return temp;
};

const Posts = (props: IPostsProps) => {
  const { currentUser, currentUserEligiblePosts } = props;

  console.log('CARDS.TSX PROPS: ', props);

  const [loading, setLoading] = useState<boolean>(
    localStorage.getItem('postsSet') === null
  );
  const [posts, setPosts] = useState<Array<any>>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<RegistrationObject[]>(
    []
  );
  const [loadingRecommended, setLoadingRecommended] = useState<boolean>(false);
  const [shouldRefreshPost, setShouldRefreshPost] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUserEligiblePosts === null) {
      setLoading(false);
      getPopularUsers();
      return;
    }
    // if (localStorage.getItem('postsSet')) return;
    // if (currentUserEligiblePosts!.length === 0) {
    //     setLoading(false);
    //     return;
    // }
    const getEligible = async () => {
      let temp: any = {};
      await bluebird
        .map(
          currentUserEligiblePosts!,
          async (obj: { uidRef: string; postRef: string }, index: number) => {
            firebase
              .database()
              .ref('Postsv2')
              .child(obj.uidRef)
              .child(obj.postRef)
              .on(
                'value',
                async (ssh) => {
                  //No need to check post privacy again because all posts we have access to are here?
                  if (!ssh.exists()) {
                    return;
                  }
                  temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                  temp[`${obj.uidRef + obj.postRef}`].key = `${
                    obj.uidRef + obj.postRef
                  }`;

                  if (localStorage.getItem('postsSet')) {
                    console.log('@LOC STORR');

                    temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                    temp[`${obj.uidRef + obj.postRef}`].key = `${
                      obj.uidRef + obj.postRef
                    }`;

                    setPosts(
                      Object.values(temp).sort(
                        (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
                      )
                    );
                    setLoading(false);
                  }

                  if (
                    index === currentUserEligiblePosts!.length - 1 &&
                    !localStorage.getItem('postsSet')
                  ) {
                    setPosts(
                      Object.values(temp).sort(
                        (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
                      )
                    );

                    // console.log(
                    //   '@POSTS DEBUG: ',
                    //   Object.values(temp).sort(
                    //     (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
                    //   )
                    // );

                    // Object.values(temp).map((temp: any) => {
                    //     return console.log("THIS@TEMP: ", temp.date_of_post);

                    // })

                    localStorage.setItem('postsSet', 'true');

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
          { concurrency: currentUserEligiblePosts!.length }
        )
        .then(() => {
          console.log('DONE MAPPING');
          // setTimeout(() => {
          //     setLoading(false)

          // }, 1000);
          // setLoading(false)
        });

      // setTimeout(() => {
      //     setLoading(false)

      // }, 1000);
    };

    getEligible();
  }, [currentUser, currentUserEligiblePosts]);

  //Set listener for every hot notification update in user's updated post
  useEffect(() => {
    const un_sub = firebase
      .database()
      .ref('Notifications')
      .child(props.currentUser?.uid!)
      .child('HOT UPDATE')
      .on(
        'child_changed',
        (ssh, __prevSsh) => {
          if (ssh.exists()) {
            if (ssh.child('refresh_post').exists()) {
              setShouldRefreshPost(true);
            }
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

    return () =>
      firebase
        .database()
        .ref('Notifications')
        .child(props.currentUser?.uid!)
        .child('HOT UPDATE')
        .off('child_changed', un_sub);
  }, [props.currentUser]);

  // fetch mos popular users
  const getPopularUsers = async () => {
    setLoadingRecommended(true);
    await Axios.get(`${API_BASE_URL}${GET_POPULAR_USERS}`, {
      headers: {
        Authorization: `Bearer ${props.currentUserToken}`,
      },
    })
      .then((res) => {
        console.log('New popular endpoint', res.data);
        setLoadingRecommended(false);
        if (res.data === null) {
          return;
        }
        setSuggestedUsers(res.data);
        // setComments(res.data);
        // setPostExists(true);
        // setLoadingPost(false);
      })
      .catch((e) => {
        setLoadingRecommended(false);
        console.log('@GET POST ERROR: ', e);
        // setPostExists(false);
        // setLoadingPost(false);
      });
  };

  if (loading) {
    return (
      <Col offset={6} span={12}>
        {[1, 1, 1, 1].map((_, index) => (
          <Skeleton key={index} avatar active paragraph={{ rows: 4 }} />
        ))}
      </Col>
    );
  }

  if (currentUserEligiblePosts === null) {
    return (
      <div style={{ textAlign: 'center' }}>
        <img
          style={{ maxWidth: 200 }}
          alt="empty"
          src={require('../images/lonely.png')}
        />
        <br />
        No post to show here. Follow people to see their posts here.
        <br />
        {/* <p style={{ textAlign: 'left' }}> Popular suggestions </p> */}
        {loadingRecommended && (
          <Col offset={6} span={12}>
            {[1, 1, 1, 1].map((_, index) => (
              <Skeleton key={index} avatar active paragraph={{ rows: 4 }} />
            ))}
          </Col>
        )}
        {Object.keys(suggestedUsers).length > 0 && (
          <UserSuggestions users={suggestedUsers} />
        )}
      </div>
    );
  }

  return (
    <div className="posts__container">
      <BackTop />

      {shouldRefreshPost && (
        <Col
          offset={12}
          span={12}
          style={{ zIndex: 2, position: 'fixed', textAlign: 'center', top: 0 }}
        >
          <RedoOutlined
            onClick={() =>
              props.setCurrentUserEligiblePosts!(props.currentUser!)
            }
            size={25}
          />
        </Col>
      )}
      {posts.length > 0 &&
        posts.map((val) => <MyPost key={val.key} post={val} />)}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserEligiblePosts: state.user.currentUserEligiblePosts,
    currentUserToken: state.user.currentUserToken,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
    setCurrentUserEligiblePosts: (currentUser: firebase.User) =>
      dispatch(setCurrentUserEligiblePosts(currentUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
