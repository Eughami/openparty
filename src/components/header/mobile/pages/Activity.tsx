import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { IHeaderProps } from '../../header';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../../../redux/user/user.actions';
import { connect } from 'react-redux';
import TempHeaderNotification from '../../temp-header';
import { Avatar, Badge, Button, Col, List, Row, Spin } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  API_BASE_URL,
  APPROVE_FOLLOW_ENDPOINT,
  IGNORE_FOLLOW_ENDPOINT,
} from '../../../../service/api';
import TimeAgo from 'react-timeago';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Activity = (props: IHeaderProps) => {
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(
    true
  );
  const [followRequests, setFollowRequests] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [showFollowRequest, setShowFollowRequest] = useState<boolean>(false);

  //Set listener for active follow requests
  useEffect(() => {
    const un_sub = firebase
      .database()
      .ref('FollowRequests')
      .child(props.currentUser?.uid!)
      .on(
        'value',
        (ssh) => {
          if (ssh.exists()) {
            setFollowRequests(
              Object.values(ssh.val()).sort(
                (s1: any, s2: any) => s2.time - s1.time
              ) as any
            );
          } else {
            setFollowRequests([]);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

    return () =>
      firebase
        .database()
        .ref('FollowRequests')
        .child(props.currentUser?.uid!)
        .off('value', un_sub);
  }, [props.currentUser]);

  //Set listener for user notifications
  useEffect(() => {
    const un_sub = firebase
      .database()
      .ref('Notifications')
      .child(props.currentUser?.uid!)
      .limitToLast(50)
      .on(
        'value',
        (ssh) => {
          if (ssh.exists()) {
            const temp: any = {};

            ssh.forEach((notification) => {
              if (
                notification.val().likes &&
                notification.key !== 'HOT UPDATE'
              ) {
                temp[`likes${notification.key}`] = Object.values(
                  notification.val().likes
                );
                temp[`likes${notification.key}`].ref = notification.key;
              }

              if (
                notification.val().comments &&
                notification.key !== 'HOT UPDATE'
              ) {
                temp[`comments${notification.key}`] = Object.values(
                  notification.val().comments
                );
                temp[`comments${notification.key}`].ref = notification.key;
              }

              if (
                notification.val().mentions &&
                notification.key !== 'HOT UPDATE'
              ) {
                temp[`mentions${notification.key}`] = Object.values(
                  notification.val().mentions
                );
                temp[`mentions${notification.key}`].ref = notification.key;
              }

              if (
                notification.val().follows &&
                notification.key !== 'HOT UPDATE'
              ) {
                temp[`follows${notification.key}`] = notification.val().follows;
                temp[
                  `follows${notification.key}`
                ].ref = notification.val().follows.ref;
              }

              if (
                notification.val().follow_requests &&
                notification.key !== 'HOT UPDATE'
              ) {
                temp[
                  `follow_requests${notification.key}`
                ] = notification.val().follow_requests;
                temp[
                  `follow_requests${notification.key}`
                ].ref = notification.val().follow_requests.ref;
              }
            });

            setUserNotifications(
              []
                .concat(...(Object.values(temp) as any[]))
                .sort((n1: any, n2: any) => n2.time - n1.time) as any
            );

            setNotificationsLoading(false);
          } else {
            setUserNotifications([]);
            setNotificationsLoading(false);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

    return () =>
      firebase
        .database()
        .ref('Notifications')
        .child(props.currentUser?.uid!)
        .off('value', un_sub);
  }, [props.currentUser]);

  const onFollowApproved = async (uid: string) => {
    await axios.post(
      `${API_BASE_URL}${APPROVE_FOLLOW_ENDPOINT}`,
      {
        targetUid: uid,
      },
      {
        headers: {
          authorization: `Bearer ${props.currentUserToken}`,
        },
      }
    );
  };

  const onFollowIgnored = async (uid: string) => {
    await axios.post(
      `${API_BASE_URL}${IGNORE_FOLLOW_ENDPOINT}`,
      {
        targetUid: uid,
      },
      {
        headers: {
          authorization: `Bearer ${props.currentUserToken}`,
        },
      }
    );
  };

  const toggle = () => {
    setShowFollowRequest(!showFollowRequest);
  };

  if (notificationsLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <>
      <Row
        className="mobile__activity__follow__request__title"
        // justify="center"
        align="middle"
        onClick={toggle}
      >
        {!showFollowRequest ? (
          <>
            <Col offset={1}>
              <Badge
                overflowCount={10}
                count={followRequests.length ? followRequests.length : 0}
              />
            </Col>
            <Col style={{ marginLeft: 10 }}>Follow requests</Col>
          </>
        ) : (
          <>
            <Col offset={1}>
              <ArrowLeftOutlined />
            </Col>
            <Col offset={1}>My Activity</Col>
          </>
        )}
      </Row>
      {!showFollowRequest &&
        (userNotifications.length > 0 ? (
          userNotifications.map((not: any, index) => (
            <TempHeaderNotification
              time={not.time}
              key={index}
              imageUrl={not.image_url}
              text={not.desc}
              username={not.username}
              link={not.ref}
              thumbnail={not.thumbnail}
            />
          ))
        ) : (
          <Row justify="center" align="middle" style={{ height: '100%' }}>
            No Activity
          </Row>
        ))}
      {showFollowRequest &&
        (Object.keys(followRequests).length > 0 ? (
          <List
            itemLayout="horizontal"
            size="small"
            dataSource={followRequests}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <p
                    onClick={() => onFollowApproved(item.uid)}
                    style={{ color: 'green', cursor: 'pointer' }}
                    key={JSON.stringify(item)}
                  >
                    Approve
                  </p>,
                  <p
                    onClick={() => onFollowIgnored(item.uid)}
                    style={{ color: 'red', cursor: 'pointer' }}
                    key={JSON.stringify(item)}
                  >
                    Ignore
                  </p>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.image_url} />}
                  title={
                    <Link to={{ pathname: `/${item.username}` }}>
                      {item.username}
                    </Link>
                  }
                  description={
                    <TimeAgo date={new Date(`${item.time}`)}></TimeAgo>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Row justify="center" style={{ fontSize: '1.3rme' }}>
            No Follow Requests
          </Row>
        ))}
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
export default connect(mapStateToProps, mapDispatchToProps)(Activity);
