import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Select,
  message,
  Upload,
  List,
  Popconfirm,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ProfileAvatar } from '../../profile/components/profile.component.pfp';
import { RegistrationObject } from '../../interfaces/user.interface';
import { ProfileUsername } from '../../profile/components/profile.component.username';
import { Link } from 'react-router-dom';
import { prefixSelector } from '../../register';
import firebase from 'firebase';
import {
  API_BASE_URL,
  API_BASE_URL_OPEN,
  EDIT_ACCOUNT_INFO_ENDPOINT,
  PING_ENDPOINT,
  USERNAME_AVAILABLE_ENDPOINT,
} from '../../../service/api';
import { RcFile } from 'antd/lib/upload';
import { PopupboxContainer, PopupboxManager } from 'react-popupbox';
import { DEFAULT_IMAGE_URL } from '../../profile/components/profile.posts.component';
import Axios from 'axios';

interface IEditProfileInterface {
  user: RegistrationObject;
  currentUser: firebase.User;
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
  const { user, currentUser } = props;
  const [form] = Form.useForm();
  const [updateWorking, setUpdateWorking] = useState<boolean>(false);
  const [
    deleteProfilePictureWorking,
    setDeleteProfilePictureWorking,
  ] = useState<boolean>(false);
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
    }

    const token = await currentUser.getIdToken(true);
    if (values.username !== user.username) {
      try {
        const res = await Axios.post(
          `${API_BASE_URL}${USERNAME_AVAILABLE_ENDPOINT}`,
          {
            username: values.username,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          if (!res.data.available) {
            setUpdateWorking(false);
            setSelectedImage({ url: '', file: undefined });
            return message.warn('Sorry, this username is already taken.');
          }
        } else {
          setUpdateWorking(false);
          setSelectedImage({ url: '', file: undefined });
          return message.error(
            'Something went wrong while updating your profile.'
          );
        }
      } catch (error) {
        console.log('@AXIOS CHECK USERNAME AVAILABLE ERROR: ', error);

        setUpdateWorking(false);
        setSelectedImage({ url: '', file: undefined });
        return message.error(
          'Something went wrong while updating your profile.'
        );
      }
    }

    if (newImageUrl) {
      await firebase
        .database()
        .ref('Users')
        .child(user.uid)
        .update({ image_url: newImageUrl });

      return Axios.patch(
        `${API_BASE_URL}${EDIT_ACCOUNT_INFO_ENDPOINT}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          //username already taken
          if (res.status === 200) {
            setUpdateWorking(false);
            setSelectedImage({ url: '', file: undefined });
            return message.warn('Sorry, this username is already taken.');
          }
          //
          if (res.status === 201 || res.status === 202) {
            setSelectedImage({ url: '', file: undefined });
            message.success('Profile updated 🥂');
            setUpdateWorking(false);
          } else {
            setUpdateWorking(false);
            setSelectedImage({ url: '', file: undefined });
            console.log(
              '@AXIOS EDIT ACCOUNT INFO UNEXPECTED RES CODE: ',
              res.data,
              res.status
            );
            return message.error(
              'Something went wrong while updating your profile.'
            );
          }
        })
        .catch((error) => {
          console.log('@AXIOS EDIT ACCOUNT INFO ERROR: ', error);

          setUpdateWorking(false);
          setSelectedImage({ url: '', file: undefined });
          return message.error(
            'Something went wrong while updating your profile.'
          );
        });
    } else {
      return Axios.patch(
        `${API_BASE_URL}${EDIT_ACCOUNT_INFO_ENDPOINT}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          //username already taken
          if (res.status === 200) {
            setUpdateWorking(false);
            setSelectedImage({ url: '', file: undefined });
            return message.warn('Sorry, this username is already taken.');
          }
          //
          if (res.status === 201 || res.status === 202) {
            setSelectedImage({ url: '', file: undefined });
            message.success('Profile updated 🥂');
            setUpdateWorking(false);
          } else {
            setUpdateWorking(false);
            setSelectedImage({ url: '', file: undefined });
            console.log(
              '@AXIOS EDIT ACCOUNT INFO UNEXPECTED RES CODE: ',
              res.data,
              res.status
            );
            return message.error(
              'Something went wrong while updating your profile.'
            );
          }
        })
        .catch((error) => {
          console.log('@AXIOS EDIT ACCOUNT INFO ERROR: ', error);

          setUpdateWorking(false);
          setSelectedImage({ url: '', file: undefined });
          return message.error(
            'Something went wrong while updating your profile.'
          );
        });
    }
  };

  const setDefaultImageUrl = async () => {
    await firebase
      .database()
      .ref('Users')
      .child(user.uid)
      .update({ image_url: DEFAULT_IMAGE_URL })
      .then(() => {
        message.success('Profile image removed');
      })
      .catch((e) => {
        console.log('@REVERT DEFAULT IMAGE URL ERROR: ', e);

        message.error('There was an error while removing your profile image');
      })
      .finally(() => {
        setDeleteProfilePictureWorking(false);
        PopupboxManager.close();
      });
  };

  const showModalEditProfileImageOptions = () => {
    const content = (
      <List
        size="small"
        header={null}
        footer={null}
        dataSource={[
          <span style={{ width: '100%', textAlign: 'center' }}>
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
                  ].includes(file.type)
                ) {
                  message.error(`${file.name} is not a valid image`);
                }
                return [
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/gif',
                ].includes(file.type);
              }}
              action={(file) => {
                const url = URL.createObjectURL(file);
                setSelectedImage({ file, url });
                PopupboxManager.close();
                return `${API_BASE_URL_OPEN}${PING_ENDPOINT}`;
              }}
            >
              <Button style={{ fontWeight: 'bold' }} block type="link">
                Upload photo
              </Button>
            </Upload>
          </span>,
          <Popconfirm
            okButtonProps={{ loading: deleteProfilePictureWorking }}
            title="Are you sure？"
            onConfirm={() => setDefaultImageUrl()}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button style={{ fontWeight: 'bold' }} block type="link" danger>
              Remove Photo
            </Button>
          </Popconfirm>,

          <Button
            onClick={() => PopupboxManager.close()}
            style={{ fontWeight: 'bold' }}
            block
            type="link"
          >
            Cancel
          </Button>,
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    );
    PopupboxManager.open({ content });
  };

  return (
    <>
      <PopupboxContainer />
      <Form
        scrollToFirstError
        form={form}
        {...layout}
        name="account-edit"
        onFinish={onFinish}
        initialValues={{
          username: user.username,
          email: user.email,
          bio: user.bio || null,
          website: user.website || null,
          name: user.name || null,
          phone: user.phone || null,
          prefix: user.prefix,
          gender: user.gender || null,
        }}
      >
        <Form.Item>
          <Row justify="center" align="top">
            {/* <Upload
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
                  ].includes(file.type)
                ) {
                  message.error(`${file.name} is not a valid image`);
                }
                return [
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/gif',
                ].includes(file.type);
              }}
              action={(file) => {
                const url = URL.createObjectURL(file);

                setSelectedImage({ file, url });
                return `${API_BASE_URL_OPEN}${PING_ENDPOINT}`;
              }}
            >
            </Upload> */}
            <span
              onClick={() => showModalEditProfileImageOptions()}
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

            <div style={{ marginLeft: 20 }}>
              <ProfileUsername user={user} />

              <Link
                onClick={() => showModalEditProfileImageOptions()}
                style={{
                  cursor: updateWorking ? 'progress' : 'pointer',
                  pointerEvents: updateWorking ? 'none' : 'auto',
                }}
                to={{}}
              >
                <p>Change profile photo</p>
              </Link>
            </div>
          </Row>
        </Form.Item>
        <Form.Item
          help={
            <p style={{ ...descStyle }}>Changes may take time to reflect*</p>
          }
          name="name"
          label="Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          help={
            <p style={{ ...descStyle }}>Changes may take time to reflect*</p>
          }
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
            <Option value="male">
              <span role="img" aria-label="male-hat">
                Male 🎩
              </span>
            </Option>
            <Option value="female">
              <span role="img" aria-label="female-hat">
                Female 👒
              </span>
            </Option>
            <Option value="other">
              <span role="img" aria-label="thinking">
                Other 🤔
              </span>
            </Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button loading={updateWorking} type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
