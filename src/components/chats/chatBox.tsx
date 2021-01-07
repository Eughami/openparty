import { Button, Col, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import firebase from 'firebase';
import React, { useEffect, useState, useRef } from 'react';
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
  const [messagesLimit, setMessagesLimit] = useState<number>(20);
  const {
    currentUserInfo,
    currentChatDetails,
    currentUser,
    currentUserToken,
  } = props;

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef && messagesLimit <= 20)
      (messagesEndRef.current as any)!.scrollIntoView({ behavior: 'smooth' });
  };

  const messagesEndRef = useRef(null);

  useEffect(scrollToBottom);

  useEffect(() => {
    let sub: any;
    const fetchChat = () =>
      (sub = firebase
        .database()
        .ref(`Chats/${currentChatDetails.id}/thread/`)
        .limitToLast(messagesLimit)
        .on('value', (ssh) => {
          setMessages(Object.values(ssh.val()));
          console.log('ChatData.inside', Object.values(ssh.val()));
        }));
    fetchChat();
    return () =>
      firebase
        .database()
        .ref(`Chats/${currentChatDetails.id}/thread/`)
        .off('value', sub);
  }, [
    currentUser,
    currentUserInfo,
    currentUserToken,
    currentChatDetails,
    messagesLimit,
  ]);

  const saveMessage = (msg: string) => {
    const message = {
      id: v1(),
      text: msg,
      createdAt: new Date(),
      senderId: currentUserInfo?.uid,
    };

    firebase
      .database()
      .ref(`/Chats/${currentChatDetails.id}/thread/`)
      .push(message)
      .catch((e) => console.log('Error saving to db ', e));
    setWrittenMessage('');
  };

  const handleScroll = (e: any) => {
    if (e.target.scrollTop === 0) {
      console.log('top reached');
      setMessagesLimit(messagesLimit + 5);
      e.target.scrollTop = 1;
    }
  };

  return (
    <div className="current__chat__container">
      <div onScroll={handleScroll} className="chatbox__container">
        {messages &&
          Object.keys(messages).length > 0 &&
          Object.values(messages).map((message) => (
            <Row
              key={message.id}
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
        <div ref={messagesEndRef}></div>
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
            onClick={() => saveMessage(writtenMessage)}
          >
            send
          </Button>
        </Col>
      </Row>
    </div>
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
