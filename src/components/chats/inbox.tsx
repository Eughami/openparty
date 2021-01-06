import { Col, Row, Skeleton } from 'antd';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../interfaces/user.interface';
import ChatBox from './chatBox';
import ChatPreview from './chatPreview';

export interface chatsId {
  chatId: string;
  username: string;
  avatar: string;
  latestMessage: string;
  latestMessageSenderId: string | undefined;
}
interface InboxProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}
export interface ICurrentChatDetails {
  id: string;
  username: string;
  avatar: string;
}
const Inbox = (props: InboxProps) => {
  const { currentUser, currentUserInfo, currentUserToken } = props;
  const [loading, setLoading] = useState<boolean>(true);
  // new
  const [chatIds, setChatIds] = useState<chatsId[]>([]);
  const [currentChatDetails, setCurrentChatDetails] = useState<
    ICurrentChatDetails | undefined
  >();

  useEffect(() => {
    if (currentUser && currentUserInfo && currentUserToken) {
      const fetchChats = (currentUserId: string) => {
        console.log('@INBOX:userID:', currentUserId);
        // fetch this user chats
        firebase
          .database()
          .ref('Chats/')
          .on(
            'value',
            (ssh) => {
              setLoading(false);

              if (!ssh.exists()) {
                setLoading(false);
                return;
              }
              // new dynamic
              const data = ssh.val();
              let arr: any[] = [];

              // remove current user from userlists
              Object.keys(data).forEach(
                (discussion) =>
                  delete data[discussion].userslist[currentUserInfo?.uid]
              );
              Object.keys(data).forEach((discussion) => {
                const chatData: chatsId = {
                  chatId: discussion,
                  // only remaining node will be the other user in the discussion
                  // so we're geting his details at the index 0(only one)
                  avatar:
                    data[discussion].userslist[
                      Object.keys(data[discussion].userslist)[0]
                    ].avatar,
                  username:
                    data[discussion].userslist[
                      Object.keys(data[discussion].userslist)[0]
                    ].username,
                  latestMessage:
                    data[discussion].messages[
                      Object.keys(data[discussion].messages)[
                        Object.keys(data[discussion].messages).length - 1
                      ]
                    ].text,
                  latestMessageSenderId:
                    data[discussion].messages[
                      Object.keys(data[discussion].messages)[
                        Object.keys(data[discussion].messages).length - 1
                      ]
                    ].senderId,
                };

                // to get the latest msg id in the db
                // Object.keys(data[discussion].messages)[
                //   Object.keys(data[discussion].messages).length - 1
                // ]
                // clear last user message id if from current user
                if (chatData.latestMessageSenderId == currentUserInfo?.uid) {
                  chatData.latestMessageSenderId = undefined;
                }

                arr.push(chatData);
              });
              setChatIds(arr);
              console.log('ChatData:', arr);
            },
            (error: any) => {
              setLoading(false);
              console.log('@INBOX:error:', error);
            }
          );
      };

      fetchChats(props.currentUserInfo?.uid!);
    }
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
      <Row justify="center" align="top">
        <Col className="chats__list_container" span={6}>
          {chatIds &&
            chatIds.map((chatId) => (
              <div
                onClick={() =>
                  setCurrentChatDetails({
                    id: chatId.chatId,
                    username: chatId.username,
                    avatar: chatId.avatar,
                  } as ICurrentChatDetails)
                }
              >
                <ChatPreview details={chatId} />
              </div>
            ))}
        </Col>
        <Col span={14}>
          {currentChatDetails !== undefined ? (
            <ChatBox currentChatDetails={currentChatDetails} />
          ) : (
            // this will be the empty box (default) when no user is selected
            <Row
              justify="center"
              align="middle"
              className="empty__chat__container"
            >
              Start Messaging people
            </Row>
          )}
        </Col>
      </Row>
      {/* )} */}
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
