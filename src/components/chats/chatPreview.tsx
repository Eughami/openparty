import { Col, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import TimeAgo from 'react-timeago';
import { chatsId } from './inbox';

interface ChatPreviewProps {
  details: chatsId;
}

const ChatPreview = (props: ChatPreviewProps) => {
  const {
    username,
    avatar,
    channelId,
    latestMessage,
    latestMessageSenderId,
    updated,
  } = props.details;
  console.log('ChatData:called with', props);
  return (
    <Row style={{ padding: 10 }} align="middle" justify="space-between">
      <Col flex="80px">
        <Avatar src={avatar} size={64} />
      </Col>
      <Col flex="auto">
        <Row justify="space-between" align="middle">
          <Col>
            <span>
              <strong>{username}</strong>
            </span>
            <br />
            <span>
              {latestMessageSenderId === undefined && 'You:'} {latestMessage}
            </span>
          </Col>
          <Col>
            <span style={{ fontSize: 10 }}>
              <TimeAgo live date={new Date(updated)} />
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ChatPreview;
