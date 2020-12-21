import { Row, Col } from 'antd';
import React from 'react';
import { CommentOutlined, HeartFilled } from '@ant-design/icons';

const PostOverlay = ({ imgUrl }: any) => (
  <div className="container">
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
{
  /* </div>
  <div className="post__overlay">
   
  </div> */
}
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
              <PostOverlay imgUrl={arrayOfPosts[0]} />
            </Col>
            <Col span={24} className="smallPost">
              <PostOverlay imgUrl={arrayOfPosts[1]} />
            </Col>
          </Row>
        </Col>
        <Col span={15} offset={1} className="bigPost">
          <PostOverlay imgUrl={arrayOfPosts[2]} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col span={7} className="smallPost">
          <PostOverlay imgUrl={arrayOfPosts[3]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <PostOverlay imgUrl={arrayOfPosts[4]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <PostOverlay imgUrl={arrayOfPosts[5]} />
        </Col>
      </Row>
      <Row gutter={[0, 24]}>
        <Col span={7} className="smallPost">
          <PostOverlay imgUrl={arrayOfPosts[6]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <PostOverlay imgUrl={arrayOfPosts[7]} />
        </Col>
        <Col span={7} offset={1} className="smallPost">
          <PostOverlay imgUrl={arrayOfPosts[8]} />
        </Col>
      </Row>
    </>
  );
};

export default ExploreLayout;
