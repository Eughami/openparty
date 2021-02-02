import React from 'react';
import { Post } from '../../interfaces/user.interface';
import { replaceAtMentionsWithLinks2 } from '../../mentions/mentions.component';
import { PostTime } from './post.component.post-time';

interface IPostCaptionProps {
  post: Post;
}

export const PostCaption = (props: IPostCaptionProps) => {
  const { post } = props;
  return (
    <>
      <strong>{post.user.username}</strong>&nbsp;&nbsp;
      {replaceAtMentionsWithLinks2(post.caption)}
      <br />
      <span className="post__time">
        <PostTime post={post} />
      </span>
    </>
  );
};
