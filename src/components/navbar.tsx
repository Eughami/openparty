import React from 'react';
import {Col, Row} from 'antd';
import {  UserOutlined, LogoutOutlined, HomeOutlined  } from '@ant-design/icons';
import firebase from "firebase"

interface INavbarProps {
  user: firebase.User
}

const Navbar = (props: INavbarProps) => {
  console.log("NAVBAR PROPS: ", props);
  
  return (
    <Row>
      <Col className='top__navbar__elements' offset={4} span={4}>HomePageLogo</Col>
      <Col className='top__navbar__elements' offset={1} span={5}>SearchBar</Col>
      <Col className='top__navbar__elements' offset={1} span={6}>
        <Row style={{alignItems: "center", justifyContent: "space-around"}}>
          <Col span="4">
            <span>
             <HomeOutlined size={25} onClick={() => window.location.replace("/")} />
            </span>
          </Col>
          <Col span="4">
            <span>
             <UserOutlined size={25} onClick={() => window.location.replace(`/profile/${props.user.email}`)} />
            </span>
          </Col>
          <Col span="4">
            <span>
              <LogoutOutlined size={25} onClick={() => firebase.auth().signOut()} />
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Navbar;