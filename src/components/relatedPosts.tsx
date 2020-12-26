import { Row, Col } from 'antd';
import React from 'react';
import { Post } from './interfaces/user.interface';
import { PostOverlay } from './postOverlay';
import { Link } from 'react-router-dom';

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts = (props: RelatedPostsProps) => {
  const { posts } = props;
  return (
    <Row>
      {posts.map((post) => (
        <Col
          key={post.id}
          span={7}
          offset={1}
          lg={{ span: 7, offset: 1 }}
          md={10}
          className="related__posts__container"
        >
          <Link to={`/post/${post.id}`}>
            <PostOverlay
              likes={post.likes ? Object.values(post.likes).length : 0}
              comments={post.comments ? Object.values(post.comments).length : 0}
              imgUrl={post.image_url![0]}
            />
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default RelatedPosts;
