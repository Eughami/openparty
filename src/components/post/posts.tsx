import React, { useEffect, useState } from 'react';
import MyPost from './post';
import firebase from 'firebase';
import {
  Comment,
  Post,
  RegistrationObject,
} from '../interfaces/user.interface';
import { Col, Skeleton, BackTop, Button, Affix } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import {
  setCurrentUserEligiblePosts,
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserToken,
} from '../../redux/user/user.actions';
import bluebird from 'bluebird';
import Axios from 'axios';
import { API_BASE_URL, GET_POPULAR_USERS } from '../../service/api';
import UserSuggestions from '../userSuggestions';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

interface IPostsProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>;
  currentUser?: firebase.User;
  setCurrentUserToken?: (currentUser: firebase.User) => Promise<string | null>;

  currentUserInfo?: RegistrationObject;
  fromProfile?: boolean;
  currentUserEligiblePosts?: Array<any>;
  currentUserActualEligiblePosts?: Array<any>;
  currentUserToken?: string;
  currentUserActualEligiblePostsLoading?: boolean;
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

const getPopularUsers = async (
  currentUserToken: string
): Promise<RegistrationObject[]> => {
  return Axios.get(`${API_BASE_URL}${GET_POPULAR_USERS}`, {
    headers: {
      Authorization: `Bearer ${currentUserToken}`,
    },
  })
    .then((res) => {
      console.log('New popular endpoint', res.data);
      if (res.data === null) {
        return [];
      }
      return res.data;
    })
    .catch((e) => {
      console.log('@GET POST ERROR: ', e);
      return [];
    });
};

const POSTS_LIMIT = 3 * 1000;

