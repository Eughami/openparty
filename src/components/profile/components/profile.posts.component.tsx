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
  Typography,
  Select,
  DatePicker,
  message,
  Button,
  List,
  Carousel,
  Input,
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
  RightCircleTwoTone,
  LeftCircleTwoTone,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Moment from 'moment';
import Axios from 'axios';
import {
  API_BASE_URL,
  DELETE_POST_ENDPOINT,
  EDIT_POST_ENDPOINT,
} from '../../../service/api';
import firebase from 'firebase';
import { PopupboxContainer, PopupboxManager } from 'react-popupbox';

export const SPRITE_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/openpaarty.appspot.com/o/defaults%2Ficons%2F65c15d7731ea.png?alt=media&token=0870e69e-ae19-42f6-aeb8-5bd40f1e040c';
export const DEFAULT_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/openpaarty.appspot.com/o/defaults%2Fprofile_picture%2Fdefault.profile-image.png?alt=media&token=c0ee9455-36c6-4562-bfe3-eb86e02e5188';

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

const { Option } = Select;

const fallbackCopyTextToClipboard = (text: string) => {
  var textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    if (successful) {
      message.info('Post link copied to clipboard');
    } else {
      message.error('Unable to copy post link at this time');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    message.error('Unable to copy post link at this time');
  }

  document.body.removeChild(textArea);
};

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
  const { currentUser, post, type, Meta } = props;
  const [editPostModalVisible, setEditPostVisible] = useState<boolean>(false);
  const [editPostWorking, setEditPostWorking] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post>();
  const [selectedPostTags, setSelectedPostTags] = useState<string>('');
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

  const saveEditedPost = async (post: Post) => {
    setEditPostWorking(true);

    console.log(post);

    const token = await currentUser.getIdToken(true);

    await Axios.patch(
      `${API_BASE_URL}${EDIT_POST_ENDPOINT}`.replace(/:postId/g, post.id),
      post,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((__res) => {
        message.success('Post edited 🍻');
      })
      .catch((e) => {
        console.log('@EDIT POST ERROR: ', e);
        message.error('There was an error while editing this post...');
        return;
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
      icon: <ExclamationCircleOutlined />,
    });
  };

  const showModalPostOptions = (post: Post) => {
    const content = (
      <List
        size="small"
        header={null}
        footer={null}
        dataSource={[
          <Button style={{ fontWeight: 'bold' }} block type="link" danger>
            Report Post
          </Button>,
          <Button style={{ fontWeight: 'bold' }} block type="link" danger>
            Unfollow
          </Button>,
          <Button style={{ fontWeight: 'bold' }} block type="link">
            Share
          </Button>,
          <Button
            onClick={() =>
              fallbackCopyTextToClipboard(
                `http://localhost:3000/post/${post.id}`
              )
            }
            style={{ fontWeight: 'bold' }}
            block
            type="link"
          >
            Copy Link
          </Button>,
          <Button
            onClick={() => PopupboxManager.close()}
            style={{ fontWeight: 'bold' }}
            block
            type="link"
          >
            Cancel
          </Button>,
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    );
    PopupboxManager.open({ content });
  };

  return (
    <Row>
      {selectedPost && <PopupboxContainer />}
      {selectedPost && (
        <Modal
          style={{ top: 20 }}
          okText="Save"
          title={
            <div style={{ width: '70%' }}>
              <Paragraph
                ellipsis
                editable={{
                  onChange: (v) => {
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
              <>
                <Input
                  style={{ marginBottom: 10 }}
                  prefix={
                    <img
                      width="30"
                      height="40"
                      src={require('../../images/hashtag.svg')}
                      alt="#hashtag"
                    />
                  }
                  onBlur={() => {
                    console.log(selectedPost);
                  }}
                  onChange={(e) => {
                    setSelectedPost({
                      ...selectedPost,
                      tags: (e.target.value.match(/#\S+/g)
                        ? e.target.value
                            .match(/#\S+/g)!
                            .map((str: string) =>
                              str.replace(/#/g, '').replace(/,/g, '')
                            )
                        : []) as any,
                    });
                    setSelectedPostTags(e.target.value);
                  }}
                  value={selectedPostTags}
                  placeholder="(Use # to separate tags)"
                />
                {/* {selectedPost.tags && (
                  // <PostTagsComponent showTooltip={false} post={selectedPost} />
                )} */}
                <Carousel
                  nextArrow={<RightCircleTwoTone twoToneColor="#ccc" />}
                  prevArrow={<LeftCircleTwoTone twoToneColor="#ccc" />}
                  autoplay
                  arrows
                  adaptiveHeight
                >
                  {selectedPost.image_url?.map((url, index) => (
                    // my failed attempt to try and center stubborn images
                    <div style={{ textAlign: 'center' }} key={index}>
                      <img
                        id="userEditPostModalImage"
                        style={{
                          objectFit: 'contain',
                          // width: '100%',
                          height: '50vh',
                        }}
                        alt={selectedPost.caption}
                        src={url}
                      />
                    </div>
                  ))}
                </Carousel>
              </>
            }
          >
            <Meta
              description={
                <Row justify="space-between" align="middle">
                  <Select
                    style={{ marginBottom: 10 }}
                    onChange={(v) => {
                      setSelectedPost({ ...selectedPost, privacy: v as any });
                    }}
                    value={selectedPost.privacy}
                  >
                    <Option value="open">Public</Option>
                    <Option value="hard-closed">Private</Option>
                    <Option value="followers">Followers</Option>
                  </Select>
                  <DatePicker
                    dropdownAlign={{
                      overflow: { adjustX: false, adjustY: false },
                    }}
                    onOk={(date) => {
                      setSelectedPost({
                        ...selectedPost,
                        date_of_event: date.unix(),
                      });
                    }}
                    value={Moment.unix(selectedPost.date_of_event!)}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Row>
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
                      if (type === 'self-user') {
                        setSelectedPostTags(
                          post.tags
                            ? post.tags
                                .map((str) => '#' + str)
                                .join(', ')
                                .toString()
                            : ''
                        );
                        return setEditPostVisible(true);
                      }
                      return showModalPostOptions(post);
                    }}
                  />
                </span>,

                <span style={{ color: 'red', fontSize: '25px' }}>
                  <DeleteOutlined
                    onClick={() => {
                      // setSelectedPost(post);
                      showModalDeletePostMessage(post);
                    }}
                  />
                </span>,
              ].slice(0, type === 'self-user' ? 4 : 3)}
            >
              <Meta
                description={
                  !post.tags ? (
                    <div
                      style={{
                        marginBottom: 10,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
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
