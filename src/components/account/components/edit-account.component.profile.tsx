import React, { useState } from 'react';
import { Form, Input, Button, Row, Select, message, Upload } from 'antd';
import { ProfileAvatar } from '../../profile/components/profile.component.pfp';
import { RegistrationObject } from '../../interfaces/user.interface';
import { ProfileUsername } from '../../profile/components/profile.component.username';
import { Link } from 'react-router-dom';
import { prefixSelector } from '../../register';
import firebase from 'firebase';
import { API_BASE_URL_OPEN, PING_ENDPOINT } from '../../../service/api';
import { RcFile } from 'antd/lib/upload';

interface IEditProfileInterface {
  user: RegistrationObject;
}

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const descStyle: React.CSSProperties = {
  color: '#8e8e8e',
};

export const EditProfile = (props: IEditProfileInterface) => {
  const { user } = props;
  const [form] = Form.useForm();
  const [updateWorking, setUpdateWorking] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    file?: RcFile;
  }>({ file: undefined, url: '' });

  const uploadFile = async (file: RcFile): Promise<string> => {
    const ref = firebase
      .storage()
      .ref('user-generated-content')
      .child(user.uid)
      .child('uploads')
      .child('account-images')
      .child('pfp');
    const uploaded = await ref.put(file, {
      contentType: 'image/png',
    });

    return await uploaded.ref.getDownloadURL();
  };

  const onFinish = async (values: any) => {
    // console.log(values, _.isEqual({}, {}));
    setUpdateWorking(true);

    let newImageUrl: string | undefined = undefined;

    if (selectedImage.file) {
      newImageUrl = await uploadFile(selectedImage.file);
    } else {
      message.info('There was a problem updating your profile picture', 5);
    }

    if (newImageUrl) {
      await firebase
        .database()
        .ref('Users')
        .child(user.uid)
        .update({ ...values, image_url: newImageUrl });
    } else {
      await firebase
        .database()
        .ref('Users')
        .child(user.uid)
        .update({ ...values });
    }

    setSelectedImage({ url: '', file: undefined });

    message.success('Profile updated 🥂');
    setUpdateWorking(false);
  };

  return (
    <Form
      scrollToFirstError
      form={form}
      {...layout}
      name="account-edit"
      onFinish={onFinish}
      initialValues={{
        username: user.username,
        email: user.email,
        bio: user.bio,
        website: user.website,
        name: user.name || null,
        phone: user.phone,
        prefix: user.prefix,
        gender: user.gender || null,
      }}
    >
      <Form.Item>
        <Row justify="center" align="top">
          <Upload
            showUploadList={false}
            multiple={false}
            accept="image/*"
            name="logo"
            beforeUpload={(file) => {
              if (
                !['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(
                  file.type
                ) /*file.type !== 'image/png' */
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
            action={(file) => {
              const url = URL.createObjectURL(file);
              setSelectedImage({ file, url });
              return `${API_BASE_URL_OPEN}${PING_ENDPOINT}`;
            }}
          >
            <span
              style={{
                cursor: updateWorking ? 'progress' : 'pointer',
                pointerEvents: updateWorking ? 'none' : 'auto',
              }}
            >
              <ProfileAvatar
                dirSrc={
                  selectedImage.url.length > 0 ? selectedImage.url : undefined
                }
                imageSize={40}
                user={user}
              />
            </span>
          </Upload>

          <div style={{ marginLeft: 20 }}>
            <ProfileUsername user={user} />

            <Upload
              showUploadList={false}
              multiple={false}
              accept="image/*"
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
              action={(file) => {
                const url = URL.createObjectURL(file);
                setSelectedImage({ file, url });
                return `${API_BASE_URL_OPEN}${PING_ENDPOINT}`;
              }}
            >
              <Link
                style={{
                  cursor: updateWorking ? 'progress' : 'pointer',
                  pointerEvents: updateWorking ? 'none' : 'auto',
                }}
                to={{}}
              >
                <p>Change profile photo</p>
              </Link>
            </Upload>
          </div>
        </Row>
      </Form.Item>
      <Form.Item
        help={<p style={{ ...descStyle }}>Changes may take time to reflect*</p>}
        name="name"
        label="Name"
      >
        <Input />
      </Form.Item>
      <Form.Item
        help={<p style={{ ...descStyle }}>Changes may take time to reflect*</p>}
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your Username',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            type: 'url',
            message: 'The input is not valid url',
          },
        ]}
        name="website"
        label="Website"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item
        help={
          <p style={{ ...descStyle }}>
            A short info about you{' '}
            <span role="img" aria-label="smile-blush">
              😊
            </span>
          </p>
        }
        name="bio"
        label="Bio"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="gender" label="Gender">
        <Select>
          <Option value="male">Male 🎩</Option>
          <Option value="female">Female 👒</Option>
          <Option value="other">Other 🤔</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button loading={updateWorking} type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};
