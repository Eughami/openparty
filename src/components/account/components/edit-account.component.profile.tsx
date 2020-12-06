import React from 'react';
import { Form, Input, Button, Row, Select } from 'antd';
import { ProfileAvatar } from '../../profile/components/profile.component.pfp';
import { RegistrationObject } from '../../interfaces/user.interface';
import { ProfileUsername } from '../../profile/components/profile.component.username';
import { Link } from 'react-router-dom';
import { prefixSelector } from '../../register';
import _ from 'lodash';

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

  const onFinish = (values: any) => {
    console.log(values, _.isEqual({}, {}));
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
        name: user.name,
        phone: user.phone,
        prefix: user.prefix,
      }}
    >
      <Form.Item>
        <Row justify="center" align="top">
          <span style={{ cursor: 'pointer' }} onClick={() => {}}>
            <ProfileAvatar imageSize={40} user={user} />
          </span>
          <div style={{ marginLeft: 20 }}>
            <ProfileUsername user={user} />

            <Link to={{}}>
              <p>Change profile photo</p>
            </Link>
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
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};
