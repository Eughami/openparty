import React from 'react';
import { Form, Input, Button, Col, } from 'antd';
import firebase from "firebase";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

interface LoginObject {
    email: string,
    password: string,
}

const Login = () => {
  const onFinish = async (values: LoginObject) => {
    console.log('Success:', values);

    try {
        await firebase.auth().signInWithEmailAndPassword(values.email, values.password);
    } catch (error) {
        console.log(error);
        
        alert(`Something went wrong while signing into your account...\n${error.message}`);
        return;
        // throw new Error(error.message)
    }
    
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Col span="12" style={{marginLeft: "20%", marginRight: "20%", marginTop: "5%"}}>
        <h1 style={{textAlign: "center"}}>Login to the site</h1>
        <Form 
            {...layout}
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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
                label="Password"
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </Form.Item>
        </Form>
      </Col>
    );
};
 
export default Login;