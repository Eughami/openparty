import React from 'react'
import { Post } from '../../interfaces/user.interface';
import { Row } from 'antd';

interface IPostLikesProps {
    post: Post
}

export const PostLikes = (props: IPostLikesProps) => {
    const { post } = props;
    return (
        <Row align="middle">
            <p style={{ textAlign: 'left', fontWeight: 'bold' }}>
                {' '}
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
            </p>
        </Row>
    );
}
