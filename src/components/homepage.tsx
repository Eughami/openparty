import { Col, Row } from 'antd';
import React from 'react';
import Cards from './cards';
import Navbar from '../components/navbar';


const Homepage = () => {
  return (
    <>
      <Navbar />
      <Row className='body__container'>
        <Col xs={{span: 0}} xl={{span: 4, offset: 0}}   span={6}>
          {/* <div style={{border: 'black solid', height: '300px',width: '100%'}}></div> */}
        </Col>
        <Col xs={{span: 22, offset: 1}} lg={{span: 16, offset: 2}} xl={{span: 10, offset: 4}} span={12}>
          <Cards />
        </Col>
        <Col xs={{span: 0}} lg={{span: 5, offset: 1}} xl={{span: 6, offset: 0}} >
          {/* <div style={{border: 'black solid', height: '300px',width: '100%'}}></div> */}
        </Col>
      </Row>
  </>
  );
};

export default Homepage;