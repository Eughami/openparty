import React, { useEffect } from 'react';
import './mobile-header.css';
import { Col, Row, Input, Dropdown, Menu, notification } from 'antd';
import {
  MessageOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';

import OpenPartyLogo from '../../images/openpaarty.logo.png';
import { connect } from 'react-redux';
import { Post, RegistrationObject } from '../../interfaces/user.interface';
import firebase from 'firebase';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { LIKED_POST_REACTION_ARRAY } from '../header';

const { Search } = Input;

interface IMobileHeaderProps {
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserViewing?: RegistrationObject;
  currentUserPostViewing?: Post;
}

interface IHistory {
  history: any;
  currentUserInfo?: RegistrationObject;
  currentUserViewing?: RegistrationObject;
  currentUserPostViewing?: Post;
}

const menu = (history: any) => (
  <Menu>
    <Menu.Item
      onClick={() => history.push('/account/edit')}
      key="1"
      icon={<UserOutlined />}
    >
      Settings
    </Menu.Item>
    <hr />
    <Menu.Item
      onClick={() => firebase.auth().signOut()}
      key="2"
      icon={<LogoutOutlined />}
    >
      Logout
    </Menu.Item>
  </Menu>
);

const MobileHeaderHome = () => (
  <Row align="middle" justify="space-between">
    <Col>
      <Link
        to={{
          pathname: '/',
        }}
      >
        <img
          style={{ paddingLeft: 5 }}
          height="50px"
          width="150px"
          src={OpenPartyLogo}
          alt="open-party"
        />
      </Link>
    </Col>
    <Col>
      <Link
        to={{
          pathname: `/messages`,
        }}
        style={{ paddingRight: 15 }}
      >
        <MessageOutlined style={{ fontSize: '24px', color: 'black' }} />
      </Link>
    </Col>
  </Row>
);

const MobileHeaderViewPost = ({
  history,
  currentUserPostViewing,
}: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <ArrowLeftOutlined onClick={() => history.goBack()} />
    </Col>
    {currentUserPostViewing && (
      <Col>
        <ShareAltOutlined style={{ fontSize: '22px', color: 'black' }} />
      </Col>
    )}
  </Row>
);

const MobileHeaderExplore = ({ history }: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="center">
    <Col>
      <Search placeholder="Search" />
    </Col>
  </Row>
);

const MobileHeaderAccount = ({ history, currentUserInfo }: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <ArrowLeftOutlined onClick={() => history.goBack()} />
    </Col>
    <Col>
      <span style={{ fontWeight: 600 }}> {currentUserInfo?.username} </span>
    </Col>
  </Row>
);

const MobileHeaderSelfUserProfile = ({
  history,
  currentUserInfo,
}: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <Dropdown
        overlay={menu(history)}
        placement="bottomCenter"
        arrow
        trigger={['click']}
      >
        <SettingOutlined />
      </Dropdown>
    </Col>
    <Col>
      <span style={{ fontWeight: 600 }}> {currentUserInfo?.username} </span>
    </Col>
  </Row>
);

const MobileHeaderOtherUserProfile = ({
  history,
  currentUserViewing,
}: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <ArrowLeftOutlined onClick={() => history.goBack()} />
    </Col>
    <Col>
      <span style={{ fontWeight: 600 }}> {currentUserViewing?.username} </span>
    </Col>
  </Row>
);

const MobileHeaderComments = ({ history }: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <ArrowLeftOutlined onClick={() => history.goBack()} />
    </Col>
    {/* <Col>
      <ShareAltOutlined style={{ fontSize: '22px', color: 'black' }} />
    </Col> */}
  </Row>
);

const MobileHeaderLikes = ({ history }: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <ArrowLeftOutlined onClick={() => history.goBack()} />
    </Col>
    {/* <Col>
      <ShareAltOutlined style={{ fontSize: '22px', color: 'black' }} />
    </Col> */}
  </Row>
);

const MobileHeaderTags = ({ history }: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <ArrowLeftOutlined onClick={() => history.goBack()} />
    </Col>
    <Col>
      <span style={{ fontWeight: 600 }}> Tags </span>
    </Col>
  </Row>
);

const MobileHeaderFollowers = ({ history }: IHistory) => (
  <Row style={{ height: '100%' }} align="middle">
    <Col offset={1}>
      <ArrowLeftOutlined
        style={{ fontSize: 24 }}
        onClick={() => history.goBack()}
      />
    </Col>
    <Col offset={6}>
      <span style={{ fontWeight: 600, fontSize: 24 }}> Followers </span>
    </Col>
  </Row>
);
const MobileHeaderFollowings = ({ history }: IHistory) => (
  <Row style={{ height: '100%' }} align="middle">
    <Col offset={1}>
      <ArrowLeftOutlined
        style={{ fontSize: 24 }}
        onClick={() => history.goBack()}
      />
    </Col>
    <Col offset={6}>
      <span style={{ fontWeight: 600, fontSize: 24 }}> Followings </span>
    </Col>
  </Row>
);

const MobileHeader = (props: IMobileHeaderProps) => {
  const location = useRouteMatch(useLocation().pathname);
  const history = useHistory();

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
            notification.destroy();
            if (ssh.child('desc').exists()) {
              notification.open({
                message: ssh.val().desc,
                description: ssh.val().desc,
                icon:
                  LIKED_POST_REACTION_ARRAY[
                    Math.floor(Math.random() * LIKED_POST_REACTION_ARRAY.length)
                  ],
                placement: 'topRight',
                onClick: () => {
                  if (location && location.isExact) {
                    if (
                      location.path.split('/')[1] === 'account' &&
                      location.path.split('/')[2] === 'activity'
                    ) {
                      return;
                    }
                    history.push('/account/activity');
                  }
                },
                duration: 5,
                style: { cursor: 'pointer', width: '100vw', fontSize: 12 },
                top: 0,
              });
            } else if (ssh.child('preview').exists()) {
              console.log('@NEW MESSAGE INCOMING: ', ssh.val());
              notification.open({
                message: ssh.val().preview,
                description: ssh.val().preview,
                icon:
                  LIKED_POST_REACTION_ARRAY[
                    Math.floor(Math.random() * LIKED_POST_REACTION_ARRAY.length)
                  ],
                placement: 'bottomRight',
                style: { cursor: 'pointer', fontSize: 12 },
                top: 0,
                duration: 5,
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
  }, [props.currentUser, location, history]);

  if (!(location && location.isExact)) return null;

  return (
    <>
      {/* No header for activity and Messages */}
      {(location.path.split('/')[1] === 'account' &&
        location.path.split('/')[2] === 'activity') ||
      location.path.split('/')[1] === 'messages' ? null : (
        <div style={{ paddingBottom: '55px' }}>
          <nav className="Nav">
            <div className="Nav-menus">
              {location.path.split('/')[1] === '' && <MobileHeaderHome />}

              {location.path.split('/')[1] === 'post' && (
                <MobileHeaderViewPost
                  currentUserPostViewing={props.currentUserPostViewing}
                  history={history}
                />
              )}

              {location.path.split('/')[1] === 'explore' && (
                <MobileHeaderExplore history={history} />
              )}

              {location.path.split('/')[1] === 'account' && (
                <MobileHeaderAccount
                  currentUserInfo={props.currentUserInfo}
                  history={history}
                />
              )}
              {location.path.split('/')[1] === 't' && (
                <MobileHeaderTags history={history} />
              )}
              {location.path.split('/')[1] ===
                props.currentUserInfo?.username &&
                !location.path.split('/')[2] && (
                  <MobileHeaderSelfUserProfile
                    currentUserInfo={props.currentUserInfo}
                    history={history}
                  />
                )}
              {location.path.split('/')[1] &&
                location.path.split('/')[2] === 'followers' && (
                  <MobileHeaderFollowers
                    currentUserInfo={props.currentUserInfo}
                    history={history}
                  />
                )}
              {location.path.split('/')[1] &&
                location.path.split('/')[2] === 'followings' && (
                  <MobileHeaderFollowings
                    currentUserInfo={props.currentUserInfo}
                    history={history}
                  />
                )}
              {props.currentUserViewing && (
                <MobileHeaderOtherUserProfile
                  currentUserViewing={props.currentUserViewing}
                  history={history}
                />
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserViewing: state.user.currentUserViewing,
    currentUserPostViewing: state.user.currentUserPostViewing,
  };
};

export default connect(mapStateToProps)(MobileHeader);
