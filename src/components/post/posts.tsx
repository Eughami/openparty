import React, { useEffect, useState } from 'react';
import MyPost from './post';
import firebase from 'firebase';
import {
  Comment,
  Post,
  PostPrivacy,
  RegistrationObject,
} from '../interfaces/user.interface';
import { Spin, Empty, Col } from 'antd';
import { connect } from 'react-redux';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';

interface IPostsProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  fromProfile?: boolean;
}

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
        user_id: user.uid,
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
            user_id: userPosts.key!,
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
  const { currentUser, currentUserInfo } = props;

  console.log('CARDS.TSX PROPS: ', props);

  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Array<Post>>([]);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    //limit to 50 or som-n...
    const unSub = firebase
      .database()
      .ref('Posts')
      .limitToLast(50)
      .on('value', async (snapshot) => {
        if (snapshot.exists()) {
          // console.log("USE EFFECT RUNNING ", snapshot.val());

          let ttt: Array<firebase.database.DataSnapshot> = [];
          snapshot.forEach((post) => {
            if (
              post.val().privacy === PostPrivacy.PUBLIC ||
              post.val().uid === currentUser!.uid
            ) {
              ttt.push(post);
            }
          });

          const newPosts = await awaitFillPosts(ttt);

          setPosts(newPosts);
          setLoading(false);
        } else {
          setPosts([]);
          setLoading(false);
        }
      });

    return () => firebase.database().ref('Posts').off('value', unSub);
  }, [currentUser]);

  if (loading) {
    return (
      <Col
        span="12"
        style={{
          marginLeft: '20%',
          marginRight: '20%',
          marginTop: '5%',
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </Col>
    );
  }

  return (
    <div className="posts__container">
      {posts.length > 0 ? (
        posts.map((post, index) => <MyPost key={index} post={post} />)
      ) : (
        <Empty />
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
