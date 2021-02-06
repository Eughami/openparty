import React, { useState } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Select,
  Col,
  Checkbox,
  Button,
  message,
  Row,
  Divider,
  // Alert
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { emailSignInStart, signUpStart } from '../redux/user/user.actions';
import { connect } from 'react-redux';
import { RegistrationObject } from './interfaces/user.interface';
import { Link } from 'react-router-dom';

const { Option } = Select;

export const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select
      style={{
        width: 70,
        borderRadius: '10px !important',
      }}
    >
      <Option value="357">+357</Option>
      <Option value="90">+90</Option>
    </Select>
  </Form.Item>
);

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
    object.phone = '';
    message.loading('Sign up in progress...', 0);
    try {
      const registerResponse = await signUpStart(object);
      console.log(registerResponse);
      message.destroy();
      message.loading('Sign up success, Auto Login...');
      emailSignInStart(object.email, object.password, history);
      setRegisterWorking(false);
    } catch (error) {
      console.log('REGISTRATION FAILED', error);
      message.destroy();
      message.error(error);
      setRegisterWorking(false);
    }
  };

  // TODO: ADD RESPONSIVENESS HERE TOO
  return (
    <div className="login__background">
      <Row
        style={{ minHeight: '100vh', height: '100%', padding: 10 }}
        justify="center"
        align="middle"
      >
        <Col
          className="login__container"
          xxl={{ span: 8, offset: 6 }}
          xl={{ span: 8, offset: 6 }}
          lg={{ span: 10, offset: 4 }}
          md={{ span: 12, offset: 2 }}
          sm={{ span: 14, offset: 2 }}
          xs={{ span: 24, offset: 0 }}
        >
          {/* <Alert
        message="Error"
        description="This is an error message about copywriting."
        type="error"
        showIcon
      /> */}
          <Form
            // layout="vertical"
            form={form}
            name="register"
            onFinish={onFinish}
            // initialValues={{
            //   email: 'imamosi5034@gmail.com',
            //   password: '123456',
            //   confirm: '123456',
            //   username: 'testwe12c',
            //   phone: '5423299865',
            //   prefix: '90',
            // }}
          >
            <h1 className="login__logo">OpenPaarty</h1>
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
              <Input
                onChange={(value) => {
                  const newVal = value.target.value.trim();
                  form.setFieldsValue({
                    email: newVal,
                  });
                }}
                style={{ borderRadius: 10 }}
              />
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
              <Input.Password style={{ borderRadius: 10 }} />
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
              <Input.Password style={{ borderRadius: 10 }} />
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
              <Input
                onChange={(value) => {
                  const newVal = value.target.value.trim();
                  form.setFieldsValue({
                    username: newVal,
                  });
                }}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            {/* TODO. make it optionnal in the future */}
            {/* <Form.Item
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
                  borderRadius: '10px !important',
                }}
              />
            </Form.Item> */}

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
            >
              <Checkbox>
                I have read the <a href="https://google.com">agreement</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                block
                loading={registerWorking}
                type="primary"
                htmlType="submit"
                style={{ borderRadius: 10 }}
              >
                Register
              </Button>
            </Form.Item>

            <Divider orientation="right">
              <span style={{ fontSize: '0.8rem' }}>
                Already have an account ?<Link to="/login"> Login</Link>
              </span>
            </Divider>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

const mapsDispatchToProps = (dispatch: any) => ({
  emailSignInStart: (email: string, password: string, history: any) =>
    dispatch(emailSignInStart({ email, password }, history)),
  signUpStart: (regObj: any) => dispatch(signUpStart(regObj)),
});

export default connect(null, mapsDispatchToProps)(RegistrationForm);
