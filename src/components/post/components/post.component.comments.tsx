import React from 'react';
import { Post, Comment } from '../../interfaces/user.interface';
import { Avatar, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { replaceAtMentionsWithLinks2 } from '../../mentions/mentions.component';

interface IPostCommentsProps {
  post: Post;
}

export const PostComments = (props: IPostCommentsProps) => {
  const { post } = props;
  // const { image_url, username } = post.user;
  return (
    <>
      {post.comments &&
        Object.values(post.comments).map((comment: Comment, index: number) => (
          <div
            style={{
              padding: '10px',
            }}
          >
            <Row justify="start" align="top">
              <Col span={2}>
                <Avatar
                  alt="user avatar"
                  src={comment.user.image_url}
                  size={36}
                />
              </Col>
              <Col span={21} offset={1}>
                <span>
                  <Link
                    to={{
                      pathname: `/${comment.user.username}`,
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      {comment.user.username}{' '}
                    </span>
                  </Link>
                </span>
                <span style={{ marginLeft: '10px' }}>
                  {replaceAtMentionsWithLinks2(comment.comment)}
                </span>
              </Col>
            </Row>
          </div>
          //   <Row style={{ alignContent: 'center' }} key={index}>
          //     <Link
          //       to={{
          //         pathname: `/${comment.user.username}`,
          //       }}
          //     >
          //       <span style={{ fontWeight: 'bold' }}>
          //         {comment.user.username}{' '}
          //       </span>
          //     </Link>

          //     {/* <span style={{ marginLeft: 10 }}>{comment.comment.match(/@\S+/g)?.map(str => `<a href="/${str}" />`)}</span><br /> */}
          //     <span style={{ marginLeft: 10 }}>
          //       {replaceAtMentionsWithLinks2(comment.comment)}
          //     </span>
          //     <br />
          //     {/* <span style={{ float: "right", fontSize: "small" }}>

          //           </span> */}
          //     {/* <span style={{ marginLeft: 10, float: "right" }}>{"16 Oct 2020"}</span><br /> */}
          //   </Row>
        ))}
    </>
  );
};
