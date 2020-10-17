import React from 'react';
import {Col, Row} from 'antd'

import OpenpartyLogo from './images/openpaarty.logo.png'

const Navbar = () => {
  return (
    <div className='sticky__navbar'>
      <Row>
        <Col className='top__navbar__elements top__logo' xs={{span: 11, offset: 1}} sm={{span: 8, offset: 1}} md={{span: 6, offset: 2}} lg={{span: 4, offset: 2}} xxl={{span: 3, offset:4}}>
          <img alt='' src={OpenpartyLogo} />
        </Col>
        <Col className='top__navbar__elements' xs={{span: 0}} lg={{span: 6, offset: 2}} xxl={{span: 5, offset:1}}>SearchBar</Col>
        <Col className='top__navbar__elements' xs={{span: 11, offset: 1}}  md={{span: 10, offset: 2}} lg={{span: 8, offset: 2}} xxl={{span: 6, offset:1}} >UserElements</Col>
      </Row>
    </div>
  );
};

export default Navbar;