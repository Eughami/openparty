import { Row } from 'antd';
import React from 'react';
import { RegistrationObject } from '../../interfaces/user.interface';

interface IProfileStatsProps {
  user: RegistrationObject;
  postsCount: number;
  style?: React.CSSProperties;
}

export const ProfileStats = (props: IProfileStatsProps) => {
  const { user, postsCount, style } = props;
  return (
    <>
      <Row justify="space-between" align="middle" style={{ ...style }}>
        <span style={{ marginRight: 20 }}>
          {postsCount} {'  '} Posts
        </span>
        <span style={{ marginRight: 20 }}>
          {user.followers_count} {'  '}Followers
        </span>
        <span>
          {user.following_count} {'  '} Following
        </span>
      </Row>
    </>
  );
};
