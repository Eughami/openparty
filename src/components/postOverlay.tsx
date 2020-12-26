import React from 'react';
import { Row, Col } from 'antd';

import { CommentOutlined, HeartFilled } from '@ant-design/icons';

export const PostOverlay = ({ imgUrl }: any) => (
  <div className="container hover">
    <img src={imgUrl} alt="Avatar" className="image" />
    <div className="middle">
      <div className="text">
        <Row justify="center" align="middle">
          <Col>
            <HeartFilled />
            <span style={{ marginLeft: 5 }}>4.1k</span>
          </Col>
          <Col style={{ marginLeft: 20 }}>
            <CommentOutlined />
            <span style={{ marginLeft: 5 }}>123</span>
          </Col>
        </Row>
      </div>
    </div>
  </div>
);
