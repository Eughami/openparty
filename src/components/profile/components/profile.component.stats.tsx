import { Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { RegistrationObject } from '../../interfaces/user.interface';

interface IProfileStatsProps {
  user: RegistrationObject;
  postsCount: number;
  username: string;
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
        <Link
          style={{
            marginRight: 20,
            color: 'inherit',
          }}
          to={`/${props.username}/followers`}
        >
          <span>
            {user.followers_count} {'  '}Followers
          </span>
        </Link>
        <Link
          style={{
            marginRight: 20,
            color: 'inherit',
          }}
          to={`/${props.username}/followings`}
        >
          <span>
            {user.following_count} {'  '} Following
          </span>
        </Link>
      </Row>
    </>
  );
};
