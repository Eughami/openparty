import { Col, Row } from 'antd';
import React from 'react';
import Cards from './cards';

const Homepage = () => {
  return (
    <>
      <Row>
        <Col span={6}>
          {/* <div style={{border: 'black solid', height: '300px',width: '100%'}}></div> */}
        </Col>
        <Col span={12}>
          <Cards />
        </Col>
        <Col span={6}>
          {/* <div style={{border: 'black solid', height: '300px',width: '100%'}}></div> */}
        </Col>
      </Row>
  </>
  );
};

export default Homepage;