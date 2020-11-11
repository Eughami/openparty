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
import { RegistrationObject } from './interfaces/user.interface';
import { signUpStart } from '../redux/user/user.actions'
import { connect } from 'react-redux';

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
  signUpStart?: (signUpObj: RegistrationObject) => Promise<any>,
  currentUser?: firebase.User,
  userInfo?: RegistrationObject
}

const RegistrationForm = (props: IRegisterProps) => {
  const [form] = Form.useForm();
  const [registerWorking, setRegisterWorking] = useState<boolean>(false);

  const { signUpStart } = props;

  console.log("REGISTRATION FORM PROPS: ", props);

  // useEffect(() => {
  //   const unsub = firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       props.history.replace("/");
  //     }
  //   })

  //   return unsub;
  // }, [])

  const onFinish = (object: RegistrationObject) => {
    setRegisterWorking(true);
    signUpStart!(object).then(() => {
      setRegisterWorking(false);
    }).catch((error) => {
      console.log("@REGISTER.TSX.", error);
      alert(JSON.stringify(error))
      setRegisterWorking(false);
    })

    console.log('Received values of form: ', object);
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
    <Col span="12" style={{ marginLeft: "20%", marginRight: "20%" }}>
      {/* <Alert
        message="Error"
        description="This is an error message about copywriting."
        type="error"
        showIcon
      /> */}
      <h1 style={{ textAlign: "center" }}>Register</h1>
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

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    signUpStart: (signUpObj: RegistrationObject) => dispatch(signUpStart(signUpObj)),
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);