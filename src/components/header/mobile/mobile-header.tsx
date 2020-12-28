import React from 'react';
import './mobile-header.css';
import { Col, Row, Input, Dropdown, Menu } from 'antd';
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
          pathname: `/`,
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

const MobileHeaderActivity = ({ history }: IHistory) => (
  <Row style={{ padding: 16 }} align="middle" justify="space-between">
    <Col>
      <span style={{ fontWeight: 600 }}> Activity </span>
    </Col>
  </Row>
);

const MobileHeader = (props: IMobileHeaderProps) => {
  const location = useRouteMatch(useLocation().pathname);
  const history = useHistory();

  console.log('@LOCATION: ', props);

  return (
    <nav className="Nav">
      <div className="Nav-menus">
        {location && location.isExact ? (
          location.path.split('/')[1] === '' ? (
            <MobileHeaderHome />
          ) : location.path.split('/')[1] === 'post' ? (
            <MobileHeaderViewPost
              currentUserPostViewing={props.currentUserPostViewing}
              history={history}
            />
          ) : location.path.split('/')[1] === 'explore' ? (
            <MobileHeaderExplore history={history} />
          ) : location.path.split('/')[1] === 'account' ? (
            <MobileHeaderAccount
              currentUserInfo={props.currentUserInfo}
              history={history}
            />
          ) : location.path.split('/')[1] === 'activity' ? (
            <MobileHeaderActivity history={history} />
          ) : location.path.split('/')[1] ===
            props.currentUserInfo?.username ? (
            <MobileHeaderSelfUserProfile
              currentUserInfo={props.currentUserInfo}
              history={history}
            />
          ) : props.currentUserViewing ? (
            <MobileHeaderOtherUserProfile
              currentUserViewing={props.currentUserViewing}
              history={history}
            />
          ) : (
            <MobileHeaderHome />
          )
        ) : null}
      </div>
    </nav>
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
