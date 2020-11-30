import { Row, Col } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';

const TempHeaderNotification = () => {
  return (
    <Row justify="start" align="middle" gutter={[0, 12]}>
      <Col span={2}>
        <Avatar
          alt="user avatar"
          src="https://store.playstation.com/store/api/chihiro/00_09_000/container/IN/en/999/EP2402-CUSA05624_00-AV00000000000240/1601168983000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000"
          size={36}
        />
      </Col>
      <Col
        span={20}
        offset={2}
        // to hide very long weird and probably non-existent one word
        style={{ overflowX: 'hidden' }}
      >
        <span>Some Random Bulsshit fuck off</span>
      </Col>
    </Row>
  );
};

export default TempHeaderNotification;
