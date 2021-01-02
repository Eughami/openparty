import { Row, Col } from 'antd';
import React from 'react';
import { Post } from './interfaces/user.interface';
import { PostOverlay } from './postOverlay';

interface IExploreLayoutProps {
  arrayOfPosts: Post[]; //should be 9 elements
}

const smallDivider = () => (
  <Col md={24} sm={0} xs={0} style={{ height: 30 }}></Col>
);

const ExploreLayout = (props: IExploreLayoutProps) => {
  const { arrayOfPosts } = props;
  console.log('@EXPLORE:', arrayOfPosts);
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
      {/* TODO. handle when like/comments are undefined */}
      <Row>
        <Col md={7} sm={8} xs={8}>
          <Row>
            <Col span={24} className="smallPostDouble dynamicHeight">
              <PostOverlay
                // likes={Object.keys(props.arrayOfPosts[0].likes).length}
                // comments={Object.keys(props.arrayOfPosts[0].comments!).length}
                imgUrl={arrayOfPosts[0].image_url![0]}
                url={arrayOfPosts[0].id}
              />
            </Col>
            {smallDivider()}
            <Col span={24} className="smallPostDouble dynamicHeight">
              <PostOverlay
                // likes={Object.keys(props.arrayOfPosts[1].likes).length}
                // comments={Object.keys(props.arrayOfPosts[1].comments!).length}
                imgUrl={arrayOfPosts[1].image_url![0]}
                url={arrayOfPosts[1].id}
              />
            </Col>
          </Row>
        </Col>
        <Col
          md={{ span: 15, offset: 1 }}
          sm={{ span: 16, offset: 0 }}
          xs={{ span: 16, offset: 0 }}
          className="bigPost dynamicHeight"
        >
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[2].likes).length}
            // comments={Object.keys(props.arrayOfPosts[2].comments!).length}
            url={arrayOfPosts[2].id}
            imgUrl={arrayOfPosts[2].image_url![0]}
          />
        </Col>
      </Row>
      {smallDivider()}
      <Row>
        <Col md={7} sm={8} xs={8} className="smallPost dynamicHeight">
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[3].likes).length}
            // comments={Object.keys(props.arrayOfPosts[3].comments!).length}
            url={arrayOfPosts[3].id}
            imgUrl={arrayOfPosts[3].image_url![0]}
          />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[4].likes).length}
            // comments={Object.keys(props.arrayOfPosts[4].comments!).length}
            imgUrl={arrayOfPosts[4].image_url![0]}
            url={arrayOfPosts[4].id}
          />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[5].likes).length}
            // comments={Object.keys(props.arrayOfPosts[5].comments!).length}
            url={arrayOfPosts[5].id}
            imgUrl={arrayOfPosts[5].image_url![0]}
          />
        </Col>
      </Row>
      {smallDivider()}
      <Row>
        <Col md={7} sm={8} xs={8} className="smallPost dynamicHeight">
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[6].likes).length}
            // comments={Object.keys(props.arrayOfPosts[6].comments!).length}
            imgUrl={arrayOfPosts[6].image_url![0]}
            url={arrayOfPosts[6].id}
          />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[7].likes).length}
            // comments={Object.keys(props.arrayOfPosts[7].comments!).length}
            imgUrl={arrayOfPosts[7].image_url![0]}
            url={arrayOfPosts[7].id}
          />
        </Col>
        <Col
          md={{ span: 7, offset: 1 }}
          sm={{ span: 8, offset: 0 }}
          xs={{ span: 8, offset: 0 }}
          className="smallPost dynamicHeight"
        >
          <PostOverlay
            // likes={Object.keys(props.arrayOfPosts[8].likes).length}
            // comments={Object.keys(props.arrayOfPosts[8].comments!).length}
            imgUrl={arrayOfPosts[8].image_url![0]}
            url={arrayOfPosts[8].id}
          />
        </Col>
      </Row>
      {smallDivider()}
    </>
  );
};

export default ExploreLayout;
