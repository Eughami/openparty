import React from 'react';
import { Typography } from 'antd';

import { RegistrationObject } from '../../interfaces/user.interface';

interface IProfileBioProps {
  user: RegistrationObject;
  style?: React.CSSProperties;
}

export const ProfileBio = (props: IProfileBioProps) => {
  const { Paragraph } = Typography;
  const { user, style } = props;
  return (
    <>
      {user.bio && (
        <Paragraph
          style={{
            ...style,
            // width: '150px',
          }}
          ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}
        >
          {user.bio}
        </Paragraph>
      )}
    </>
  );
};
