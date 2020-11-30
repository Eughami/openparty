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
  DatePicker,
  Space,
  Spin,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  VideoCameraAddOutlined,
  AlertOutlined,
  NotificationTwoTone,
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
import AsyncMention from '../mentions/mentions.component';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  ADD_POST_ENDPOINT,
  API_BASE_URL,
  API_BASE_URL_OPEN,
  APPROVE_FOLLOW_ENDPOINT,
  IGNORE_FOLLOW_ENDPOINT,
  PING_ENDPOINT,
} from '../../service/api';
import TempHeaderNotification from './temp-header';

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
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
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

  const handleMenuClick = () => {
    // message.info('Click on menu item.');
    // console.log('click', e);
  };

  const menu = (props: IHeaderProps) => (
    // <div className="profile__dropdown">
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
        icon={<LogoutOutlined size={25} />}
      >
        Logout
      </Menu.Item>
    </Menu>
    // </div>
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
      .post(`${API_BASE_URL}${ADD_POST_ENDPOINT}`, postData, {
        headers: {
          authorization: `Bearer ${props.currentUserToken}`,
        },
      })
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

  const focusShit = (e: any) => {
    console.log('in of focus', e.target.id);
    if (e.target.id !== 'notification-area') {
      setShowNotification(false);
    }
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
              action={`${API_BASE_URL_OPEN}${PING_ENDPOINT}`}
              progress={{ status: 'success' }}
              listType="picture-card"
            >
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
        <Row align="middle" className="test-border">
          <Col
            lg={{ span: 6, offset: 4 }}
            md={{ span: 6, offset: 2 }}
            xs={{ span: 8, offset: 2 }}
          >
            <Link
              to={{
                pathname: '/',
              }}
            >
              <img
                height="50px"
                width="150px"
                src={OpenPartyLogo}
                alt="open-party"
              />
            </Link>
          </Col>
          <Col xl={{ span: 4 }} md={{ span: 6 }} xs={{ span: 0 }}>
            <Search style={{ width: '80%' }} placeholder="Search" />
          </Col>
          <Col
            lg={{ span: 7, offset: 1 }}
            md={{ span: 8, offset: 2 }}
            xs={{ span: 6, offset: 4 }}
          >
            <Row justify="start" align="stretch">
              <Space direction="horizontal" size="large">
                <Link
                  className="nav-link"
                  to={{
                    pathname: `/`,
                  }}
                >
                  <HomeOutlined style={{ fontSize: '22px' }} />
                </Link>

                <Link
                  onClick={() => setModalVisible(true)}
                  className="nav-link"
                  to={{}}
                >
                  <Badge
                    size="small"
                    count={followRequests && followRequests.length}
                  >
                    <UsergroupAddOutlined style={{ fontSize: '22px' }} />
                  </Badge>
                </Link>

                <Link
                  to={{}}
                  onClick={() => {
                    setloading(true);
                    setShowNotification(!showNotification);
                    setTimeout(() => {
                      setloading(false);
                    }, 1000);
                  }}
                >
                  <NotificationTwoTone style={{ fontSize: '22px' }} />
                </Link>

                <Link to={{}}>
                  <Dropdown
                    overlay={menu(props)}
                    placement="bottomCenter"
                    arrow
                    // trigger={['click']}
                  >
                    <Avatar
                      style={{ fontSize: '22px' }}
                      src={props.currentUserInfo?.image_url}
                    />
                  </Dropdown>
                </Link>
              </Space>
            </Row>
          </Col>
        </Row>
      </div>
      <Row>
        {showNotification && (
          <Row
            id="notificationCover"
            className="notification__cover"
            onClick={(e: any) => focusShit(e)}
          >
            <Col
              id="notification-area"
              className="profile__dropdown"
              xxl={{ span: 5, offset: 14 }}
              xl={{ span: 6, offset: 14 }}
              lg={{ span: 7, offset: 15 }}
              md={{ span: 8, offset: 13 }}
              sm={{ span: 12, offset: 10 }}
              xs={{ span: 15, offset: 8 }}
            >
              {loading ? (
                <div className="profile__dropdown__loading">
                  <Spin size="large" />
                </div>
              ) : (
                // </Col>
                <PerfectScrollbar>
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                  <TempHeaderNotification />
                </PerfectScrollbar>
              )}
            </Col>
          </Row>
          // </div>
        )}
      </Row>
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
