import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { LOADER_OBJECTS } from './images';

const Explore = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);
  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Spin size="small" />
        <p>Loading your stuff...</p> */}
        <img
          height="200"
          width="100"
          src={LOADER_OBJECTS.LOADING_GEARS_01}
          alt="LOADING"
        />
      </div>
    );
  }
  return (
    <Row justify="center" className="explore__container">
      <Col span={18}>
        <Row className="yBorder">
          <Col span={8} className="bBorder"></Col>
          <Col span={8} className="bBorder"></Col>
          <Col span={8} className="bBorder"></Col>
        </Row>
        <Row className="rBorder">
          <Col span={8} className="bBorder">
            <Row>
              <Col span={24} className="bBorder"></Col>
              <Col span={24} className="bBorder"></Col>
            </Row>
          </Col>
          <Col span={16} className="gBorder"></Col>
        </Row>
        {/* <Row className="rBorder">
          <Col span={8} className="bBorder">
            <Row>
              <Col span={24} className="bBorder"></Col>
              <Col span={24} className="bBorder"></Col>
            </Row>
          </Col>
          <Col span={16} className="bBorder"></Col>
        </Row> */}
      </Col>
    </Row>
  );
};

export default Explore;
