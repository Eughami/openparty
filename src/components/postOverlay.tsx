import React from 'react';
import { Row, Col } from 'antd';

import { CommentOutlined, HeartFilled } from '@ant-design/icons';

interface IPostOverlay {
  likes?: number;
  comments?: number;
  imgUrl: string;
}

export const PostOverlay = ({ comments, likes, imgUrl }: IPostOverlay) => (
  <div className="container hover">
    <img src={imgUrl} alt="Avatar" className="image" />
    <div className="middle">
      <div className="text">
        <Row justify="center" align="middle">
          <Col>
            <HeartFilled />
            <span style={{ marginLeft: 5 }}> {likes ? likes : '0'} </span>
          </Col>
          <Col style={{ marginLeft: 20 }}>
            <CommentOutlined />
            <span style={{ marginLeft: 5 }}>{comments ? comments : '0'}</span>
          </Col>
        </Row>
      </div>
    </div>
  </div>
);
