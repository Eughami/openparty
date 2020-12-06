import { Row, Col, Avatar } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

interface INotificationProps {
  imageUrl: string;
  text: string;
  username: string;
  link: string;
  imageSize?: number;
  style?: React.CSSProperties;
}

const TempHeaderNotification = (props: INotificationProps) => {
  const { imageUrl, text, imageSize, username, link } = props;
  return (
    <Row justify="start" align="middle" gutter={[0, 12]}>
      <Col span={2}>
        <Link to={`/${username}`}>
          <Avatar alt="user-avatar" src={imageUrl} size={imageSize || 36} />
        </Link>
      </Col>
      <Col
        span={20}
        offset={2}
        // to hide very long weird and probably non-existent one word
        style={{ overflowX: 'hidden', fontSize: 12 }}
      >
        <Link to={`/post/${link}`}>
          <span>{text}</span>
        </Link>
      </Col>
    </Row>
  );
};

export default TempHeaderNotification;
