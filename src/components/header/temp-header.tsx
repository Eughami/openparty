import { Row, Col, Avatar, Grid } from 'antd';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

const { useBreakpoint } = Grid;
interface INotificationProps {
  imageUrl: string;
  text: string;
  username: string;
  link: string;
  thumbnail?: string;
  time: number;
  imageSize?: number;
  style?: React.CSSProperties;
  commentId: string;
}

const TempHeaderNotification = (props: INotificationProps) => {
  const dispatch = useDispatch();
  const { xs } = useBreakpoint();

  const {
    imageUrl,
    text,
    imageSize,
    username,
    link,
    thumbnail,
    time,
    commentId,
  } = props;

  return (
    <Row
      onClick={() => {
        dispatch({
          type: 'SET_NOTIFICATION_ID',
          payload: commentId,
        });
      }}
      style={{ borderBottom: '1px solid #e6e6e6' }}
      justify="start"
      align="middle"
      // gutter={[0, 12]}
    >
      <Col xs={{ span: 2, offset: 1 }} sm={{ span: 2, offset: 0 }}>
        <Link to={`/${username}`}>
          <Avatar alt="user-avatar" src={imageUrl} size={imageSize || 36} />
        </Link>
      </Col>
      <Col
        span={16}
        // offset={1}
        // to hide very long weird and probably non-existent one word
        style={{ overflowX: 'hidden', fontSize: 12, marginLeft: 20 }}
      >
        <Link
          style={{ color: 'rgba(var(--i1d,38,38,38),1)', fontWeight: 600 }}
          to={
            thumbnail
              ? // TODO. find a better way of identifying when a notificatio is a comment
                xs && text.includes('comment')
                ? `/post/${link}/comments`
                : `/post/${link}`
              : `/${link}`
          }
        >
          <span>
            {`${text.length > 50 ? text.substring(0, 50) + '...' : text}`}{' '}
            <p style={{ color: 'rgba(var(--f52,142,142,142),1)' }}>
              • <TimeAgo date={new Date(time)}></TimeAgo>
            </p>
          </span>
        </Link>
      </Col>
      <Col span={2}>
        {thumbnail && (
          <Link to={`/post/${link}`}>
            <img
              style={{ height: 40, width: 40, objectFit: 'contain' }}
              src={thumbnail}
              alt="post-thumbnail"
            />
          </Link>
        )}
      </Col>
    </Row>
  );
};
export default TempHeaderNotification;
