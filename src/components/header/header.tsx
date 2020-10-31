import React from "react";
import './header.css';
import { Col, Row } from 'antd'
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import OpenPartyLogo from '../images/openpaarty.logo.png'
import { connect } from 'react-redux';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../../redux/user/user.actions';
import { RegistrationObject } from "../interfaces/user.interface";
import firebase from "firebase";
import { Link } from "react-router-dom";

interface IHeaderProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    currentUser?: firebase.User,
    currentUserInfo?: RegistrationObject
}

const Header = (props: IHeaderProps) => {
    return (
        <nav className="Nav">
            <div className="Nav-menus">
                <div className="Nav-brand">
                    <Link
                        to={{
                            pathname: "/",
                        }}
                    >

                        <img style={{ height: "100%", width: "40%" }} src={OpenPartyLogo} alt="open-party" />
                    </Link>
                    {/* <a href="/">
                    </a> */}
                </div>
                <Col className='' xs={{ span: 0 }} lg={{ span: 6, offset: 2 }} xxl={{ span: 5, offset: 1 }}>SearchBar</Col>
                <Col className='' offset={1} span={6}>
                    <Row style={{ alignItems: "center", justifyContent: "space-around" }}>
                        <Col span="4">
                            <Link
                                className="nav-link"
                                to={{
                                    pathname: `/`,
                                }}
                            >
                                <HomeOutlined size={25} />
                            </Link>
                            {/* <span>
                                <HomeOutlined size={25} />
                            </span> */}
                        </Col>
                        <Col span="4">
                            <Link
                                className="nav-link"
                                to={{
                                    pathname: `/profile/${props.currentUserInfo?.username}`,
                                }}
                            >
                                <UserOutlined size={25} />
                            </Link>
                            {/* <span>
                                <UserOutlined size={25} onClick={() => window.location.replace(`/profile/${props.currentUserInfo!.username}`)} />
                            </span> */}
                        </Col>
                        <Col span="4">
                            <span>
                                <LogoutOutlined onClick={() => firebase.auth().signOut()} size={25} />
                            </span>
                        </Col>
                    </Row>
                </Col>
            </div>
        </nav>
    );
}
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);