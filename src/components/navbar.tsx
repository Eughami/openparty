import React from 'react';
import {Col, Row} from 'antd'

const Navbar = () => {
  return (
    <Row>
      <Col className='top__navbar__elements' offset={4} span={4}>HomePageLogo</Col>
      <Col className='top__navbar__elements' offset={1} span={5}>SearchBar</Col>
      <Col className='top__navbar__elements' offset={1} span={6}>UserElements</Col>
    </Row>
  );
};

export default Navbar;