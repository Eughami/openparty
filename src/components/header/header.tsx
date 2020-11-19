import React, { useEffect, useState } from 'react';
import './header.css';
import {
    Col,
    Row,
    Badge,
    Modal,
    Menu,
    Button,
    Dropdown,
    List,
    Avatar,
    Form,
    Input,
    Select,
    Upload,
    message,
    Progress,
    DatePicker,
    Divider,
} from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    UsergroupAddOutlined,
    VideoCameraAddOutlined,
    AlertOutlined,
    UploadOutlined,
} from '@ant-design/icons';

import OpenPartyLogo from '../images/openpaarty.logo.png';
import { connect } from 'react-redux';
import {
    setCurrentUserListener,
    setCurrentUserRootDatabaseListener,
} from '../../redux/user/user.actions';
import { RegistrationObject } from '../interfaces/user.interface';
import firebase from 'firebase';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RcFile } from 'antd/lib/upload/interface';
import bluebird from 'bluebird';
import { makeId } from '../post/post.actions';
import ImgCrop from 'antd-img-crop';
import { Moment } from 'moment';
import AsyncMention from '../mentions/mentions.component';
import {
    ADD_POST_ENDPOINT,
    API_BASE_URL,
    API_BASE_URL_OPEN,
    APPROVE_FOLLOW_ENDPOINT,
    IGNORE_FOLLOW_ENDPOINT,
    PING_ENDPOINT,
} from '../../service/api';

interface IHeaderProps {
    setCurrentUserListener?: () => Promise<any>;
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
    currentUser?: firebase.User;
    currentUserInfo?: RegistrationObject;
    currentUserToken?: string;
}

const { Search } = Input;

