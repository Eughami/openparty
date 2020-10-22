import React from 'react';
import {Col, Row} from 'antd'
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import {signOutStart} from '../redux/user/user.actions'


import OpenpartyLogo from './images/openpaarty.logo.png'
import { connect } from 'react-redux';

const Navbar = ({signOutStart}:any) => {
  return (
    <div className='sticky__navbar'>
      <Row>
        <Col className='top__navbar__elements top__logo' xs={{span: 11, offset: 1}} sm={{span: 8, offset: 1}} md={{span: 6, offset: 2}} lg={{span: 4, offset: 2}} xxl={{span: 3, offset:4}}>
          <img alt='' src={OpenpartyLogo} />
        </Col>
        <Col className='top__navbar__elements' xs={{span: 0}} lg={{span: 6, offset: 2}} xxl={{span: 5, offset:1}}>SearchBar</Col>
        <Col className='top__navbar__elements' offset={1} span={6}>
          <Row style={{ alignItems: "center", justifyContent: "space-around" }}>
            <Col span="4">
              <span>
                <HomeOutlined size={25} onClick={() => window.location.replace("/")} />
              </span>
            </Col>
            <Col span="4">
              <span>
                {/* <UserOutlined size={25} onClick={() => window.location.replace(`/profile/${userDetails.username}`)} /> */}
              </span>
            </Col>
            <Col span="4">
              <span>
                <LogoutOutlined size={25} onClick={() => signOutStart()} />
              </span>
            </Col>
          </Row>
        </Col>      </Row>
    </div>
  );
};

const mapDispatchToProps = (dispatch:any) =>({
  signOutStart: () => dispatch(signOutStart())
})
export default connect(null, mapDispatchToProps)(Navbar);