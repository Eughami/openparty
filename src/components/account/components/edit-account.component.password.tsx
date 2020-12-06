import React from 'react';
import { Form, Input, Button } from 'antd';
import _ from 'lodash';

interface IChangePasswordInterface {
  user: firebase.User;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export const ChangePassword = (props: IChangePasswordInterface) => {
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
      name="password-change"
      onFinish={onFinish}
    >
      <Form.Item
        name="current-password"
        label="Current Password"
        rules={[
          {
            required: true,
            message: 'Password too short',
            min: 7,
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="password"
        label="New Password"
        rules={[
          {
            required: true,
            message: 'Password too short',
            min: 7,
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(__rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                'The two passwords that you entered do not match!'
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <span>Forgot password?</span>
      </Form.Item>
    </Form>
  );
};
