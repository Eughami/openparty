import { Col, Row, Skeleton } from 'antd';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserPostViewing,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../interfaces/user.interface';
import ChatBox from './chatBox';
import ChatPreview from './chatPreview';

interface InboxProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

const Inbox = (props: InboxProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<any[]>();
  const [currentMessageList, setCurrentMessageList] = useState<any>(undefined);
  const { currentUser, currentUserInfo, currentUserToken } = props;

  useEffect(() => {
    const fetchChats = (currentUserId: string) => {
      console.log('@INBOX:userID:', currentUserId);
      // fetch this user chats
      firebase
        .database()
        .ref('Chats')
        .on(
          'value',
          (ssh) => {
            if (!ssh.exists()) {
              setLoading(false);
              return;
            }
            // manipulate chats
            // restrict access from db rules
            // only the chats which this user is a
            // part of should be conatined in this response
            setLoading(false);
            let data = ssh.val();
            let chats: any[] = [];

            Object.keys(data).forEach((chat) => {
              const usersList = Object.keys(data[chat].userslist);
              if (usersList.includes(currentUserId)) {
                // remove currentUser from userList
                delete data[chat].userslist[currentUserId];
                chats.push(data[chat]);
              }
            });
            setChats(chats);
            console.log('@INBOX, db value :', data);
          },
          (error: any) => {
            setLoading(false);
            console.log('@INBOX:error:', error);
          }
        );
    };

    fetchChats(props.currentUserInfo?.uid!);
  }, [currentUser, currentUserInfo, currentUserToken]);

  if (loading) {
    return (
      <Col offset={6} span={12} style={{ paddingTop: '100px' }}>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Col>
    );
  }

  return (
    <>
      {chats && Object.keys(chats).length > 0 && (
        <Row justify="center" align="middle">
          <Col className="blackB" span={6}>
            {chats.map((chat) => {
              console.log(
                '@INBOX:chat:',
                // this is the other user details (image,username)
                chat.userslist[Object.keys(chat.userslist)[0]]
              );
              return (
                <div
                  onClick={() =>
                    setCurrentMessageList({
                      messages: chat.messages,
                      userslist: chat.userslist,
                    })
                  }
                >
                  <ChatPreview
                    username={
                      chat.userslist[Object.keys(chat.userslist)[0]].username
                    }
                    imageUrl={
                      chat.userslist[Object.keys(chat.userslist)[0]].image_url
                    }
                    latestMessageContent={
                      chat.messages[Object.keys(chat.messages)[0]].content
                    }
                    sender={
                      chat.messages[Object.keys(chat.messages)[0]].sender ===
                      currentUserInfo?.uid
                    }
                    timestamp={
                      chat.messages[Object.keys(chat.messages)[0]].timestamp
                    }
                  />
                </div>
              );
            })}
          </Col>
          <Col className="blackB" span={14}>
            {currentMessageList !== undefined && (
              <ChatBox
                messages={currentMessageList.messages}
                userslist={currentMessageList.userslist}
              />
            )}
          </Col>
        </Row>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
