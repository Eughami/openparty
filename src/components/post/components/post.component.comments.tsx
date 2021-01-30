import React from 'react';
import { Post, Comment } from '../../interfaces/user.interface';
import { Avatar, Button, Col, List, Row } from 'antd';
import { Link } from 'react-router-dom';
import { replaceAtMentionsWithLinks2 } from '../../mentions/mentions.component';
import TimeAgo from 'react-timeago';
import { EllipsisOutlined } from '@ant-design/icons';
import { PopupboxContainer, PopupboxManager } from 'react-popupbox';
import Axios from 'axios';
import { API_BASE_URL, DELETE_COMMENT_ENDPOINT } from '../../../service/api';
import { DeleteCommentRequest } from '../../interfaces/interface';
interface IPostCommentsProps {
  post: Post;
  full: boolean;
  currentUserId?: string;
  token?: string;
}

export const PostComments = (props: IPostCommentsProps) => {
  const { post, full, currentUserId, token } = props;

  const showCommentOptions = (commentId: string, userId: string) => {
    const postData: DeleteCommentRequest = {
      commentId,
      postId: post.id,
    };
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
    userId === currentUserId &&
      dataSource.unshift(
        <Button
          onClick={() => {
            Axios({
              url: `${API_BASE_URL}${DELETE_COMMENT_ENDPOINT}`,
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: postData,
            })
              .then((res) => console.log(res.data))
              .catch((e) => console.log('@DELETE_COMMENT: ERROR: ', e));
            PopupboxManager.close();
          }}
          style={{ fontWeight: 'bold' }}
          block
          type="link"
          danger
        >
          Delete Comment
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
  return (
    <>
      <PopupboxContainer />
      {post.comments && (
        <>
          {full ? (
            Object.values(post.comments).map(
              (comment: Comment, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                  }}
                >
                  <Row justify="space-between" align="middle">
                    {/* <Col xl={2} lg={3} sm={2} xs={3}> */}
                    <span style={{ width: '32px' }}>
                      <Avatar
                        alt="user avatar"
                        src={comment.user.image_url}
                        size={32}
                      />
                    </span>
                    <div
                      className="comment__container"
                      style={{ overflowX: 'hidden', paddingLeft: 12 }}
                    >
                      <Link
                        to={{
                          pathname: `/${comment.user.username}`,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'rgba(var(--i1d,38,38,38),1)',
                          }}
                        >
                          {comment.user.username}{' '}
                        </span>
                      </Link>
                      {replaceAtMentionsWithLinks2(comment.comment)}
                      <p style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
                        • <TimeAgo date={new Date(comment.timestamp)}></TimeAgo>
                      </p>
                    </div>
                    <Row align="middle">
                      <EllipsisOutlined
                        style={{ fontSize: 20 }}
                        onClick={() => {
                          return showCommentOptions(
                            comment.id,
                            comment.user.user_id
                          );
                        }}
                      />
                    </Row>
                    {/* <span style={{ width: '32px' }}>
                    </span> */}
                  </Row>
                </div>
              )
            )
          ) : (
            <Row align="middle" justify="start" style={{ padding: 10 }}>
              {post.comments &&
                Object.values(post.comments)
                  .slice(0, 3)
                  .map((comment: Comment, index: number) => (
                    <Col span={24} key={index}>
                      <span>
                        <Link
                          onMouseOver={(e) => console.log(e)}
                          to={{
                            pathname: `/${comment.user.username}`,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: 'rgba(var(--i1d,38,38,38),1)',
                            }}
                          >
                            {comment.user.username}{' '}
                          </span>
                        </Link>
                        {replaceAtMentionsWithLinks2(comment.comment)}
                      </span>
                    </Col>
                  ))}
              {/* TODO: When length is smaller than spliced (3) + plural */}
              <Link
                to={
                  window.innerWidth < 576
                    ? `/post/${post.id}/comments`
                    : `/post/${post.id}`
                }
              >
                <span style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
                  View all {Object.keys(post.comments).length} comments
                </span>
              </Link>
            </Row>
          )}
        </>
      )}
    </>
  );
};

interface IPostCommentsNumberProps {
  post: Post;
}

export const PostCommentsNumber = (props: IPostCommentsNumberProps) => {
  const { post } = props;
  return <>{post.comments ? Object.keys(post.comments).length : 0}</>;
};
