import { Button, Col, Result, Skeleton } from 'antd';
import Axios from 'axios';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { API_BASE_URL, GET_ONE_POST } from '../service/api';
import { Post } from './interfaces/user.interface';
import MyPost from './post/post';

interface postIdInterface {
  postId: string;
}
interface ViewPostProps extends RouteComponentProps<any> {
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
      .on('value', async (ssh) => {
        if (ssh.exists()) {
          setPost(ssh.val());
          setLoadingPost(false);
        }
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
      {post && <MyPost post={post} fullPage={true} />}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUserToken: state.user.currentUserToken,
  };
};

export default connect(mapStateToProps, null)(ViewPost);
