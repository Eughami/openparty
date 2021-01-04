import { Col, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import TimeAgo from 'react-timeago';

interface ChatPreviewProps {
  username: string;
  imageUrl: string;
  latestMessageContent: string;
  sender: boolean;
  timestamp: number;
}

const ChatPreview = (props: ChatPreviewProps) => {
  const { username, imageUrl, latestMessageContent, sender, timestamp } = props;
  return (
    <Row style={{ padding: 10 }} align="middle" justify="space-between">
      <Col flex="80px">
        <Avatar src={imageUrl} size={64} />
      </Col>
      <Col flex="auto">
        <Row justify="space-between" align="middle">
          <Col>
            <span>
              <strong>{username}</strong>
            </span>
            <br />
            <span>
              {sender && 'You:'} {latestMessageContent}
            </span>
          </Col>
          <Col>
            <span style={{ fontSize: 10 }}>
              <TimeAgo live date={new Date(timestamp)} />
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ChatPreview;
