import { Row, Col } from 'antd';
import React from 'react';
import { PostOverlay } from './postOverlay';

interface IExploreLayoutProps {
  arrayOfPosts: any[]; //should be 9 elements
}

const smallDivider = () => (
  <Col md={24} sm={0} xs={0} style={{ height: 30 }}></Col>
);

const ExploreLayout = (props: IExploreLayoutProps) => {
  const { arrayOfPosts } = props;
  /**
   * Gotta get post in set of 9
   * i.e First 9 post
   */

  // Should probably do some manipulations to make sure we get the post by pack of 9

  /**
   * Setting the weight when the window is rezised
   */

  function setHeight(el: any, val: number) {
    console.log('called with ', el, val);

    var box = document.querySelectorAll(el);
    var i;
    for (i = 0; i < box.length; i++) {
      var width = box[i].offsetWidth;
      var height = width * val;
      /**
       * Should probably find a way to keep the initial height when window is rezised
       */
      const newHeight =
        window.innerWidth < 768
          ? height
          : box[i].className.includes('smallPostDouble')
          ? '285'
          : box[i].className.includes('bigPost')
          ? '600'
          : '300';
      box[i].style.height = newHeight + 'px';
    }
  }
  window.onresize = () => {
    console.log('RESIZED', window.innerWidth);
    // if (window.innerWidth < 768) {
    setHeight('.dynamicHeight', 1);
    // }
  };

  return (
    <>
      <Row>
        <Col md={7} sm={8} xs={8}>
          <Row>
            <Col span={24} className="smallPostDouble dynamicHeight">
              <PostOverlay imgUrl={arrayOfPosts[0]} />
            </Col>
            {smallDivider()}
            <Col span={24} className="smallPostDouble dynamicHeight">
              <PostOverlay imgUrl={arrayOfPosts[1]} />
            </Col>
          </Row>
        </Col>
        <Col
          md={{ span: 15, offset: 1 }}
          sm={{ span: 16, offset: 0 }}
          xs={{ span: 16, offset: 0 }}
          className="bigPost dynamicHeight"
        >
          <PostOverlay imgUrl={arrayOfPosts[2]} />
        </Col>
      </Row>
      {smallDivider()}
      <Row>
        <Col md={7} sm={8} xs={8} className="smallPost dynamicHeight">
          <PostOverlay imgUrl={arrayOfPosts[3]} />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay imgUrl={arrayOfPosts[4]} />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay imgUrl={arrayOfPosts[5]} />
        </Col>
      </Row>
      {smallDivider()}
      <Row>
        <Col md={7} sm={8} xs={8} className="smallPost dynamicHeight">
          <PostOverlay imgUrl={arrayOfPosts[6]} />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay imgUrl={arrayOfPosts[7]} />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay imgUrl={arrayOfPosts[8]} />
        </Col>
      </Row>
      {smallDivider()}
    </>
  );
};

export default ExploreLayout;
