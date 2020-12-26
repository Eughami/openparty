import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from 'antd';
import React, { useState } from 'react';
import {
  HomeOutlined,
  SearchOutlined,
  PlusSquareOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { RegistrationObject } from './interfaces/user.interface';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncMention from './mentions/mentions.component';
import {
  ADD_POST_ENDPOINT,
  API_BASE_URL,
  API_BASE_URL_OPEN,
  PING_ENDPOINT,
} from '../service/api';
import { makeId } from './post/post.actions';
import { RcFile } from 'antd/lib/upload/interface';
import firebase from 'firebase';
import bluebird from 'bluebird';
import axios from 'axios';

interface IMobileNavbarProps {
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

const { Option } = Select;

const MobileNavbar = (props: IMobileNavbarProps) => {
  const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [postWorking, setPostWorking] = useState<boolean>(false);
  const [form] = Form.useForm();

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
    <>
      <Modal
        style={{}}
        title="Add a new post 💖"
        centered
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

      <Col style={{ zIndex: 2 }} xs={24} md={0}>
        <Row align="middle" justify="space-around" className="mobile__navbar">
          <Link style={{ color: 'black' }} to="/">
            <HomeOutlined style={{ fontSize: 28 }} />
          </Link>

          <Link style={{ color: 'black' }} to="/explore">
            <SearchOutlined style={{ fontSize: 28 }} />
          </Link>

          <PlusSquareOutlined
            onClick={() => setPostModalVisible(true)}
            style={{ fontSize: 28 }}
          />

          <Link style={{ color: 'black' }} to="/account/activity">
            <HeartOutlined style={{ fontSize: 28 }} />
          </Link>

          <Link
            style={{
              color: 'black',
              pointerEvents: !props.currentUserInfo ? 'none' : 'auto',
            }}
            to={`/${props.currentUserInfo?.username}`}
          >
            <Avatar
              src={props.currentUserInfo?.image_url}
              alt="user avatar"
              size={32}
            />
          </Link>
        </Row>
      </Col>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
  };
};

export default connect(mapStateToProps)(MobileNavbar);
