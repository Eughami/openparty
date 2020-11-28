import { Button, Result, Row, Skeleton, Space } from 'antd';
import Axios from 'axios';
import firebase from 'firebase';
import { size } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { API_BASE_URL, GET_ONE_POST } from '../service/api';
import { Post, RegistrationObject } from './interfaces/user.interface';
import MyPost from './post/post';

interface postIdInterface {
  postId: string;
}
interface ViewPostProps extends RouteComponentProps<any> {
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}
const ViewPost = (props: ViewPostProps) => {
  const { postId: id }: postIdInterface = useParams();
  const [post, setPost] = useState<Post>();
  const [error, setError] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);

  const fetchPost = async (postId: string, userId: string) => {
    setLoadingPost(true);
    firebase
      .database()
      .ref('Postsv2')
      .child(userId)
      .child(postId)
      .once('value', async (ssh) => {
        if (ssh.exists()) {
          setPost(ssh.val());
          setLoadingPost(false);
        }
      })
      .catch((error) => {
        setError(error);
        setLoadingPost(false);
      });
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
          res.data !== null
            ? fetchPost(id, res.data)
            : setError('Post Not Found');
        })
        .catch((e) => setError('New endpoint Error :' + e));
    // fetchPost(id);
  }, [props.currentUserToken]);

  const { history } = props;
  return (
    <>
      {loadingPost && <Skeleton active />}
      {error !== null && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the Post you visited does not exist."
          extra={
            <Button type="primary" onClick={() => history.push('/')}>
              Back Home
            </Button>
          }
        />
      )}
      {post && <MyPost key={post.id} post={post} fullPage={true} />}
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

export default connect(mapStateToProps, null)(ViewPost);
