import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import _ from 'lodash';
import firebase from 'firebase';
import { FirebaseAuthErrorCodes } from '../../interfaces/error.interface';

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
  const [updateWorking, setUpdateWorking] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setUpdateWorking(true);
    // console.log(values, _.isEqual({}, {}));

    let credential = firebase.auth.EmailAuthProvider.credential(
      user.email!,
      values['current-password']
    );
    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        setUpdateWorking(false);
        user
          .updatePassword(values['password'])
          .then(() => {
            message.success('Password updated successfully 🥂', 3);
            form.resetFields();
          })
          .catch((error) => {
            // An error happened.
            setUpdateWorking(false);
            message.error('There was a problem updating your password');
            console.log('@RE-AUTH UPDATE PASSWORD ERROR: ', error);
          });
      })
      .catch((e) => {
        console.log('@RE-AUTH CRED ERROR: ', e);
        setUpdateWorking(false);
        if (e.code === FirebaseAuthErrorCodes.WRONG_PASSWORD) {
          message.error(
            'There was a problem verifying your credentials. The provided password is correct',
            3
          );
        } else if (e.code === FirebaseAuthErrorCodes.TOO_MANY_REQUESTS) {
          message.error(
            'Too many failed attempts to validate your. Please try again later.',
            3
          );
        } else {
          message.error(
            'There was a problem verifying your credentials. Please make sure you got everything correct',
            3
          );
        }
      });
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
        <Button loading={updateWorking} type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <span
          style={{
            pointerEvents: updateWorking ? 'none' : 'auto',
            opacity: updateWorking ? 0.5 : 1,
          }}
        >
          Forgot password?
        </span>
      </Form.Item>
    </Form>
  );
};
