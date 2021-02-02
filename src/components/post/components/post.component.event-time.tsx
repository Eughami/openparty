import React from 'react';
import { Post } from '../../interfaces/user.interface';
import TimeAgo from 'react-timeago';

interface IPostEventTimeProps {
  post: Post;
}

export const PostEventTime = (props: IPostEventTimeProps) => {
  const { post } = props;
  return (
    <>
      {post.date_of_event && (
        <TimeAgo
          live
          date={`${new Date(post.date_of_event * 1000).toISOString()}`}
        />
      )}
    </>
  );
};
