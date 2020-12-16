import { Row } from "antd";
import React from "react";
import { RegistrationObject } from "../../interfaces/user.interface";

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
        <p style={{ marginRight: 20 }}>
          {postsCount} {"  "} Posts
        </p>
        <p style={{ marginRight: 20 }}>
          {user.followers_count} {"  "}Followers
        </p>
        <p>
          {user.following_count} {"  "} Following
        </p>
      </Row>
    </>
  );
};
