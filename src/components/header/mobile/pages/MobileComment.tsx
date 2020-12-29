import { Button, Col, Result, Row, Skeleton } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect, useState } from 'react';
import AsyncMention from '../../../mentions/mentions.component';
import {
  Comment,
  RegistrationObject,
} from '../../../interfaces/user.interface';
import { connect } from 'react-redux';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../../../redux/user/user.actions';
import { onPostComment } from '../../../post/post.actions';
import { RouteComponentProps, useParams } from 'react-router-dom';
import Axios from 'axios';
import { API_BASE_URL, GET_ALL_POST_ENDPOINT } from '../../../../service/api';

interface postIdInterface {
  postId: string;
}

interface MobileCommentsProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

const MobileComments = (props: MobileCommentsProps) => {
  console.log('mobile props:', props);
  const { postId: id }: postIdInterface = useParams();
  const [postExists, setPostExists] = useState<boolean>(true);
  const [postCommentLoading, setPostCommentLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<Comment>({
    comment: '',
    comments: [],
    id: '',
    likes: 0,
    timestamp: 0,
    user: { image_url: '', user_id: '', username: '' },
  });
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  useEffect(() => {
    console.log('Mounted');
    const getPost = async () => {
      await Axios.get(
        `${API_BASE_URL}${GET_ALL_POST_ENDPOINT}/${id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${props.currentUserToken}`,
          },
        }
      )
        .then((res) => {
          console.log('New comment endpoint', res.data);

          if (res.data === null) {
            setPostExists(false);
            setLoadingPost(false);
            return;
          }
        })
        .catch((e) => {
          console.log('@GET POST ERROR: ', e);
          setPostExists(false);
          setLoadingPost(false);
        });
    };
    getPost();
  }, [props.currentUserToken, props.currentUserInfo, id]);

  const { image_url, username } = props.currentUserInfo!;
  const { currentUser, currentUserInfo, currentUserToken } = props;

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
          image_url,
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
          <Button type="primary" /*onClick={() => history.goBack()}*/>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', border: 'black solid' }}>
      <Row align="middle">
        <Avatar src={currentUser?.photoURL} />
        <Row style={{ flex: 1 }} className="post__add__comment">
          <AsyncMention
            value={comment.comment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
          />
        </Row>
        <Button
          loading={postCommentLoading}
          onClick={() =>
            onPostComment(
              setPostCommentLoading,
              currentUserInfo!,
              id,
              username,
              comment,
              currentUserToken!
            ).finally(() => resetCommentForm())
          }
          disabled={comment.comment.length === 0}
          style={{ height: 50 }}
        >
          Post
        </Button>
      </Row>
      <Row></Row>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileComments);
