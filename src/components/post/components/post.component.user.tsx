import React from 'react';
import { Col, Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Post } from '../../interfaces/user.interface';
import { LockTwoTone } from '@ant-design/icons';
import { PostTime } from './post.component.post-time';

interface IPostUserProps {
  post: Post;
  currentUser: firebase.User;
  style?: React.CSSProperties;
}

export const PostUser = (props: IPostUserProps) => {
  const { post, currentUser, style } = props;

  return (
    <header style={{ ...style, height: '100%' }}>
      <Row align="middle" justify="start" className="Post-user">
        <Col
          xl={{ span: 11, offset: 1 }}
          lg={{ span: 9, offset: 1 }}
          sm={{ span: 10, offset: 1 }}
          xs={{ span: 10, offset: 1 }}
        >
          <img
            className="Post-user-avatar"
            src={post.user.image_url}
            alt={post.user.username}
          />
          <Link
            onMouseOver={(e) => console.log(e)}
            style={{ color: 'rgba(var(--i1d,38,38,38),1)' }}
            to={{
              pathname: `/${post.user.username}`,
            }}
          >
            <span className="Post-user-nickname"> {post.user.username} </span>
          </Link>
        </Col>
        <Col
          xl={{ span: 7, offset: 1 }}
          lg={{ span: 9, offset: 1 }}
          sm={{ span: 10, offset: 1 }}
          xs={{ span: 10, offset: 1 }}
        >
          <span style={{ fontWeight: 'bold' }}>
            <PostTime post={post} />
          </span>
        </Col>
        <Col
          xl={{ offset: 2, span: 2 }}
          lg={{ span: 2, offset: 2 }}
          sm={{ span: 1 }}
          xs={{ span: 1 }}
        >
          {post.uid === currentUser.uid &&
            (post.privacy as any) === 'hard-closed' && (
              <Tooltip title="Only you can see this post 🙈 ">
                <span
                  style={{
                    fontSize: '25px',
                  }}
                >
                  <LockTwoTone twoToneColor="#eb2f96" />
                </span>
              </Tooltip>
            )}
        </Col>
      </Row>
    </header>
  );
};
