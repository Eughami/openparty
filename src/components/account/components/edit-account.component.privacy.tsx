import React, { useState } from 'react';
import { Form, Button, Checkbox, message } from 'antd';
import _ from 'lodash';
import { RegistrationObject } from '../../interfaces/user.interface';
import firebase from 'firebase';
import Axios from 'axios';
import { API_BASE_URL, EDIT_ACCOUNT_INFO_ENDPOINT } from '../../../service/api';

interface IEditPrivacyInterface {
  user: RegistrationObject;
  currentUser: firebase.User;
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
  const { user, currentUser } = props;
  const [form] = Form.useForm();
  const [updateWorking, setUpdateWorking] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setUpdateWorking(true);

    const token = await currentUser.getIdToken(true);

    return Axios.patch(
      `${API_BASE_URL}${EDIT_ACCOUNT_INFO_ENDPOINT}/?type=privacy`,
      {
        privacy: values.privacy === true ? 'Private' : 'Public',
        username: user.username,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.status === 203) {
          message.success('Profile updated 🥂');
          setUpdateWorking(false);
        } else {
          setUpdateWorking(false);
          console.log(
            '@AXIOS EDIT ACCOUNT INFO.PRIVACY UNEXPECTED RES CODE: ',
            res.data,
            res.status
          );
          return message.error(
            'Something went wrong while updating your profile.'
          );
        }
      })
      .catch((error) => {
        console.log('@AXIOS EDIT ACCOUNT.PRIVACY INFO ERROR: ', error);

        setUpdateWorking(false);
        return message.error(
          'Something went wrong while updating your profile.'
        );
      });
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
