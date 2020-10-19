import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import {emailSignInStart, googleSignInStart} from '../redux/user/user.actions'
import { connect } from 'react-redux';

const Login = ({emailSignInStart, googleSignInStart}:any) => {

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  
  const onFinish = (values:any) => {
    const {username, password} = values
    console.log('Success:', values);
    emailSignInStart(username, password)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={() => googleSignInStart()}>
          Login With Google
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapDispatchToProps = (dispatch: any )=>({
  emailSignInStart: (email:any, password:any) =>dispatch(emailSignInStart({email,password})),
  googleSignInStart: () => dispatch(googleSignInStart())
})

export default connect(null, mapDispatchToProps)(Login)