import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import { emailSignInStart, googleSignInStart } from '../redux/user/user.actions'
import { connect } from 'react-redux';

interface IAppProps {
  emailSignInStart?: (email: string, password: string, history: any) => Promise<any>,
  googleSignInStart?: () => Promise<any>,
  history?: any,
  currentUser?: firebase.User,
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login = (props: IAppProps) => {

  const { currentUser } = props;

  console.log("LOGIN PROPS: ", props.history);

  useEffect(() => {
    if (currentUser) {
      console.log("REDIRECTING TO... HOME!");

      props.history.replace("/");
    }
  }, [currentUser, props.history]);


  const onFinish = (values: any) => {
    const { username, password } = values
    console.log('Success:', values);
    props.emailSignInStart!(username, password, props!.history);
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
        <Button type="primary" onClick={() => props.googleSignInStart!()}>
          Login With Google
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  emailSignInStart: (email: string, password: string, history: any) => dispatch(emailSignInStart({ email, password }, history)),
  googleSignInStart: () => dispatch(googleSignInStart())
})

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login)