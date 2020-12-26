import React from 'react';
import { RegistrationObject } from '../../interfaces/user.interface';

interface IProfileUsernameProps {
  user: RegistrationObject;
  style?: React.CSSProperties;
}

export const ProfileUsername = (props: IProfileUsernameProps) => {
  const { user, style } = props;
  return (
    <>
      <h2 style={{ ...style }}>{user.username} </h2>
    </>
  );
};
