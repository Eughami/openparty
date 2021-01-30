import { Button, Col, Input, List, Result, Row, Skeleton } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect, useState } from 'react';
import AsyncMention, {
  replaceAtMentionsWithLinks2,
} from '../../../mentions/mentions.component';
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
import { Link, RouteComponentProps, useParams } from 'react-router-dom';
import Axios from 'axios';
import {
  API_BASE_URL,
  DELETE_COMMENT_ENDPOINT,
  EXPLORE_POSTS_ENDPOINT,
  GET_ONE_POST,
  POST_ROOT,
} from '../../../../service/api';
import TimeAgo from 'react-timeago';
import { EllipsisOutlined } from '@ant-design/icons';
import { PopupboxContainer, PopupboxManager } from 'react-popupbox';
import {
  DeleteCommentRequest,
  EditCommentRequest,
} from '../../../interfaces/interface';
import EditComment from '../../../editComment';

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
  const [comments, setComments] = useState<Comment[] | undefined>(undefined);
  const [comment, setComment] = useState<Comment>({
    comment: '',
    comments: [],
    id: '',
    likes: 0,
    timestamp: 0,
    user: { image_url: '', user_id: '', username: '' },
  });
  const [loadingPost, setLoadingPost] = useState<boolean>(true);

  const getComment = async () => {
    await Axios.get(`${API_BASE_URL}${POST_ROOT}/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${props.currentUserToken}`,
      },
    })
      .then((res) => {
        console.log('New comment endpoint', res.data);
        if (res.data === null) {
          setPostExists(false);
          setLoadingPost(false);
          return;
        }
        setComments(res.data);
        setPostExists(true);
        setLoadingPost(false);
      })
      .catch((e) => {
        console.log('@GET POST ERROR: ', e);
        setPostExists(false);
        setLoadingPost(false);
      });
  };

  useEffect(() => {
    console.log('Mounted');

    getComment();
  }, [props.currentUserToken, props.currentUserInfo, id]);

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
          image_url: currentUserInfo?.image_url
            ? currentUserInfo?.image_url
            : '',
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

  const showCommentOptions = (
    commentId: string,
    userId: string,
    oldCommentValue: string
  ) => {
    //  edit comment request
    const editData: EditCommentRequest = {
      commentId,
      postId: id,
      content: oldCommentValue,
    };

    // Edit Comment content
    const editComment = (
      <EditComment
        cancelFunc={PopupboxManager.close}
        editData={editData}
        token={currentUserToken!}
        refetch={getComment}
      />
    );

    // delete comment request
    const postData: DeleteCommentRequest = {
      commentId,
      postId: id,
    };

    // Comment options
    const dataSource = [
      <Button style={{ fontWeight: 'bold' }} block type="link" danger>
        Report
      </Button>,

      <Button
        onClick={() => PopupboxManager.close()}
        style={{ fontWeight: 'bold' }}
        block
        type="link"
      >
        Cancel
      </Button>,
    ];

    userId === currentUserInfo?.uid &&
      dataSource.unshift(
        <Button
          onClick={() => {
            Axios({
              url: `${API_BASE_URL}${DELETE_COMMENT_ENDPOINT}`,
              method: 'POST',
              headers: {
                Authorization: `Bearer ${currentUserToken}`,
              },
              data: postData,
            })
              .then((res) => {
                getComment();
                console.log(res.data);
              })
              .catch((e) => console.log('@DELETE_COMMENT: ERROR: ', e));
            PopupboxManager.close();
          }}
          style={{ fontWeight: 'bold' }}
          block
          type="link"
          danger
        >
          Delete Comment
        </Button>,
        <Button
          style={{ fontWeight: 'bold' }}
          block
          type="link"
          onClick={() => {
            PopupboxManager.update({ content: editComment });
          }}
        >
          Edit Comment
        </Button>
      );

    const content = (
      <List
        size="small"
        header={null}
        footer={null}
        dataSource={dataSource}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    );
    PopupboxManager.open({ content });
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
    <div style={{ width: '100%', height: '100%' }}>
      <PopupboxContainer />
      <Row align="middle" justify="center">
        <Col span={2}>
          <Avatar src={currentUser?.photoURL} />
        </Col>
        <Col span={18} offset={1}>
          <Row>
            <Row
              style={{ flex: 1, height: 40, border: 'none' }}
              className="post__add__comment"
            >
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
                  currentUserInfo?.username!,
                  comment,
                  currentUserToken!
                ).finally(() => {
                  resetCommentForm();
                  getComment();
                })
              }
              disabled={comment.comment.length === 0}
              style={{ height: 40, border: 'none' }}
            >
              Post
            </Button>
          </Row>
        </Col>
      </Row>
      <Row className="mobile__comments__container">
        {comments ? (
          comments.length === 0 ? (
            <span>No Comments</span>
          ) : (
            <>
              {comments.map((comm, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    width: '100%',
                  }}
                >
                  <Row key={index} justify="space-between" align="middle">
                    {/* <Col xl={2} lg={3} sm={2} xs={3}> */}
                    <span style={{ width: '32px' }}>
                      <Avatar
                        alt="user avatar"
                        src={comm.user.image_url}
                        size={32}
                      />
                    </span>
                    <div
                      className="comment__container"
                      style={{ overflowX: 'hidden', paddingLeft: 12 }}
                    >
                      <Link
                        to={{
                          pathname: `/${comm.user.username}`,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'rgba(var(--i1d,38,38,38),1)',
                          }}
                        >
                          {comm.user.username}{' '}
                        </span>
                      </Link>
                      {replaceAtMentionsWithLinks2(comm.comment)}
                      <p style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
                        • <TimeAgo date={new Date(comm.timestamp)}></TimeAgo>
                      </p>
                    </div>
                    <Row align="middle">
                      <EllipsisOutlined
                        style={{ fontSize: 20 }}
                        onClick={() => {
                          return showCommentOptions(
                            comm.id,
                            comm.user.user_id,
                            comm.comment
                          );
                        }}
                      />
                    </Row>
                  </Row>
                </div>
              ))}
            </>
          )
        ) : null}
      </Row>
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
