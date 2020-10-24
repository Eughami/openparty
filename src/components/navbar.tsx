import React from 'react';
import { Col, Row } from 'antd'
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';

import OpenPartyLogo from './images/openpaarty.logo.png'
import { connect } from 'react-redux';
import firebase from 'firebase';

import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../redux/user/user.actions';
import { RegistrationObject } from '../components/interfaces/user.interface';
interface INavbarProps {
  setCurrentUserListener?: () => Promise<any>,
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
  currentUser?: firebase.User,
  userInfo?: RegistrationObject
}

const Navbar = (props: INavbarProps) => {
  return (
    <div className='sticky__navbar'>
      <Row>
        <Col className='top__navbar__elements top__logo' xs={{ span: 11, offset: 1 }} sm={{ span: 8, offset: 1 }} md={{ span: 6, offset: 2 }} lg={{ span: 4, offset: 2 }} xxl={{ span: 3, offset: 4 }}>
          <img alt='' src={OpenPartyLogo} />
        </Col>
        <Col className='top__navbar__elements' xs={{ span: 0 }} lg={{ span: 6, offset: 2 }} xxl={{ span: 5, offset: 1 }}>SearchBar</Col>
        <Col className='top__navbar__elements' offset={1} span={6}>
          <Row style={{ alignItems: "center", justifyContent: "space-around" }}>
            <Col span="4">
              <span>
                <HomeOutlined size={25} onClick={() => {
                  if (props.currentUser)
                    props.setCurrentUserRootDatabaseListener!(props.currentUser.uid)
                } /*window.location.replace("/") */} />
              </span>
            </Col>
            <Col span="4">
              <span>
                {/* <UserOutlined size={25} onClick={() => window.location.replace(`/profile/${userDetails.username}`)} /> */}
              </span>
            </Col>
            <Col span="4">
              <span>
                <LogoutOutlined size={25} onClick={() => firebase.auth().signOut()} />
              </span>
            </Col>
          </Row>
        </Col>      </Row>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);