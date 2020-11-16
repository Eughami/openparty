import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Select,
  Col,
  Checkbox,
  Button,
  message,
  // Alert
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import firebase from 'firebase';
import { RegistrationRequest } from './interfaces/interface';
import { emailSignInStart, signUpStart } from '../redux/user/user.actions';
import { connect } from 'react-redux';
import { API_BASE_URL, REGISTRATION_ENDPOINT } from '../service/api';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RegistrationObject } from './interfaces/user.interface';
import { Link } from 'react-router-dom';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
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

const RegistrationForm = ({ emailSignInStart, signUpStart, history }: any) => {
  const [form] = Form.useForm();
  const [registerWorking, setRegisterWorking] = useState<boolean>(false);

  // console.log('REGISTRATION FORM PROPS: ', props);

  // useEffect(() => {
  //   const unsub = firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       props.history.replace("/");
  //     }
  //   })

  //   return unsub;
  // }, [])

  const onFinish = async (object: RegistrationObject) => {
    setRegisterWorking(true);
    const key = 'registerKey';
    message.loading({ content: 'SignU in progress...', key });
    try {
      const registerResponse = await signUpStart(object, history);
      console.log(registerResponse);
      message.loading({ content: 'SignUp succes, Auto Login...', key });
      emailSignInStart(object.email, object.password, history);
      setRegisterWorking(false);
    } catch (error) {
      console.log('REGISTRATION FAILED', error);
      message.error({ content: error, key });
      setRegisterWorking(false);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="357">+357</Option>
        <Option value="90">+90</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Col
      span="12"
      style={{ marginLeft: '20%', marginRight: '20%', marginTop: '5%' }}
    >
      {/* <Alert
        message="Error"
        description="This is an error message about copywriting."
        type="error"
        showIcon
      /> */}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          email: 'imamosi50@gmail.com',
          password: '123456',
          confirm: '123456',
          username: 'eughami',
          phone: '5423269865',
          prefix: '90',
        }}
        style={{ marginTop: 30 }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
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
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
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

        <Form.Item
          name="username"
          label={
            <span>
              Username&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: 'Please input your username!',
              whitespace: true,
            },
          ]}
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
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject('Should accept agreement'),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="https://google.com">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <span>
            Already have an account ?<Link to="/login">Login</Link>
          </span>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button loading={registerWorking} type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
};

const mapsDispatchToProps = (dispatch: any) => ({
  emailSignInStart: (email: string, password: string, history: any) =>
    dispatch(emailSignInStart({ email, password }, history)),
  signUpStart: (regObj: any, history: any) =>
    dispatch(signUpStart(regObj, history)),
});

export default connect(null, mapsDispatchToProps)(RegistrationForm);
