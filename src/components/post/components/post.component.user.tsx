import React from 'react'
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Post } from '../../interfaces/user.interface';
import { LockTwoTone } from '@ant-design/icons';
import { PostTime } from './post.component.post-time'

interface IPostUserProps {
    post: Post,
}

export const PostUser = (props: IPostUserProps) => {
    const { post } = props;

    return (
        <header>
            <div className="Post-user">
                <div className="Post-user-avatar">
                    <img src={post.user.image_url} alt={post.user.username} />
                </div>
                <div className="Post-user-nickname">
                    <Link
                        to={{
                            pathname: `/${post.user.username}`,
                        }}
                    >
                        <span> {post.user.username} </span>
                    </Link>
                </div>
                <span style={{ marginLeft: '22%', fontWeight: 'bold' }}>
                    <PostTime post={post} />
                </span>
                {(post.privacy as any) === 'hard-closed' && (
                    <Tooltip title="Only you can see this post 🙈 ">
                        <span
                            style={{
                                fontSize: '25px',
                                marginLeft: '35%',
                                display: 'flex',
                                justifyContent: 'right',
                            }}
                        >
                            <LockTwoTone twoToneColor="#eb2f96" />
                        </span>
                    </Tooltip>
                )}
            </div>
        </header>
    );
}
