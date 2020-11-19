import React from 'react'
import { Post } from '../../interfaces/user.interface';

interface IPostCaptionProps {
    post: Post
}

export const PostCaption = (props: IPostCaptionProps) => {
    const { post } = props;
    return (
        <>
            <strong>{post.user.username}</strong> {post.caption}
        </>
    );
}
