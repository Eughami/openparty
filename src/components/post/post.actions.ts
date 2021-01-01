import { message } from 'antd';
import firebase from 'firebase';
import {
  PostTags,
  RegistrationObject,
  Comment,
} from '../interfaces/user.interface';
import { ADD_COMMENT_ENDPOINT, API_BASE_URL } from '../../service/api';
import axios from 'axios';

const POST_TAG_COLORS = [
  'blue',
  'cyan',
  'gold',
  'green',
  'lime',
  'magenta',
  'orange',
  'pink',
  'purple',
  'red',
  'yellow',
  'default',
  'geekblue',
  'volcano',
  'success',
  'processing',
  'error',
  'warning',
];

//TODO: Maybe to make things appear faster, we can fake increase/decrease the
//number of likes-- before posting to our endpoint. We can catch any errors afterwards and
// act appropriately
export const handlePostLike = async (
  setUserLikePost: React.Dispatch<React.SetStateAction<boolean>>,
  userLikePost: boolean,
  user_id: string,
  post_id: string,
  currentUser: firebase.User
) => {
  if (userLikePost) {
    return firebase
      .database()
      .ref('Postsv2')
      .child(user_id)
      .child(post_id)
      .child('likes')
      .child(currentUser?.uid!)
      .remove()
      .then(() => {
        message.success('You dislike this post');
        setUserLikePost(false);
      })
      .catch(() => {
        return message.warn(
          "Sorry, this post doesn't seem to existing any longer..."
        );
      });
  } else {
    return firebase
      .database()
      .ref('Postsv2')
      .child(user_id)
      .child(post_id)
      .once(
        'value',
        async (ssh) => {
          if (!ssh.exists()) {
            return message.error(
              "Sorry, this post doesn't seem to existing any longer..."
            );
          }

          if (
            ssh.val().privacy === 'hard-closed' &&
            ssh.val().uid !== currentUser.uid
          ) {
            return message.error(
              "Sorry, this post doesn't seem to existing any longer..."
            );
          }
          return ssh
            .child('likes')
            .child(currentUser?.uid!)
            .ref.set({
              uid: currentUser?.uid!,
              username: currentUser?.displayName!,
              image_url: currentUser?.photoURL!,
            })
            .then(() => {
              message.success('You 💖 this post');
              setUserLikePost(true);
            })
            .catch(() => {
              return message.warn(
                "Sorry, this post doesn't seem to existing any longer..."
              );
            });
        },
        () => {
          return message.warn(
            "Sorry, this post doesn't seem to existing any longer..."
          );
        }
      );
  }
};

export const getPostTagColor = (__tag?: PostTags): string => {
  return POST_TAG_COLORS[Math.floor(Math.random() * POST_TAG_COLORS.length)];
  // switch (tag) {
  //   case PostTags.BEACH_PARTY:
  //     return 'magenta';
  //   case PostTags.COCAINE_PARTY:
  //     return 'processing';
  //   case PostTags.DRUG_PARTY:
  //     return 'red';
  //   default:
  //     return 'green';
  // }
};

export const onPostComment = async (
  setPostCommentLoading: React.Dispatch<React.SetStateAction<boolean>>,
  currentUserInfo: RegistrationObject,
  post_id: string,
  username: string,
  comment: Comment,
  currentUserToken: string
) => {
  // console.log('CAlled with :', {
  //   currentUserInfo,
  //   post_id,
  //   username,
  //   comment,
  //   currentUserToken,
  // });
  // return;
  if (!currentUserInfo) {
    alert("We're having trouble posting your comment. Please wait...");
    return false;
  }

  setPostCommentLoading(true);

  await axios
    .post(
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
    )
    .then((result) => {
      console.log('@ADD COMMENT RESULT: ', result);

      setPostCommentLoading(false);
      // resetCommentForm();
      if (result.status !== 201) {
        message.error('Your comment could not be added at this time.');
        return true;
      }
    })
    .catch((e) => {
      console.log('@ADD COMMENT ERROR: ', e);
      setPostCommentLoading(false);
      message.error('Your comment could not be added at this time.');
    });
};

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
