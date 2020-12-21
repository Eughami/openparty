import { Row, Col } from 'antd';
import React from 'react';

interface IExploreLayoutProps {
  arrayOfPosts: any[]; //should be 9 elements
}

const ExploreLayout = (props: IExploreLayoutProps) => {
  const { arrayOfPosts } = props;
  /**
   * Gotta get post in set of 9
   * i.e First 9 post
   */
  return (
    <>
      <Row className="twoSmall__oneBig__container" gutter={[0, 24]}>
        <Col span={7}>
          <Row gutter={[0, 24]}>
            <Col span={24} className="smallPost">
              <img src={arrayOfPosts[0]} />
            </Col>
            <Col span={24} className="smallPost">
              <img src={arrayOfPosts[1]} />
            </Col>
          </Row>
        </Col>
        <Col span={15} offset={1} className="bigPost">
          <img src={arrayOfPosts[2]} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col span={7} className="smallPost">
          <img src={arrayOfPosts[3]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <img src={arrayOfPosts[4]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <img src={arrayOfPosts[5]} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col span={7} className="smallPost">
          <img src={arrayOfPosts[6]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <img src={arrayOfPosts[7]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <img src={arrayOfPosts[8]} />
        </Col>
      </Row>
    </>
  );
};

export default ExploreLayout;
