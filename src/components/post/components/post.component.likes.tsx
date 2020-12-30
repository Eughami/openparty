import React from 'react';
import { Post } from '../../interfaces/user.interface';
import { Row } from 'antd';

interface IPostLikesProps {
  post: Post;
}

export const PostLikes = (props: IPostLikesProps) => {
  const { post } = props;
  return (
    <Row align="middle">
      {Array.isArray(post.likes) ? (
        <p style={{ textAlign: 'left', fontWeight: 'bold' }}>
          {post.likes.length === 0 || post.likes.length > 1
            ? post.likes.length + ' interests'
            : post.likes.length + ' interest'}
        </p>
      ) : (
        <p style={{ textAlign: 'left', fontWeight: 'bold' }}>
          {Object.values(post.likes).length === 0 ||
          Object.values(post.likes).length > 1
            ? Object.values(post.likes).length + ' interests'
            : Object.values(post.likes).length + ' interest'}
        </p>
      )}
    </Row>
  );
};

export const PostLikesNumber = (props: IPostLikesProps) => {
  const { post } = props;
  return (
    <>
      {Array.isArray(post.likes)
        ? post.likes.length
        : Object.values(post.likes ? post.likes : {}).length}
    </>
  );
};
