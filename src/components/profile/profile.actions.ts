import axios from 'axios';
import { message } from 'antd';
import { RegistrationObject } from '../interfaces/user.interface';
import {
  API_BASE_URL,
  CANCEL_FOLLOW_REQUEST_ENDPOINT,
  SEND_FOLLOW_REQUEST_ENDPOINT,
  UNFOLOW_REQUEST_ENDPOINT,
} from '../../service/api';

export const confirmUnfollow = async (
  otherUserInfo: RegistrationObject | { uid: string },
  currentUserToken: string
) => {
  const result = await axios.post(
    `${API_BASE_URL}${UNFOLOW_REQUEST_ENDPOINT}`,
    {
      targetUser: otherUserInfo.uid,
    },
    {
      headers: {
        authorization: `Bearer ${currentUserToken}`,
      },
    }
  );

  console.log(result.data);

  message.success('Unfollow successful');
};

export const handleFollowRequest = async (
  otherUserInfo: RegistrationObject,
  currentUserInfo: RegistrationObject,
  currentUserToken: string
) => {
  await axios.post(
    //   'http://localhost:5000/openpaarty/us-central1/api/v1/users/send-follow-request',
    `${API_BASE_URL}${SEND_FOLLOW_REQUEST_ENDPOINT}`,
    {
      targetUsername: otherUserInfo.username,
      username: currentUserInfo?.username,
      image_url: currentUserInfo?.image_url,
    },
    {
      headers: {
        authorization: `Bearer ${currentUserToken}`,
      },
    }
  );

  message.success('Follow request sent');
};

export const handleCancelFollowRequest = async (
  otherUserInfo: RegistrationObject,
  currentUserToken: string
) => {
  await axios.post(
    //   'http://localhost:5000/openpaarty/us-central1/api/v1/users/cancel-follow-request',
    `${API_BASE_URL}${CANCEL_FOLLOW_REQUEST_ENDPOINT}`,
    {
      targetUser: otherUserInfo.uid,
    },
    {
      headers: {
        authorization: `Bearer ${currentUserToken}`,
      },
    }
  );

  message.success('Follow request canceled');
};
