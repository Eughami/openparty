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
  notification,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  VideoCameraAddOutlined,
  FireOutlined,
  NotificationOutlined,
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
import TimeAgo from 'react-timeago';

export interface IHeaderProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

//We can also use gifs 👀
export const LIKED_POST_REACTION_ARRAY = [
  <span aria-label="not" role="img">
    👀
  </span>,
  <span aria-label="not" role="img">
    🙌
  </span>,
  <span aria-label="not" role="img">
    🎉
  </span>,
  <span aria-label="not" role="img">
    🤳
  </span>,
  <span aria-label="not" role="img">
    👍
  </span>,
  <img
    height="50px"
    style={{ objectFit: 'contain' }}
    width="30px"
    src={require('../images/poggers.png')}
    alt="poggers"
  />,
  <img
    height="50px"
    style={{ objectFit: 'contain' }}
    width="30px"
    src={require('../images/pepepoggers.jpg')}
    alt="pepe-poggers"
  />,
];

const { Search } = Input;

const { Option } = Select;
const Header = (props: IHeaderProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [postWorking, setPostWorking] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(
    true
  );
  const [followRequests, setFollowRequests] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [form] = Form.useForm();

  //Set listener for active follow requests
  useEffect(() => {
    const un_sub = firebase
      .database()
      .ref('FollowRequests')
      .child(props.currentUser?.uid!)
      .on(
        'value',
        (ssh) => {
          if (ssh.exists()) {
            setFollowRequests(
              Object.values(ssh.val()).sort(
                (s1: any, s2: any) => s2.time - s1.time
              ) as any
            );
          } else {
            setFollowRequests([]);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

    return () =>
      firebase
        .database()
        .ref('FollowRequests')
        .child(props.currentUser?.uid!)
        .off('value', un_sub);
  }, [props.currentUser]);

  //Set listener for user notifications
  useEffect(() => {
    const un_sub = firebase
      .database()
      .ref('Notifications')
      .child(props.currentUser?.uid!)
      .limitToLast(50)
      .on(
        'value',
        (ssh) => {
          if (ssh.exists()) {
            const temp: any = {};

            ssh.forEach((post) => {
              if (post.val().likes && post.key !== 'HOT UPDATE') {
                temp[`${post.key}`] = Object.values(post.val().likes);
                temp[`${post.key}`].ref = post.key;
              }

              if (post.val().comments && post.key !== 'HOT UPDATE') {
                temp[`${post.key}`] = Object.values(post.val().comments);
                temp[`${post.key}`].ref = post.key;
              }

              if (post.val().mentions && post.key !== 'HOT UPDATE') {
                temp[`${post.key}`] = Object.values(post.val().mentions);
                temp[`${post.key}`].ref = post.key;
              }
            });

            setUserNotifications(
              []
                .concat(...(Object.values(temp) as any[]))
                .sort((n1: any, n2: any) => n2.time - n1.time) as any
            );

            setNotificationsLoading(false);
          } else {
            setUserNotifications([]);
            setNotificationsLoading(false);
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
        .off('value', un_sub);
  }, [props.currentUser]);

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
            if (ssh.child('desc').exists()) {
              notification.open({
                message: ssh.val().desc,
                description: ssh.val().desc,
                icon:
                  LIKED_POST_REACTION_ARRAY[
                    Math.floor(Math.random() * LIKED_POST_REACTION_ARRAY.length)
                  ],
                placement: 'bottomRight',
                onClick: () => setShowNotification(true),
                style: { cursor: 'pointer' },
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

      <Menu.Item
        onClick={() => setPostModalVisible(true)}
        key="2"
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
        key="3"
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
  const focusFollowRequestShit = (e: any) => {
    console.log('in of focus', e.target.id);
    if (e.target.id !== 'follow-request-area') {
      setModalVisible(false);
    }
  };

  return (
    <nav className="Nav">
      <Modal
        style={{ height: '50%' }}
        title="Approve or Ignore Follow Requests"
        visible={false}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        <List
          itemLayout="horizontal"
          size="small"
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
                description={
                  <TimeAgo date={new Date(`${item.time}`)}></TimeAgo>
                }
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
              beforeUpload={(file) => {
                if (
                  ![
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/gif',
                  ].includes(file.type) /*file.type !== 'image/png' */
                ) {
                  message.error(`${file.name} is not a valid image`);
                }
                return [
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/gif',
                ].includes(file.type); // file.type === 'image/png';
              }}
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
        <Row align="middle">
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
            xs={{ span: 8, offset: 2 }}
          >
            <Row justify="start" align="stretch">
              <Space direction="horizontal" size="large">
                <Col sm={24} xs={0}>
                  <Link
                    to={{
                      pathname: `/`,
                    }}
                  >
                    <HomeOutlined
                      style={{ fontSize: '22px', color: 'black' }}
                    />
                  </Link>
                </Col>

                <Col>
                  <Link onClick={() => setModalVisible(true)} to={{}}>
                    <Badge
                      size="small"
                      count={followRequests && followRequests.length}
                    >
                      <UsergroupAddOutlined
                        style={{ fontSize: '22px', color: 'black' }}
                      />
                    </Badge>
                  </Link>
                </Col>
                <Col>
                  <Link
                    to={{}}
                    onClick={() => {
                      setShowNotification(true);
                    }}
                  >
                    <NotificationOutlined
                      twoToneColor="black"
                      style={{ fontSize: '22px', color: 'black' }}
                    />
                  </Link>
                </Col>
                <Col>
                  <Link
                    to={{
                      pathname: '/explore',
                    }}
                  >
                    <FireOutlined
                      style={{ fontSize: '22px', color: 'black' }}
                    />
                  </Link>
                </Col>
                <Col>
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
                </Col>
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
              {notificationsLoading ? (
                <div className="profile__dropdown__loading">
                  <Spin size="large" />
                </div>
              ) : (
                <PerfectScrollbar>
                  {userNotifications.length > 0 &&
                    userNotifications.map((not: any, index) => (
                      <TempHeaderNotification
                        time={not.time}
                        key={index}
                        imageUrl={not.image_url}
                        text={not.desc}
                        username={not.username}
                        link={not.ref}
                        thumbnail={not.thumbnail}
                      />
                    ))}
                </PerfectScrollbar>
              )}
            </Col>
          </Row>
        )}

        {modalVisible && (
          <Row
            id="followRequestsCover"
            className="notification__cover"
            onClick={(e: any) => focusFollowRequestShit(e)}
          >
            <Col
              id="follow-request-area"
              className="profile__dropdown"
              xxl={{ span: 5, offset: 14 }}
              xl={{ span: 6, offset: 14 }}
              lg={{ span: 7, offset: 15 }}
              md={{ span: 8, offset: 13 }}
              sm={{ span: 12, offset: 10 }}
              xs={{ span: 15, offset: 8 }}
            >
              {notificationsLoading ? (
                <div className="profile__dropdown__loading">
                  <Spin size="large" />
                </div>
              ) : (
                <PerfectScrollbar>
                  <List
                    itemLayout="horizontal"
                    dataSource={followRequests}
                    renderItem={(item: any) => (
                      <List.Item
                        actions={[
                          <p
                            onClick={() => onFollowApproved(item.uid)}
                            style={{
                              color: 'green',
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
                            key={JSON.stringify(item)}
                          >
                            Approve
                          </p>,
                          <p
                            onClick={() => onFollowIgnored(item.uid)}
                            style={{
                              color: 'red',
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
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
                          description={
                            <p style={{ fontSize: 12 }}>
                              <TimeAgo date={new Date(item.time)}></TimeAgo>
                            </p>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </PerfectScrollbar>
              )}
            </Col>
          </Row>
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
