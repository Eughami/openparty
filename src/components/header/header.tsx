import React, { useEffect, useState } from "react";
import './header.css';
import { Col, Row, Badge, Modal, Button, List, Avatar, Tooltip } from 'antd'
import { UserOutlined, LogoutOutlined, HomeOutlined, UsergroupAddOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import OpenPartyLogo from '../images/openpaarty.logo.png'
import { connect } from 'react-redux';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../../redux/user/user.actions';
import { RegistrationObject } from "../interfaces/user.interface";
import firebase from "firebase";
import axios from "axios";
import { Link } from "react-router-dom";

interface IHeaderProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    currentUser?: firebase.User,
    currentUserInfo?: RegistrationObject
    currentUserToken?: string
}

const Header = (props: IHeaderProps) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
    const [followRequests, setFollowRequests] = useState([]);

    //Set listener for active follow requests
    useEffect(() => {
        const unsub = firebase.database().ref("FollowRequests").child(props.currentUser?.uid!).on("value", ssh => {
            if (ssh.exists()) {
                setFollowRequests(Object.values(ssh.val()));

                console.log("@R-REQ ", Object.values(ssh.val()));

            }
            else {
                setFollowRequests([])
            }
        }, (error: any) => {
            console.log(error);

        });

        return () => firebase.database().ref("FollowingRequests").off("value", unsub);


    }, [])

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const onFollowApproved = async (uid: string) => {
        await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/users/approve-follow", {

            targetUid: uid
        }, {
            headers: {
                authorization: `Bearer ${props.currentUserToken}`
            }
        });
    }

    const onFollowIgnored = async (uid: string) => {
        await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/users/ignore-follow", {

            targetUid: uid
        }, {
            headers: {
                authorization: `Bearer ${props.currentUserToken}`
            }
        });
    }

    return (
        <nav className="Nav">
            <Modal
                style={{ height: "50%", }}
                title="Approve or Ignore Follow Requests"
                visible={modalVisible}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}  >
                <List

                    itemLayout="horizontal"
                    dataSource={followRequests}
                    renderItem={(item: any) => (
                        <List.Item
                            actions={[<p onClick={() => onFollowApproved(item.uid)} style={{ color: "green", cursor: "pointer" }} key={JSON.stringify(item)}>Approve</p>, <p onClick={() => onFollowIgnored(item.uid)} style={{ color: "red", cursor: "pointer" }} key={JSON.stringify(item)} >Ignore</p>]}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.image_url} />}
                                title={<Link to={{ pathname: `/${item.username}` }}>{item.username}</Link>}
                                description={item.username}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
            <Modal
                style={{ height: "50%", }}
                title="Add a new post 💖"
                visible={postModalVisible}
                okText={null}
                // onOk={handleOk}
                footer={null}
                onCancel={handleCancel} >

            </Modal>
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
                        <Tooltip title="Add a new post 🤳">
                            <a> <AppstoreAddOutlined onClick={() => setPostModalVisible(true)} size={25} /> </a>
                        </Tooltip>

                        <Col span="3">
                            <Link
                                className="nav-link"
                                to={{
                                    pathname: `/`,
                                }}
                            >
                                <HomeOutlined size={25} />
                            </Link>

                        </Col>

                        <Col span="3">
                            <Link
                                onClick={() => setModalVisible(true)}
                                className="nav-link"
                                to={{

                                }}
                            >

                                <Badge size="small" count={followRequests && followRequests.length}>
                                    <UsergroupAddOutlined size={25} />
                                </Badge>
                            </Link>
                        </Col>
                        <Col span="3">
                            <Link
                                className="nav-link"
                                to={{
                                    pathname: `/${props.currentUserInfo?.username}`,
                                }}
                            >
                                <UserOutlined size={25} />
                            </Link>

                            {/* <span>
                                <UserOutlined size={25} onClick={() => window.location.replace(`/profile/${props.currentUserInfo!.username}`)} />
                            </span> */}
                        </Col>
                        <Col span="3">
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
        currentUserToken: state.user.currentUserToken,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentUserListener: () => dispatch(setCurrentUserListener()),
        setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Header);