import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import firebase from "firebase"
import OpenpartyLogo from '../assets/images/openpaarty.logo.png'
interface INavbarProps {

  user: firebase.User
}

const Navbar = (props: INavbarProps) => {
  console.log("NAVBAR PROPS: ", props);

  const [userDetails, setUserDetails] = useState<{ username: string }>({ username: "" });
  const [currentUserDone, setCurrentUserDone] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();


  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setCurrentUserDone(true);
    });

    return unsub;
  }, []);

  useEffect(() => {

    if (currentUserDone) {

      const unsub = firebase.database().ref("Users").child(currentUser!.uid).on("value", snapshot => {
        if (snapshot.exists()) {
          const user = snapshot.val();
          setUserDetails({
            username: user.username,
          })
        }
      })

      return firebase.database().ref("Users").child("Posts").off("value", unsub);
    }

  }, []);

  return (
    <div className='sticky__navbar'>
      <Row>
        <Col className='top__navbar__elements top__logo' xs={{ span: 11, offset: 1 }} sm={{ span: 8, offset: 1 }} md={{ span: 6, offset: 2 }} lg={{ span: 4, offset: 2 }} xxl={{ span: 3, offset: 4 }}>
          <img alt='' style={{ width: 300 }} src={OpenpartyLogo} />
        </Col>
        <Col className='top__navbar__elements' offset={1} span={5}>SearchBar</Col>
        <Col className='top__navbar__elements' offset={1} span={6}>
          <Row style={{ alignItems: "center", justifyContent: "space-around" }}>
            <Col span="4">
              <span>
                <HomeOutlined size={25} onClick={() => window.location.replace("/")} />
              </span>
            </Col>
            <Col span="4">
              <span>
                <UserOutlined size={25} onClick={() => window.location.replace(`/profile/${userDetails.username}`)} />
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
    </div>
  );
};

export default Navbar;