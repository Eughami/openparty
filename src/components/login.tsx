import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Col, Row, Divider } from 'antd';

import {
  emailSignInStart,
  googleSignInStart,
} from '../redux/user/user.actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

interface IAppProps {
  emailSignInStart?: (
    email: string,
    password: string,
    history: any
  ) => Promise<any>;
  googleSignInStart?: () => Promise<any>;
  history?: any;
  currentUser?: firebase.User;
}

//TODO: ADD SIGN IN WITH USERNAME && PHONE NUMBER
const Login = (props: IAppProps) => {
  const { currentUser } = props;
  const [loading, setLoading] = useState<boolean>(false);

  console.log('LOGIN PROPS: ', props.history);

  // useEffect(() => {
  //   if (currentUser) {
  //     console.log("REDIRECTING TO... HOME!");

  //     props.history.replace("/");
  //   }
  // }, [currentUser, props.history]);

  const onFinish = (values: any) => {
    setLoading(true);
    const key = 'loginKey';
    const { username, password } = values;
    console.log('Success:', values);
    message.loading({ content: 'Login in progres...', key });
    props.emailSignInStart!(username, password, props!.history)
      .then(() => {
        setLoading(false);

        message.success({ content: 'Login successful', key });
      })
      .catch((error) => {
        setLoading(false);

        message.error({ content: 'Invalid email or Password', key });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login__background">
      <Row
        style={{ minHeight: '100vh', padding: 10 }}
        justify="center"
        align="middle"
      >
        <Col
          className="login__container"
          xxl={{ span: 6, offset: 8 }}
          xl={{ span: 6, offset: 8 }}
          lg={{ span: 8, offset: 6 }}
          md={{ span: 10, offset: 4 }}
          sm={{ span: 12, offset: 2 }}
          xs={{ span: 24, offset: 0 }}
        >
          <Form
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <h1 className="login__logo">OpenPaarty</h1>
            <Form.Item
              label="Email"
              name="username"
              rules={[{ required: true, message: 'Please enter your email!' }]}
            >
              <Input style={{ borderRadius: 10 }} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
            >
              <Input.Password style={{ borderRadius: 10 }} />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ borderRadius: 10 }}
                loading={loading}
                block
                type="primary"
                htmlType="submit"
              >
                Log In
              </Button>
            </Form.Item>
            <Divider orientation="center">Or</Divider>
            <Form.Item>
              <Button
                style={{ borderRadius: 10 }}
                block
                type="primary"
                onClick={() => props.googleSignInStart!()}
              >
                Login With Google
              </Button>
            </Form.Item>
            <Divider orientation="right">
              <span style={{ fontSize: '0.8rem' }}>
                Don't have an account yet? <Link to="/register">Register</Link>
              </span>
            </Divider>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  emailSignInStart: (email: string, password: string, history: any) =>
    dispatch(emailSignInStart({ email, password }, history)),
  googleSignInStart: () => dispatch(googleSignInStart()),
});

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
