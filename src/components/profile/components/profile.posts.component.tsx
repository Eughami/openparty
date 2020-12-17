//export like 2 components: 1 for self user other for other user

//1: have three components- one for open, one for close, one for private
//2: have two components- one for open, one for close

//or we can just have 5 exported components lol

import React, { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Empty,
  Modal,
  Popover,
  Carousel,
  Typography,
  Input,
  Select,
  DatePicker,
  message,
} from 'antd';
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
import {
  EllipsisOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import AsyncMention from '../../mentions/mentions.component';
import Moment from 'moment';
import Axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, DELETE_POST_ENDPOINT } from '../../../service/api';
import firebase from 'firebase';

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

const { Paragraph } = Typography;

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

const { Option } = Select;

const RenderPostCard = (props: IRenderPostCardProps) => {
  const { currentUser, post, Meta } = props;
  const [editPostModalVisible, setEditPostVisible] = useState<boolean>(false);
  const [postPopoverVisible, setPostPopoverVisible] = useState<boolean>(false);
  const [editPostWorking, setEditPostWorking] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post>();
  const [editedPost, setEditedPost] = useState<Post>();
  const history = useHistory();

  const deletePost = async (post: Post) => {
    const token = await currentUser.getIdToken(true);

    await Axios.delete(
      `${API_BASE_URL}${DELETE_POST_ENDPOINT}`.replace(/:postId/g, post.id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .catch((e) => {
        console.log('@DELETE POST ERROR: ', e);
        message.error('There was an error while deleting your post...');
        return;
      })
      .then((__res) => {
        message.success('Post successfully deleted 👏');
      });
  };

  //TODO: FIX UNDEFINED VALS WITH NULL
  const saveEditedPost = async (post: Post) => {
    setEditPostWorking(true);

    console.log(post);

    await firebase
      .database()
      .ref('Postsv2')
      .child(currentUser!.uid)
      .child(post.id)
      .update({ ...post })
      .then(() => {
        message.success('Post edited 🍻');
      })
      .catch((e) => {
        console.log('@EDIT POST ERROR: ', e);
        message.error('There was a problem while editing your post...');
      })
      .finally(() => setEditPostWorking(false));
  };

  const showModalDeletePostMessage = (post: Post) => {
    Modal.confirm({
      title: 'Delete this post?',
      async onOk() {
        try {
          return new Promise(async (resolve, __reject) => {
            await deletePost(post);
            return resolve(null);
          });
        } catch (e) {
          return console.log('Oops errors! ', e);
        }
      },
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      onCancel: () => setPostPopoverVisible(false),
      icon: <ExclamationCircleOutlined />,
    });
  };

  return (
    <Row>
      {selectedPost && (
        <Modal
          title={
            <div style={{ width: '70%' }}>
              <Paragraph
                editable={{
                  onChange: (v) => {
                    // selectedPost.caption = v;
                    setSelectedPost({ ...selectedPost, caption: v });
                  },
                }}
              >
                {selectedPost.caption}
              </Paragraph>
            </div>
          }
          visible={editPostModalVisible}
          okButtonProps={{ loading: editPostWorking }}
          onCancel={() => setEditPostVisible(false)}
          onOk={() => {
            saveEditedPost(selectedPost).finally(() =>
              setEditPostVisible(false)
            );
          }}
        >
          <Card
            bordered={false}
            cover={
              <div>
                <img
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '50vh',
                  }}
                  alt={selectedPost.caption}
                  src={selectedPost.image_url![0]}
                />
              </div>
            }
            // actions={[
            //   // <Select defaultValue={selectedPost.privacy}>
            //   //   <Option value="open">Public</Option>
            //   //   <Option value="hard-closed">Private</Option>
            //   //   <Option value="followers">Followers</Option>
            //   // </Select>,
            //   <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
            // ]}
          >
            <Meta
              description={
                <div>
                  <Select
                    onChange={(v) => {
                      setSelectedPost({ ...selectedPost, privacy: v as any });
                    }}
                    defaultValue={selectedPost.privacy}
                  >
                    <Option value="open">Public</Option>
                    <Option value="hard-closed">Private</Option>
                    <Option value="followers">Followers</Option>
                  </Select>
                  <DatePicker
                    onOk={(date) => {
                      // console.log(date.unix());

                      setSelectedPost({
                        ...selectedPost,
                        date_of_event: date.unix(),
                      });
                    }}
                    value={Moment.unix(selectedPost.date_of_event!)}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </div>
                // selectedPost.tags && (
                //   <PostTagsComponent
                //     showTooltip={false}
                //     // limitTags={2}
                //     post={selectedPost}
                //   />
                // )
              }
            />
          </Card>
        </Modal>
      )}

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
                  <EllipsisOutlined
                    onClick={() => {
                      setSelectedPost(post);
                      setEditPostVisible(true);
                    }}
                  />
                </span>,
                <span style={{ color: 'red', fontSize: '25px' }}>
                  <DeleteOutlined
                    onClick={() => {
                      setSelectedPost(post);
                      showModalDeletePostMessage(post);
                    }}
                  />
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
