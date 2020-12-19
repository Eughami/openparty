import React from 'react';
import { Col, Row, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Post } from '../../interfaces/user.interface';
import { LockTwoTone } from '@ant-design/icons';
import { PostTime } from './post.component.post-time';

interface IPostUserProps {
  post: Post;
  style?: React.CSSProperties;
}

export const PostUser = (props: IPostUserProps) => {
  const { post, style } = props;

  return (
    <header style={{ ...style, height: '100%' }}>
      <Row align="middle" className="Post-user">
        <Col span={8}>
          <img
            className="Post-user-avatar"
            src={post.user.image_url}
            alt={post.user.username}
          />
          <Link
            to={{
              pathname: `/${post.user.username}`,
            }}
          >
            <span className="Post-user-nickname"> {post.user.username} </span>
          </Link>
        </Col>
        <Col span={8}>
          <span style={{ marginLeft: '22%', fontWeight: 'bold' }}>
            <PostTime post={post} />
          </span>
        </Col>
        <Col span={4}>
          {(post.privacy as any) === 'hard-closed' && (
            <Tooltip title="Only you can see this post 🙈 ">
              <span
                style={{
                  fontSize: '25px',
                  marginLeft: '35%',
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <LockTwoTone twoToneColor="#eb2f96" />
              </span>
            </Tooltip>
          )}
        </Col>
      </Row>
      {/* <div className="Post-user"> */}
      {/* <div className="Post-user-avatar"> */}
      {/* </div> */}
    </header>
  );
};
