import { Row, Col } from 'antd';
import React from 'react';
import { PostOverlay } from './postOverlay';

interface RelatedPostsProps {
  // posts: string[];
}

const RelatedPosts = (props: RelatedPostsProps) => {
  const arr = [
    'https://i.pinimg.com/originals/0e/45/a8/0e45a874482af5f7d523282e12bf8a75.jpg',
    'https://cdna.artstation.com/p/assets/images/images/019/293/032/large/kiki-andriansyah-hex-y.jpg?1562838735',
    'https://fsa.zobj.net/crop.php?r=0yrakYIE2hyBIa00R2jfegRfTWK7CSjdwulchyOXW1K5H1mDEE2iGE8tdw85BM1gawqnYHRCEs_c76f3rTnoCaYJIMQlFUbwi03kMNOepCKc5wkyVVP28qfLh4g3XmM_W2WSEfDJ1LB9R2xn',
  ];
  return (
    <Row>
      <Col
        span={7}
        offset={1}
        lg={{ span: 7, offset: 1 }}
        md={10}
        className=" related__posts__container"
      >
        <PostOverlay imgUrl={arr[0]} />
      </Col>
      <Col
        span={7}
        offset={1}
        lg={{ span: 7, offset: 1 }}
        md={10}
        className=" related__posts__container"
      >
        <PostOverlay imgUrl={arr[1]} />
      </Col>
      <Col
        span={7}
        offset={1}
        lg={{ span: 7, offset: 1 }}
        md={0}
        className=" related__posts__container"
      >
        <PostOverlay imgUrl={arr[2]} />
      </Col>
    </Row>
  );
};

export default RelatedPosts;
