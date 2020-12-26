import { Avatar, Col, Row } from 'antd';
import React from 'react';
import {
  HomeOutlined,
  SearchOutlined,
  PlusSquareOutlined,
  HeartOutlined,
} from '@ant-design/icons';
const MobileNarbar = () => {
  // dummy image
  const imgUrl =
    'https://cdna.artstation.com/p/assets/images/images/019/293/032/large/kiki-andriansyah-hex-y.jpg?1562838735';

  return (
    <Col xs={24} md={0}>
      <Row align="middle" justify="space-around" className="mobile__navbar">
        <HomeOutlined style={{ fontSize: 28 }} />
        <SearchOutlined style={{ fontSize: 28 }} />
        <PlusSquareOutlined style={{ fontSize: 28 }} />
        <HeartOutlined style={{ fontSize: 28 }} />
        <Avatar src={imgUrl} alt="user avatar" size={32} />
      </Row>
    </Col>
  );
};

export default MobileNarbar;
