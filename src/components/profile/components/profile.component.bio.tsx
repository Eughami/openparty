import React from "react";
import { RegistrationObject } from "../../interfaces/user.interface";

interface IProfileBioProps {
  user: RegistrationObject;
  style?: React.CSSProperties;
}

export const ProfileBio = (props: IProfileBioProps) => {
  const { user, style } = props;
  return <>{user.bio && <span style={{ ...style }}>{user.bio}</span>}</>;
};
