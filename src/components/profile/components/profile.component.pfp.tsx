import { Avatar } from 'antd';
import React from 'react';
import { RegistrationObject } from '../../interfaces/user.interface';

interface IProfileAvatarProps {
  user: RegistrationObject;
  imageSize?: number;
  style?: React.CSSProperties;
}

export const ProfileAvatar = (props: IProfileAvatarProps) => {
  const { user, imageSize, style } = props;
  return (
    <>
      <Avatar
        style={{ ...style }}
        src={user!.image_url}
        size={imageSize || 100}
      />
    </>
  );
};
