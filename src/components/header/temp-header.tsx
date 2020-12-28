import { Row, Col, Avatar } from 'antd';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import TimeAgo, { Formatter } from 'react-timeago';

interface INotificationProps {
  imageUrl: string;
  text: string;
  username: string;
  link: string;
  thumbnail: string;
  time: number;
  imageSize?: number;
  style?: React.CSSProperties;
}

const TempHeaderNotification = (props: INotificationProps) => {
  const { imageUrl, text, imageSize, username, link, thumbnail, time } = props;
  return (
    <Row
      style={{ borderBottom: '1px solid #e6e6e6' }}
      justify="center"
      align="middle"
      gutter={[0, 12]}
    >
      <Col span={2}>
        <Link to={`/${username}`}>
          <Avatar alt="user-avatar" src={imageUrl} size={imageSize || 36} />
        </Link>
      </Col>
      <Col
        span={16}
        offset={1}
        // to hide very long weird and probably non-existent one word
        style={{ overflowX: 'hidden', fontSize: 12 }}
      >
        <Link
          style={{ color: 'rgba(var(--i1d,38,38,38),1)', fontWeight: 600 }}
          to={`/post/${link}`}
        >
          <span>
            {`${text.substring(0, 50)}...`}{' '}
            <p style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
              • <TimeAgo date={new Date(time)}></TimeAgo>
            </p>
          </span>
        </Link>
      </Col>
      <Col span={2}>
        <Link to={`/post/${link}`}>
          <img
            style={{ height: 40, width: 40, objectFit: 'contain' }}
            src={thumbnail}
            alt="post-thumbnail"
          />
        </Link>
      </Col>
    </Row>
  );
};

export default TempHeaderNotification;
