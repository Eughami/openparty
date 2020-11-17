import { Col, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { Link } from 'react-router-dom';
import { Comment } from './interfaces/user.interface';
interface ViewCommentProps {
  comment: Comment;
}
const ViewComment = (props: ViewCommentProps) => {
  const { comment } = props.comment;
  const { username, image_url } = props.comment.user;
  console.log('View Coment called ', props);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '60px',
        padding: '10px',
        // borderBottom: 'solid black 1px',
        border: 'yellow solid',
      }}
    >
      <Row justify="start" align="top">
        <Col span={2}>
          <Avatar alt="user avatar" src={image_url} size={36} />
        </Col>
        <Col span={20} offset={1}>
          <span>
            <Link
              to={{
                pathname: `/${username}`,
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{username} </span>
            </Link>
          </span>
          <span style={{ marginLeft: '10px' }}>{comment}</span>
        </Col>
      </Row>
    </div>
  );
};

export default ViewComment;
