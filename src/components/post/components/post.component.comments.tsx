import React from 'react';
import { Post, Comment } from '../../interfaces/user.interface';
import { Avatar, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { replaceAtMentionsWithLinks2 } from '../../mentions/mentions.component';

interface IPostCommentsProps {
  post: Post;
  full: boolean;
}

export const PostComments = (props: IPostCommentsProps) => {
  const { post, full } = props;
  return (
    <>
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
                  <Row justify="start" align="top">
                    <Col span={2}>
                      <Avatar
                        alt="user avatar"
                        src={comment.user.image_url}
                        size={36}
                      />
                    </Col>
                    <Col
                      span={21}
                      offset={1}
                      // to hide very long weird and probably non-existent one word
                      style={{ overflowX: 'hidden' }}
                    >
                      <span>
                        <Link
                          to={{
                            pathname: `/${comment.user.username}`,
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            {comment.user.username}{' '}
                          </span>
                        </Link>
                        {replaceAtMentionsWithLinks2(comment.comment)}
                      </span>
                    </Col>
                  </Row>
                </div>
              )
            )
          ) : (
            <>
              {post.comments &&
                Object.values(post.comments)
                  .slice(0, 3)
                  .map((comment: Comment, index: number) => (
                    <Row justify="start" align="middle" key={index}>
                      <span>
                        <Link
                          to={{
                            pathname: `/${comment.user.username}`,
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            {comment.user.username}{' '}
                          </span>
                        </Link>
                        {replaceAtMentionsWithLinks2(comment.comment)}
                      </span>
                    </Row>
                  ))}
              <Link to={`/post/${post.id}`}>
                <span>
                  View all {Object.keys(post.comments).length} comments
                </span>
              </Link>
            </>
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
