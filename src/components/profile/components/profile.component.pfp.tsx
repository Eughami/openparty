import { Avatar } from 'antd';
import React from 'react';
import { RegistrationObject } from '../../interfaces/user.interface';

interface IProfileAvatarProps {
  user: RegistrationObject;
  imageSize?: number;
  style?: React.CSSProperties;
  dirSrc?: any;
}

export const ProfileAvatar = (props: IProfileAvatarProps) => {
  const { user, imageSize, style, dirSrc } = props;
  return (
    <>
      <Avatar
        style={{ ...style }}
        src={dirSrc ? dirSrc : user!.image_url}
        size={imageSize || 100}
      />
    </>
  );
};
