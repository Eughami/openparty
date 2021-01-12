import { Avatar, Col, Row, Skeleton } from 'antd';
import Bluebird from 'bluebird';
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
import { ArrowLeftOutlined } from '@ant-design/icons';

export interface chatsId {
  channelId: string;
  username: string;
  avatar: string;
  latestMessage: string;
  latestMessageSenderId: string | undefined;
  updated: number;
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
  updated: number;
}
const Inbox = (props: InboxProps) => {
  const { currentUser } = props;
  const [loading, setLoading] = useState<boolean>(true);
  // new
  const [chatIds, setChatIds] = useState<chatsId[]>([]);
  const [currentChatDetails, setCurrentChatDetails] = useState<
    ICurrentChatDetails | undefined
  >();
  const [showChatMobile, setShowChatMobile] = useState<boolean>(false);

  const mobileToggler = () => setShowChatMobile(!showChatMobile);

  useEffect(() => {
    let channelsSub: any;
    let massChannelsSub: any[] = [];
    // let chatsIdsTemp: any = [];
    if (!currentUser) return;
    (async () => {
      channelsSub = firebase
        .database()
        .ref('UserChannels')
        .child(currentUser?.uid!)
        .on(
          'value',
          (channels) => {
            if (channels.exists()) {
              const temp: any = {};
              const channelKeys = Object.keys(channels.val());
              console.log('@PRE CHAT DEBUG: ', channelKeys);
              Bluebird.map(
                channelKeys,
                (channelKey, index) => {
                  console.log('@IN CHAT DEBUG: ', channelKey, index);
                  const massSub = firebase
                    .database()
                    .ref('Chats')
                    .child(channelKey)
                    .on(
                      'value',
                      (chats) => {
                        if (!chats.exists()) {
                          //remove old chat
                          return;
                        }
                        const chatsVal = chats.val();

                        // remove current user from userslist property
                        delete chatsVal.userslist[currentUser.uid];

                        const otherUserDetails: any = Object.values(
                          chatsVal.userslist
                        )[0];
                        if (chats.child('thread').exists()) {
                          const lastMessage: any = Object.values(
                            chatsVal.thread
                          ).slice(-1)[0];

                          // details of the latest thread msg
                          const chatData: chatsId = {
                            channelId: channelKey,
                            avatar: otherUserDetails.avatar,
                            username: otherUserDetails.username,
                            latestMessage: lastMessage.text,
                            latestMessageSenderId: lastMessage.senderId,
                            updated: chatsVal.updated,
                          };

                          // make latestMessageSenderId undefined if it's from the currentUser
                          if (
                            chatData.latestMessageSenderId === currentUser.uid
                          ) {
                            chatData.latestMessageSenderId = undefined;
                          }
                          // chatsIdsTemp.push(chatData);
                          temp[`${channelKey}`] = chatData;

                          //   chatData.avatar = 'channelKey.split("+")[0]';
                        } else {
                          temp[`${channelKey}`] = {
                            channelId: channelKey,
                            avatar: otherUserDetails.avatar,
                            username: otherUserDetails.username,
                            latestMessage: '',
                            latestMessageSenderId: '',
                            updated: '',
                          };
                        }
                        // temp[`${chats.key!}`] = chatData;

                        // what this index doing ?
                        if (index === channelKeys.length - 1) {
                          //set loading chats done

                          setChatIds(
                            Object.values(temp).sort(
                              (s1: any, s2: any) => s2.updated - s1.updated
                            ) as any
                          );

                          console.log('@CHAT DEBUG: ', Object.values(temp));

                          setLoading(false);
                        }
                      },
                      (error: any) => {
                        console.log('@DB INNER CHATS ERROR:', error);
                      }
                    );
                  massChannelsSub.push(massSub);
                },
                { concurrency: channelKeys.length }
              );
            } else {
              //info: no chats found
              setChatIds([]);

              setLoading(false);
            }
          },
          (error: any) => {
            console.log('@DB CHATS ERROR:', error);
          }
        );
    })();

    return () => {
      firebase
        .database()
        .ref('UserChannels')
        .child(currentUser?.uid!)
        .off('value', channelsSub);
      console.log(massChannelsSub);

      // massChannelsSub.forEach((u) => {

      // })
    };
  }, [currentUser]);

  if (loading) {
    return (
      <Col offset={6} span={12} style={{ paddingTop: '100px' }}>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Col>
    );
  }

  return (
    <Row justify="center" align="middle">
      <Col md={24} sm={0} xs={0}>
        {/* For Big screen Desktop */}
        <Row justify="center" align="middle">
          <Col className="chats__list_container" xl={6} lg={8} md={9}>
            {chatIds &&
              chatIds.map((channelId) => (
                <div
                  key={channelId.channelId}
                  onClick={() =>
                    setCurrentChatDetails({
                      id: channelId.channelId,
                      username: channelId.username,
                      avatar: channelId.avatar,
                      updated: channelId.updated,
                    } as ICurrentChatDetails)
                  }
                >
                  <ChatPreview details={channelId} />
                </div>
              ))}
          </Col>
          <Col span={12}>
            {currentChatDetails !== undefined ? (
              <div className="current__chat__container">
                <ChatBox currentChatDetails={currentChatDetails} />
              </div>
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
      </Col>
      {/* For small screen Mobile */}
      <Col xs={24} sm={20} md={0}>
        <Row justify="center" align="middle">
          {showChatMobile ? (
            currentChatDetails !== undefined && (
              <div className="current__chat__container__mobile">
                <Row
                  align="middle"
                  justify="start"
                  className="current__chat__mobile__header"
                >
                  <Col offset={1}>
                    <ArrowLeftOutlined
                      style={{ fontSize: 22 }}
                      onClick={mobileToggler}
                    />
                  </Col>
                  <Col offset={1}>
                    <Avatar src={currentChatDetails.avatar} size={32} />
                  </Col>
                  <Col offset={1}> {currentChatDetails.username}</Col>
                </Row>
                <ChatBox
                  mobileToggler={mobileToggler}
                  currentChatDetails={currentChatDetails}
                />
              </div>
            )
          ) : (
            <Col className="chats__list_container__mobile">
              {chatIds &&
                chatIds.map((channelId) => (
                  <div
                    key={channelId.channelId}
                    onClick={() => {
                      mobileToggler();

                      setCurrentChatDetails({
                        id: channelId.channelId,
                        username: channelId.username,
                        avatar: channelId.avatar,
                        updated: channelId.updated,
                      } as ICurrentChatDetails);
                    }}
                  >
                    <ChatPreview details={channelId} />
                  </div>
                ))}
            </Col>
          )}
        </Row>
      </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
