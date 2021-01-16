import React from 'react';
import { RegistrationObject } from '../../interfaces/user.interface';
import { Popconfirm, Button } from 'antd';
import {
  MessageOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  handleCancelFollowRequest,
  handleFollowRequest,
} from '../profile.actions';
import { Link } from 'react-router-dom';

interface IProfileActionUnfollowProps {
  selfUserInfo?: RegistrationObject;
  otherUserInfo?: RegistrationObject;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  showPopup?: boolean;
  title?: string;
  cancelText?: string;
  okText?: string;
  buttonProps?: any;
  onConfirm: () => void;
}

export const ProfileActionUnfollow = (props: IProfileActionUnfollowProps) => {
  const {
    onConfirm,
    icon,
    okText,
    title,
    cancelText,
    showPopup = true,
    style,
    buttonProps,
  } = props;
  return (
    <>
      {!showPopup ? (
        <Button
          {...buttonProps}
          style={{ ...style }}
          onClick={onConfirm}
          icon={icon || <UserDeleteOutlined />}
        >
          Unfollow
        </Button>
      ) : (
        <Popconfirm
          title={title || 'You will have to send a request to follow again.'}
          onConfirm={onConfirm}
          okText={okText || 'Unfollow'}
          cancelText={cancelText || 'Cancel'}
        >
          <Button
            {...buttonProps}
            style={{ ...style }}
            icon={icon || <UserDeleteOutlined />}
          >
            Unfollow
          </Button>
        </Popconfirm>
      )}
    </>
  );
};

interface IProfileActionFollowProps {
  selfUserInfo: RegistrationObject;
  otherUserInfo: RegistrationObject;
  currentUserToken: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string;
  onConfirm?: () => void;
}

export const ProfileActionFollow = (props: IProfileActionFollowProps) => {
  const {
    icon,
    title,
    otherUserInfo,
    currentUserToken,
    selfUserInfo,
    style,
  } = props;
  return (
    <>
      <Button
        style={{ ...style }}
        onClick={() =>
          handleFollowRequest(otherUserInfo, selfUserInfo, currentUserToken)
        }
        icon={icon || <UserAddOutlined />}
      >
        {title || 'Follow'}
      </Button>
    </>
  );
};

interface IProfileActionCancelFollowRequestProps {
  selfUserInfo?: RegistrationObject;
  otherUserInfo: RegistrationObject;
  currentUserToken: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string;
  onConfirm?: () => void;
}

export const ProfileActionCancelFollowRequest = (
  props: IProfileActionCancelFollowRequestProps
) => {
  const { icon, title, otherUserInfo, currentUserToken, style } = props;
  return (
    <>
      <Button
        style={{ ...style }}
        onClick={() =>
          handleCancelFollowRequest(otherUserInfo, currentUserToken!)
        }
        icon={icon || undefined}
      >
        {title || 'Cancel Request'}
      </Button>
    </>
  );
};

interface IProfileActionMessageProps {
  selfUserInfo: RegistrationObject;
  otherUserInfo: RegistrationObject;
  buttonStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string;
  onConfirm?: () => void;
}

export const ProfileActionMessage = (props: IProfileActionMessageProps) => {
  const { onConfirm, icon, title, buttonStyle } = props;
  return (
    <>
      <Link to="/messages">
        <Button
          style={{ ...buttonStyle }}
          onClick={onConfirm}
          icon={icon || <MessageOutlined />}
        >
          {title || 'D.M 📧'}
        </Button>
      </Link>
    </>
  );
};

interface IProfileActionBlockProps {
  selfUserInfo: RegistrationObject;
  otherUserInfo: RegistrationObject;
  buttonStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string;
  onConfirm: () => void;
}

export const ProfileActionBlock = (props: IProfileActionBlockProps) => {
  const { onConfirm, icon, title, buttonStyle } = props;
  return (
    <>
      <Button
        onClick={onConfirm}
        style={{ ...buttonStyle }}
        color="red"
        icon={icon || <UserAddOutlined />}
      >
        {title || 'Block'}
      </Button>
    </>
  );
};

interface IProfileActionReportProps {
  selfUserInfo: RegistrationObject;
  otherUserInfo: RegistrationObject;
  buttonStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string;
  onConfirm: () => void;
}

export const ProfileActionReport = (props: IProfileActionReportProps) => {
  const { onConfirm, icon, title, buttonStyle } = props;
  return (
    <>
      <Button
        onClick={onConfirm}
        style={{ ...buttonStyle }}
        color="red"
        icon={icon || <UserAddOutlined />}
      >
        {title || 'Report'}
      </Button>
    </>
  );
};

interface IProfileActionEditProps {
  selfUserInfo: RegistrationObject;
  buttonStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string;
  onConfirm?: () => void;
}

export const ProfileActionEdit = (props: IProfileActionEditProps) => {
  const { icon, title, buttonStyle } = props;
  return (
    <Button
      type="link"
      style={{ ...buttonStyle }}
      icon={icon || <EditOutlined />}
    >
      {title || 'Edit'}
    </Button>
  );
};
