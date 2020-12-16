import React, { useState } from 'react';
import { Form, Button, Checkbox, message } from 'antd';
import _ from 'lodash';
import { RegistrationObject } from '../../interfaces/user.interface';
import firebase from 'firebase';

interface IEditPrivacyInterface {
  user: RegistrationObject;
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

export const EditPrivacy = (props: IEditPrivacyInterface) => {
  const { user } = props;
  const [form] = Form.useForm();
  const [updateWorking, setUpdateWorking] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setUpdateWorking(true);
    await firebase
      .database()
      .ref('Users')
      .child(user.uid)
      .update({ privacy: values.privacy === true ? 'Private' : 'Public' });
    message.success('Privacy updated 🥂');
    setUpdateWorking(false);
  };

  console.log(user);

  return (
    <Form
      scrollToFirstError
      form={form}
      {...layout}
      name="privacy-change"
      onFinish={onFinish}
      initialValues={{ privacy: user.privacy === 'Private' }}
    >
      <Form.Item
        help="With a private account only your followers can see your posts. All public posts you make will be visible to everyone*"
        name="privacy"
        valuePropName="checked"
        {...tailFormItemLayout}
      >
        <Checkbox>Private Account</Checkbox>
      </Form.Item>
      <Form.Item
        style={{ marginTop: 20 }}
        wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
      >
        <Button loading={updateWorking} type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};
