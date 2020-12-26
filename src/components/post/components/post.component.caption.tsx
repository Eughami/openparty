import React from 'react';
import { Post } from '../../interfaces/user.interface';
import { replaceAtMentionsWithLinks2 } from '../../mentions/mentions.component';

interface IPostCaptionProps {
  post: Post;
}

export const PostCaption = (props: IPostCaptionProps) => {
  const { post } = props;
  return (
    <>
      <strong>{post.user.username}</strong>{' '}
      {replaceAtMentionsWithLinks2(post.caption)}
    </>
  );
};
