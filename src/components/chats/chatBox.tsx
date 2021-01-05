import { Button, Col, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../interfaces/user.interface';
import AsyncMention from '../mentions/mentions.component';
import { ICurrentChatDetails } from './inbox';
import { v1 } from 'uuid';

interface ChatBoxProps {
  currentChatDetails: ICurrentChatDetails;
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}
interface messageInterface {
  senderId: string;
  id: string;
  text: string;
}
const ChatBox = (props: ChatBoxProps) => {
  const [messages, setMessages] = useState<messageInterface[]>();
  const [writtenMessage, setWrittenMessage] = useState<string>('');
  const {
    currentUserInfo,
    currentChatDetails,
    currentUser,
    currentUserToken,
  } = props;
  useEffect(() => {
    const fetchChat = () =>
      firebase
        .database()
        .ref(`Chats/${currentChatDetails.id}/messages/`)
        .on('value', (ssh) => {
          setMessages(Object.values(ssh.val()));
          console.log('ChatData.inside', Object.values(ssh.val()));
        });
    fetchChat();
  }, [currentUser, currentUserInfo, currentUserToken, currentChatDetails]);
  console.log('@INBOX:', props.currentUserInfo?.uid);
  const saveMesage = (msg: string) => {
    const message = {
      id: v1(),
      text: msg,
      createdAt: new Date(),
      senderId: currentUserInfo?.uid,
    };

    firebase
      .database()
      .ref(`/Chats/${currentChatDetails.id}/messages/`)
      .push(message)
      .catch((e) => console.log('Error savng to db ', e));
    setWrittenMessage('');
  };
  return (
    <>
      <div className="chatbox__container">
        {messages &&
          Object.keys(messages).length > 0 &&
          Object.values(messages).map((message) => (
            <Row
              justify={
                message.senderId !== currentUserInfo?.uid ? 'start' : 'end'
              }
              style={{ width: '100%', padding: 10 }}
            >
              {message.senderId !== currentUserInfo?.uid ? (
                <div>
                  <Row>
                    <Col>
                      <Avatar src={currentChatDetails.avatar} size={32} />
                    </Col>
                    <Col className="received__msg__container ">
                      {message.text}
                    </Col>
                  </Row>
                </div>
              ) : (
                <div>
                  <Row>
                    <Col className="user__msg__container">{message.text}</Col>
                    <Col>
                      <Avatar src={currentUserInfo?.image_url} size={32} />
                    </Col>
                  </Row>
                </div>
              )}
            </Row>
          ))}
      </div>
      <Row className="send__msg__container">
        <Col flex="auto">
          <AsyncMention
            value={writtenMessage}
            onChange={setWrittenMessage}
            placeholder="Add a comment..."
          />
        </Col>
        <Col style={{ height: 'inherit' }} flex="50px">
          <Button
            style={{ height: 'inherit' }}
            onClick={() => saveMesage(writtenMessage)}
          >
            send
          </Button>
        </Col>
      </Row>
    </>
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
