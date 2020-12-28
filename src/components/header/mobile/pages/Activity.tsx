import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { IHeaderProps, LIKED_POST_REACTION_ARRAY } from '../../header';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from '../../../../redux/user/user.actions';
import { connect } from 'react-redux';
import TempHeaderNotification from '../../temp-header';
import { Avatar, List, notification } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  API_BASE_URL,
  APPROVE_FOLLOW_ENDPOINT,
  IGNORE_FOLLOW_ENDPOINT,
} from '../../../../service/api';
import TimeAgo from 'react-timeago';

const Activity = (props: IHeaderProps) => {
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(
    true
  );
  const [followRequests, setFollowRequests] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);

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

            ssh.forEach((post) => {
              if (post.val().likes && post.key !== 'HOT UPDATE') {
                temp[`${post.key}`] = Object.values(post.val().likes);
                temp[`${post.key}`].ref = post.key;
              }

              if (post.val().comments && post.key !== 'HOT UPDATE') {
                temp[`${post.key}`] = Object.values(post.val().comments);
                temp[`${post.key}`].ref = post.key;
              }

              if (post.val().mentions && post.key !== 'HOT UPDATE') {
                temp[`${post.key}`] = Object.values(post.val().mentions);
                temp[`${post.key}`].ref = post.key;
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

  //Set listener for every hot notification update
  useEffect(() => {
    const un_sub = firebase
      .database()
      .ref('Notifications')
      .child(props.currentUser?.uid!)
      .child('HOT UPDATE')
      .on(
        'child_changed',
        (ssh, __prevSsh) => {
          if (ssh.exists()) {
            if (ssh.child('desc').exists()) {
              notification.open({
                message: ssh.val().desc,
                description: ssh.val().desc,
                icon:
                  LIKED_POST_REACTION_ARRAY[
                    Math.floor(Math.random() * LIKED_POST_REACTION_ARRAY.length)
                  ],
                placement: 'topRight',
                // onClick: () => setShowNotification(true),
                style: { cursor: 'pointer' },
              });
            }
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
        .child('HOT UPDATE')
        .off('child_changed', un_sub);
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

  return (
    <>
      {userNotifications.length > 0 &&
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
        ))}
      {Object.keys(followRequests).length > 0 ? (
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
        <></>
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
export default connect(mapStateToProps, mapDispatchToProps)(Activity);