const Header = (props: IHeaderProps) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
    const [postWorking, setPostWorking] = useState<boolean>(false);
    const [followRequests, setFollowRequests] = useState([]);
    const { Option } = Select;
    const [form] = Form.useForm();

    //Set listener for active follow requests
    useEffect(() => {
        const unsub = firebase
            .database()
            .ref('FollowRequests')
            .child(props.currentUser?.uid!)
            .on(
                'value',
                (ssh) => {
                    if (ssh.exists()) {
                        setFollowRequests(Object.values(ssh.val()));

                        console.log('@R-REQ ', Object.values(ssh.val()));
                    } else {
                        setFollowRequests([]);
                    }
                },
                (error: any) => {
                    console.log(error);
                }
            );

        return () =>
            firebase.database().ref('FollowingRequests').off('value', unsub);
    }, [props.currentUser]);

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const onFollowApproved = async (uid: string) => {
        await axios.post(
            `${API_BASE_URL}${APPROVE_FOLLOW_ENDPOINT}`,
            //   'http://localhost:5000/openpaarty/us-central1/api/v1/users/approve-follow',
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
            //   'http://localhost:5000/openpaarty/us-central1/api/v1/users/ignore-follow',
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

    const handleMenuClick = (e: any) => {
        // message.info('Click on menu item.');
        // console.log('click', e);
    };

    const menu = (props: IHeaderProps) => (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" icon={<UserOutlined />}>
                <Link
                    className="nav-link"
                    to={{
                        pathname: `/${props.currentUserInfo?.username}`,
                    }}
                >
                    Profile{' '}
                    <span role="img" aria-label="muah">
                        👄
          </span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<AlertOutlined />}>
                Notifications{' '}
                <span role="img" aria-label="smurth">
                    🧐
        </span>
            </Menu.Item>
            <Menu.Item
                onClick={() => setPostModalVisible(true)}
                key="3"
                icon={<VideoCameraAddOutlined />}
            >
                Add a new Post{' '}
                <span role="img" aria-label="selfie">
                    🤳
        </span>
            </Menu.Item>
            <hr />
            <Menu.Item
                onClick={() => firebase.auth().signOut()}
                key="4"
                icon={<LogoutOutlined size={25}
                />}
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const clearForm = () => form.resetFields();

    const onFinish = async (values: any) => {
        // console.log("POST DATA:: ", values['event-date'] && values['event-date'].unix());
        // if (values['event-date'].unix() > new Date().getTime()) {
        //     message.error("Selected time must be in the future");
        // }
        // clearForm();
        // return
        let postData: any = {
            caption: values.caption,
            privacy: values.privacy,
            tags: values.tags
                ? values.tags.match(/#\S+/g).map((str: string) => str.replace(/#/g, ''))
                : [],
            user: {
                username: props.currentUserInfo?.username,
                image_url: props.currentUserInfo?.image_url,
            },
            date_of_event: values['event-date'].unix(),
        };

        setPostWorking(true);

        const urls: string[] = [];

        await bluebird.map(
            values.upload,
            async (file: any) => {
                urls.push(await uploadFile(file.originFileObj));
            },
            { concurrency: values.upload.length }
        );

        postData.image_url = urls;

        await axios
            .post(
                `${API_BASE_URL}${ADD_POST_ENDPOINT}`,
                // 'http://localhost:5000/openpaarty/us-central1/api/v1/posts/',
                postData,
                {
                    headers: {
                        authorization: `Bearer ${props.currentUserToken}`,
                    },
                }
            )
            .then((data) => {
                console.log('DATA: ', data.data);
                message.success('Post uploaded 🌟 ');
                setPostWorking(false);
                setPostModalVisible(false);
                clearForm();
            })
            .catch((error) => {
                setPostWorking(false);
                setPostModalVisible(false);
                message.error('Post upload failed');
                console.log('@UPLOAD POST ERROR: ', error);
            });
    };

    const uploadFile = async (file: RcFile): Promise<string> => {
        const ref = firebase
            .storage()
            .ref('user-generated-content')
            .child(props.currentUser!.uid)
            .child('uploads')
            .child('post-images')
            .child(makeId(30));
        const uploaded = await ref.put(file, {
            contentType: 'image/png',
        });

        // setImageUploaded(true);

        // setUploadedImageUrl(await uploaded.ref.getDownloadURL());

        return await uploaded.ref.getDownloadURL();
    };

    const onPreview = async (file: any) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow && imgWindow.document.write(image.outerHTML);
    };

    return (
        <nav className="Nav">
            <Modal
                style={{ height: '50%' }}
                title="Approve or Ignore Follow Requests"
                visible={modalVisible}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
            >
                <List
                    itemLayout="horizontal"
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
                                description={item.username}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
            <Modal
                style={{ height: '50%' }}
                title="Add a new post 💖"
                visible={postModalVisible}
                okText={null}
                onOk={() => setPostModalVisible(false)}
                onCancel={() => setPostModalVisible(false)}
                footer={null}
            >
                {/* TODO: ADD OPTION FOR AGE, PREVIEW BEFORE UPLOAD POST */}
                <Form
                    form={form}
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={onFinish}
                // initialValues={{ }}
                >
                    <Form.Item
                        label="Caption"
                        name="caption"
                        rules={[{ required: true, message: 'Please type a caption' }]}
                    >
                        <AsyncMention
                            autoSize
                            placeholder="Provide a caption for this post"
                        />
                        {/* <Input multiple placeholder="Provide a caption for this post" /> */}
                    </Form.Item>

                    <Form.Item
                        name="privacy"
                        label="Privacy"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select privacy' }]}
                    >
                        <Select placeholder="Please select post privacy">
                            <Option value="open">Public</Option>
                            <Option value="hard-closed">Private</Option>
                            <Option value="followers">Followers</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="event-date"
                        label="Date of Event"
                        rules={[
                            {
                                required: true,
                                message: 'Please provide a date for this event',
                            },
                        ]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>

                    <Form.Item label="Tags" name="tags">
                        <Input placeholder="(Use # to separate tags)" />
                    </Form.Item>

                    <Form.Item
                        name="upload"
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Or drop image into box"
                        rules={[{ required: true, message: 'Please select an image' }]}
                    >
                        {/* <ImgCrop rotate > */}
                        <Upload
                            accept="image/*"
                            onPreview={onPreview}
                            name="logo"
                            action={
                                // 'http://localhost:5000/openpaarty/us-central1/api1/v1/ping'
                                `${API_BASE_URL_OPEN}${PING_ENDPOINT}`
                            }
                            progress={{ status: 'success' }}
                            listType="picture-card"
                        >
                            {/* <Button icon={<UploadOutlined />}>Click to upload</Button> */}
              + Upload
            </Upload>
                        {/* </ImgCrop> */}
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                        <Button loading={postWorking} type="primary" htmlType="submit">
                            Post
            </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="Nav-menus">
                <div className="Nav-brand">
                    <Link
                        to={{
                            pathname: '/',
                        }}
                    >
                        <img
                            style={{ height: '100%', width: '40%' }}
                            src={OpenPartyLogo}
                            alt="open-party"
                        />
                    </Link>
                    {/* <a href="/">
                    </a> */}
                </div>
                <Col
                    className=""
                    xs={{ span: 0 }}
                    lg={{ span: 6, offset: 2 }}
                    xxl={{ span: 5, offset: 1 }}
                >
                    {/* SearchBar */}
                    <Search style={{ width: "80%" }} placeholder="Search" />
                </Col>
                <Col className="" offset={1} span={6}>
                    <Row style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                        {/* <Tooltip title="Add a new post 🤳">
                            <a> <AppstoreAddOutlined onClick={() => setPostModalVisible(true)} size={25} /> </a>
                        </Tooltip> */}

                        <Col span="4">
                            <Link
                                className="nav-link"
                                to={{
                                    pathname: `/`,
                                }}
                            >
                                <HomeOutlined size={25} />
                            </Link>
                        </Col>

                        <Col span="4">
                            <Link
                                onClick={() => setModalVisible(true)}
                                className="nav-link"
                                to={{}}
                            >
                                <Badge
                                    size="small"
                                    count={followRequests && followRequests.length}
                                >
                                    <UsergroupAddOutlined size={25} />
                                </Badge>
                            </Link>
                        </Col>

                        <Col span="4">
                            <Link to={{}}>
                                <Dropdown overlay={menu(props)}>
                                    {/* <UserOutlined /> */}
                                    <Avatar style={{ verticalAlign: 'middle' }} src={props.currentUserInfo?.image_url} >
                                    </Avatar>
                                </Dropdown>
                            </Link>
                        </Col>
                        {/* <Col span="3">
                            
                        </Col> */}
                    </Row>
                </Col>
            </div>
        </nav>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
