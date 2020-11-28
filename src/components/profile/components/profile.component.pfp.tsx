import { Avatar } from "antd";
import React from "react";
import { RegistrationObject } from "../../interfaces/user.interface";

interface IProfileAvatarProps {
  user: RegistrationObject;
  imageSize?: number;
}

export const ProfileAvatar = (props: IProfileAvatarProps) => {
  const { user, imageSize } = props;
  return (
    <>
      <Avatar src={user!.image_url} size={imageSize || 100} />
    </>
  );
};
