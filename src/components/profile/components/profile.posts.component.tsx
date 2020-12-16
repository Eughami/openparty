//export like 2 components: 1 for self user other for other user

//1: have three components- one for open, one for close, one for private
//2: have two components- one for open, one for close

//or we can just have 5 exported components lol

import { Card, Col, Row, Empty } from 'antd';
import React from 'react';
import { PostCaption } from '../../post/components/post.component.caption';
import { PostLikesNumber } from '../../post/components/post.component.likes';
import { PostTags as PostTagsComponent } from '../../post/components/post.component.tags';
import { PostCommentsNumber } from '../../post/components/post.component.comments';
import {
  PostActionLike,
  PostActionComment,
} from '../../post/components/post.component.actions';
import { Post, RegistrationObject } from '../../interfaces/user.interface';
import { CardMetaProps } from 'antd/lib/card';
import { EllipsisOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export const SPRITE_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/openpaarty.appspot.com/o/defaults%2Ficons%2F65c15d7731ea.png?alt=media&token=0870e69e-ae19-42f6-aeb8-5bd40f1e040c';

interface IProfilePostsProps {
  currentUser: firebase.User;
  post: Post[];
  type: 'self-user' | 'other-user';
  user?: RegistrationObject;
}

interface IRenderPostCardProps {
  currentUser: firebase.User;
  post: Post[];
  type: 'self-user' | 'other-user';
  Meta: React.FC<CardMetaProps>;
}

/**
 * Return card view of self user's open post
 * @param props
 */

export const ProfileSelfUserPosts = (props: IProfilePostsProps) => {
  const { post, currentUser, type } = props;
  const { Meta } = Card;
  return (
    <RenderPostCard
      type={type}
      Meta={Meta}
      currentUser={currentUser}
      post={post}
    />
  );
};

export const ProfileSelfUserOpenPosts = (props: IProfilePostsProps) => {
  const { post, currentUser, type } = props;
  const { Meta } = Card;
  return (
    <RenderPostCard
      type={type}
      Meta={Meta}
      currentUser={currentUser}
      post={post}
    />
  );
};

export const ProfileSelfUserPrivatePosts = (props: IProfilePostsProps) => {
  const { post, currentUser, type } = props;
  const { Meta } = Card;
  return (
    <RenderPostCard
      type={type}
      Meta={Meta}
      currentUser={currentUser}
      post={post}
    />
  );
};

export const ProfileOtherUserPosts = (props: IProfilePostsProps) => {
  const { post, currentUser, type } = props;
  const { Meta } = Card;
  return (
    <RenderPostCard
      type={type}
      Meta={Meta}
      currentUser={currentUser}
      post={post}
    />
  );
};

export const ProfileOtherUserOpenPosts = (props: IProfilePostsProps) => {
  const { post, currentUser, type } = props;
  const { Meta } = Card;
  return (
    <RenderPostCard
      type={type}
      Meta={Meta}
      currentUser={currentUser}
      post={post}
    />
  );
};

const RenderPostCard = (props: IRenderPostCardProps) => {
  const { currentUser, post, Meta } = props;
  const history = useHistory();
  return (
    <Row>
      {post.length === 0 ? (
        <h1 style={{ textAlign: 'center' }}>
          <Empty />
        </h1>
      ) : (
        post.map((post, index) => (
          <Col
            style={{ padding: 5 }}
            key={index}
            className="gutter-row"
            xl={8}
            md={12}
            xs={24}
          >
            <Card
              hoverable
              cover={
                <div>
                  <img
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '50vh',
                    }}
                    onClick={() => history.push(`/post/${post.id}`)}
                    className="zoom"
                    alt={post.caption}
                    src={post.image_url![0]}
                  />
                  {post.image_url && post.image_url.length > 1 && (
                    <span
                      style={{
                        zIndex: 2,
                        position: 'absolute',
                        top: 0,
                        left: 5,
                        backgroundPosition: '0 0',
                        float: 'right',
                        backgroundRepeat: 'no-repeat',
                        width: '32px',
                        height: '32px',
                        backgroundImage: `url(${SPRITE_IMAGE_URL})`,
                      }}
                    ></span>
                  )}
                </div>
              }
              actions={[
                <Row justify="center" align="middle">
                  <PostActionLike currentUser={currentUser!} post={post} />
                  <p style={{ marginLeft: 10 }}></p>

                  <PostLikesNumber post={post} />
                </Row>,
                <Row
                  onClick={() => history.push(`/post/${post.id}`)}
                  justify="center"
                  align="middle"
                >
                  <PostActionComment currentUser={currentUser!} post={post} />
                  <p style={{ marginLeft: 10 }}></p>

                  <PostCommentsNumber post={post} />
                </Row>,
                <span style={{ fontSize: '25px' }}>
                  <EllipsisOutlined />
                </span>,
              ]}
            >
              <Meta
                description={
                  !post.tags ? (
                    <div style={{ marginBottom: 10 }}>
                      <PostCaption post={post} />
                    </div>
                  ) : (
                    <PostTagsComponent
                      showTooltip={false}
                      limitTags={2}
                      post={post}
                    />
                  )
                }
              />
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
};