const Posts = (props: IPostsProps) => {
  const {
    data: suggestedUsers,
    status: loadingRecommended,
  } = useQuery('popular-users', () => getPopularUsers(props.currentUserToken!));

  // const {
  //   refetch,
  //   data: posts,
  //   status: postsStatus,
  // } = useQuery('eligible-posts', () =>
  //   props.setCurrentUserEligiblePosts!(props.currentUser!)
  // );

  const { currentUser, currentUserEligiblePosts } = props;

  console.log('CARDS.TSX PROPS.REDUX: ', props.currentUserActualEligiblePosts);

  const [loading, setLoading] = useState<boolean>(
    localStorage.getItem('postsSet') === null
  );

  const [refreshPostsLoading, setRefreshPostsLoading] = useState<boolean>(
    false
  );
  const [posts, setPosts] = useState<Array<any>>([]);
  // const [suggestedUsers, setSuggestedUsers] = useState<RegistrationObject[]>(
  //   []
  // );
  // const [loadingRecommended, setLoadingRecommended] = useState<boolean>(false);
  const [shouldRefreshPost, setShouldRefreshPost] = useState<boolean>(false);
  const [postsLimit, setPostsLimit] = useState<number>(POSTS_LIMIT);

  // useEffect(() => {
  //   // return;
  //   if (!currentUser) return;
  //   if (currentUserEligiblePosts === null) {
  //     setLoading(false);
  //     // getPopularUsers();
  //     return;
  //   }
  //   if (localStorage.getItem('postsSet') !== null) return;
  //   // console.log(
  //   //   'currentUserEligiblePosts!.splice(0, postsLimit)',
  //   //   currentUserEligiblePosts!.splice(0, postsLimit)
  //   // );

  //   let homePostsSub: any[] = [];
  //   let homeUidRefs: string[] = [];
  //   let homePostRefs: string[] = [];
  //   // if (localStorage.getItem('postsSet')) return;
  //   // if (currentUserEligiblePosts!.length === 0) {
  //   //     setLoading(false);
  //   //     return;
  //   // }
  //   const splicedPosts = currentUserEligiblePosts; //!.splice(0, postsLimit);
  //   const getEligible = async () => {
  //     let temp: any = {};
  //     await bluebird
  //       .map(
  //         splicedPosts!,
  //         async (obj: { uidRef: string; postRef: string }, index: number) => {
  //           homePostsSub[index] = firebase
  //             .database()
  //             .ref('Postsv2')
  //             .child(obj.uidRef)
  //             .child(obj.postRef)

  //             .on(
  //               'value',
  //               async (ssh) => {
  //                 //No need to check post privacy again because all posts we have access to are here?
  //                 if (!ssh.exists()) {
  //                   return;
  //                 }
  //                 temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
  //                 temp[`${obj.uidRef + obj.postRef}`].key = `${
  //                   obj.uidRef + obj.postRef
  //                 }`;

  //                 if (localStorage.getItem('postsSet')) {
  //                   console.log('@LOC STORR');

  //                   temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
  //                   temp[`${obj.uidRef + obj.postRef}`].key = `${
  //                     obj.uidRef + obj.postRef
  //                   }`;

  //                   setPosts(
  //                     Object.values(temp).sort(
  //                       (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
  //                     )
  //                   );
  //                   setLoading(false);
  //                 }

  //                 if (
  //                   index === splicedPosts!.length - 1 &&
  //                   !localStorage.getItem('postsSet')
  //                 ) {
  //                   setPosts(
  //                     Object.values(temp).sort(
  //                       (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
  //                     )
  //                   );

  //                   // console.log(
  //                   //   '@POSTS DEBUG: ',
  //                   //   Object.values(temp).sort(
  //                   //     (s1: any, s2: any) => s2.date_of_post - s1.date_of_post
  //                   //   )
  //                   // );

  //                   // Object.values(temp).map((temp: any) => {
  //                   //     return console.log("THIS@TEMP: ", temp.date_of_post);

  //                   // })

  //                   localStorage.setItem('postsSet', 'true');

  //                   setLoading(false);
  //                 }
  //               },
  //               (error: any) => {
  //                 console.log('@SSH ERROR: ', error);
  //                 if (error.code) {
  //                   if (error.code === 'PERMISSION_DENIED') {
  //                     // delete temp[lastKey];
  //                     // setPosts(Object.values(temp));
  //                     //TODO: Maybe show 'post not available message'?
  //                   }
  //                 }
  //               }
  //             );
  //           homeUidRefs[index] = obj.uidRef;
  //           homePostRefs[index] = obj.postRef;
  //         },
  //         {
  //           concurrency: splicedPosts!.length,
  //         }
  //       )
  //       .then(() => {
  //         console.log('DONE MAPPING');
  //         // setTimeout(() => {
  //         //     setLoading(false)

  //         // }, 1000);
  //         // setLoading(false)
  //       });

  //     // setTimeout(() => {
  //     //     setLoading(false)

  //     // }, 1000);
  //   };

  //   getEligible();
  //   return () => {
  //     // localStorage.removeItem('postsSet');
  //     homePostsSub.map((f, i) => {
  //       if (f) {
  //         const u = homeUidRefs[i];
  //         const p = homePostRefs[i];
  //         firebase.database().ref('Postsv2').child(u).child(p).off('value', f);
  //       }
  //       return 200;
  //     });
  //   };
  // }, [currentUser, currentUserEligiblePosts, postsLimit]);

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
  // const getPopularUsers = async () => {
  //   setLoadingRecommended(true);
  //   await Axios.get(`${API_BASE_URL}${GET_POPULAR_USERS}`, {
  //     headers: {
  //       Authorization: `Bearer ${props.currentUserToken}`,
  //     },
  //   })
  //     .then((res) => {
  //       console.log('New popular endpoint', res.data);
  //       setLoadingRecommended(false);
  //       if (res.data === null) {
  //         return;
  //       }
  //       setSuggestedUsers(res.data);
  //       // setComments(res.data);
  //       // setPostExists(true);
  //       // setLoadingPost(false);
  //     })
  //     .catch((e) => {
  //       setLoadingRecommended(false);
  //       console.log('@GET POST ERROR: ', e);
  //       // setPostExists(false);
  //       // setLoadingPost(false);
  //     });
  // };

  if (props.currentUserActualEligiblePostsLoading) {
    return (
      <Col offset={6} span={12}>
        {[1, 1, 1, 1].map((_, index) => (
          <Skeleton key={index} avatar active paragraph={{ rows: 4 }} />
        ))}
      </Col>
    );
  }

  const callback = () => {
    // setPostsLimit(postsLimit + 10);
  };

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
        <Link to="/explore">
          <Button type="link">Explore posts</Button>
        </Link>
        {/* <p style={{ textAlign: 'left' }}> Popular suggestions </p> */}
        {loadingRecommended === 'loading' && (
          <Col offset={6} span={12}>
            {[1, 1, 1, 1].map((_, index) => (
              <Skeleton key={index} avatar active paragraph={{ rows: 4 }} />
            ))}
          </Col>
        )}
        {Object.keys(suggestedUsers || {}).length > 0 && (
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
          offset={6}
          span={12}
          // style={{ zIndex: 2, position: 'fixed', textAlign: 'center', top: 0 }}
        >
          <Affix offsetTop={70}>
            <Button
              loading={refreshPostsLoading}
              type="text"
              onClick={() => {
                setRefreshPostsLoading(true);
                props.setCurrentUserEligiblePosts!(props.currentUser!).finally(
                  () => {
                    setRefreshPostsLoading(false);
                    setShouldRefreshPost(false);
                  }
                );
              }}
              icon={<RedoOutlined size={25} />}
            >
              Refresh posts
            </Button>
          </Affix>
        </Col>
      )}
      {props.currentUserActualEligiblePosts &&
        props.currentUserActualEligiblePosts.length > 0 &&
        props.currentUserActualEligiblePosts.map((val) => (
          <MyPost key={val.key} post={val} />
        ))}
      <BottomScrollListener onBottom={callback}></BottomScrollListener>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserEligiblePosts: state.user.currentUserEligiblePosts,
    currentUserActualEligiblePosts: state.user.currentUserActualEligiblePosts,
    currentUserToken: state.user.currentUserToken,
    currentUserActualEligiblePostsLoading:
      state.user.currentUserActualEligiblePostsLoading,
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

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
