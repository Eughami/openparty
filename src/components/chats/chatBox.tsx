import { Button, Col, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { connect } from 'react-redux';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../interfaces/user.interface';
import AsyncMention from '../mentions/mentions.component';

interface message {
  content: string;
  sender: string;
  timestamp: number;
}
interface userlistSingleUser {
  image_url: string;
  username: string;
}
interface ChatBoxProps {
  messages: message[];
  // make type for this property
  userslist: any;
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

const ChatBox = (props: ChatBoxProps) => {
  console.log('@INBOX:', props.currentUserInfo?.uid);
  const { messages, userslist, currentUserInfo } = props;
  return (
    <Row className="chatbox__container">
      {messages &&
        Object.keys(messages).length > 0 &&
        Object.values(messages).map((message) => {
          console.log(
            '@INBOX: chatbox:',
            message
            // userslist[message.sender].image_url
          );
          return (
            <Row
              align="middle"
              justify={userslist[message.sender] ? 'start' : 'end'}
              style={{ width: '100%', padding: 10 }}
            >
              {userslist[message.sender] ? (
                <>
                  <Col>
                    <Avatar
                      src={userslist[message.sender].image_url}
                      size={32}
                    />
                  </Col>
                  <Col className="received__msg__container ">
                    {message.content}
                  </Col>
                </>
              ) : (
                <>
                  <Col className="user__msg__container">{message.content}</Col>
                  <Col>
                    <Avatar src={currentUserInfo?.image_url} size={32} />
                  </Col>
                </>
              )}
            </Row>
          );
        })}
      <Row className="send__msg__container">
        <Col flex="auto">
          <AsyncMention
            value={''}
            onChange={() => {}}
            placeholder="Add a comment..."
          />
        </Col>
        <Col style={{ height: 'inherit' }} flex="50px">
          <Button style={{ height: 'inherit' }}>send</Button>
        </Col>
      </Row>
    </Row>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
