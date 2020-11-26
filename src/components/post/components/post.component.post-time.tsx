import React from 'react'
import { Post } from '../../interfaces/user.interface';
import TimeAgo from 'react-timeago';

interface IPostTimeProps {
    post: Post
}

export const PostTime = (props: IPostTimeProps) => {
    const { post } = props;
    return (
        <TimeAgo
            live
            date={`${post.date_of_post ? new Date(post.date_of_post).toISOString() : ''
                }`}
        />
    );
}
