import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Select,
  Col,
  Checkbox,
  Button,
  // Alert
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import firebase from "firebase";
import { RegistrationObject } from '../constants/interfaces';

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

interface IRegisterProps {
  history: any
}

const RegistrationForm = (props: IRegisterProps) => {
  const [form] = Form.useForm();
  const [registerWorking, setRegisterWorking] = useState(false);

  console.log("REGISTRATION FORM PROPS: ", props);


  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        props.history.replace("/");
      }
    })

    return unsub;
  }, [])


  const onFinish = async (object: RegistrationObject) => {
    setRegisterWorking(true);

    console.log('Received values of form: ', object);

    let response: firebase.auth.UserCredential = { credential: null, user: null, additionalUserInfo: null, operationType: null };

    try {
      response = await firebase.auth().createUserWithEmailAndPassword(object.email, object.password!);
    } catch (error) {
      console.log(error);

      alert(`Something went wrong while creating your account...\n${error.message}`);
      setRegisterWorking(true);
      return;
      // throw new Error(error.message)
    }

    console.log("RESPONSE: ", response);

    delete object.confirm;
    delete object.agreement;
    delete object.password;

    object.followers_count = 0;
    object.following_count = 0;
    object.posts_count = 0;
    object.image_url = "";

    if (response.user) {
      object.uid = response.user.uid;
      await firebase.database().ref("Users").child(response.user.uid).set({ ...object, });
    }
    else {
      alert("Something went wrong while creating your account...");
    }
    setRegisterWorking(false);
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
    <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>
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
          // residence: ['zhejiang', 'hangzhou', 'xihu'],
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

                return Promise.reject('The two passwords that you entered do not match!');
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
                value ? Promise.resolve() : Promise.reject('Should accept agreement'),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="https://google.com">agreement</a>
          </Checkbox>
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

export default RegistrationForm;