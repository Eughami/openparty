import React from 'react'
import { Post, Comment } from '../../interfaces/user.interface';
import { Row } from 'antd';
import { Link } from 'react-router-dom';
import { replaceAtMentionsWithLinks2 } from "../../mentions/mentions.component";

interface IPostCommentsProps {
    post: Post
}

export const PostComments = (props: IPostCommentsProps) => {
    const { post } = props;
    return (
        <>
            {post.comments &&
                Object.values(post.comments).map((comment: Comment, index: number) => (
                    <Row style={{ alignContent: 'center' }} key={index}>
                        <Link
                            to={{
                                pathname: `/${comment.user.username}`,
                            }}
                        >
                            <span style={{ fontWeight: 'bold' }}>
                                {comment.user.username}{' '}
                            </span>
                        </Link>

                        {/* <span style={{ marginLeft: 10 }}>{comment.comment.match(/@\S+/g)?.map(str => `<a href="/${str}" />`)}</span><br /> */}
                        <span style={{ marginLeft: 10 }}>{replaceAtMentionsWithLinks2(comment.comment)}</span>
                        <br />
                        {/* <span style={{ float: "right", fontSize: "small" }}>
                                
                            </span> */}
                        {/* <span style={{ marginLeft: 10, float: "right" }}>{"16 Oct 2020"}</span><br /> */}
                    </Row>
                ))}
        </>
    );
}
