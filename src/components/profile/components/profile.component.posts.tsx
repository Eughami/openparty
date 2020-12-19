//pass in props to signify self user or other user

//if self user: render the 3 returned components from [...] inside 3 tabs
//if other user: render the 2 returned components from [+++] inside 2 tabs

//here we will have two-three tabs depending on props: all posts, open posts, private posts?

import React from 'react';
import { Tabs } from 'antd';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import { Post, RegistrationObject } from '../../interfaces/user.interface';
import {
  ProfileOtherUserOpenPosts,
  ProfileOtherUserPosts,
  ProfileSelfUserOpenPosts,
  ProfileSelfUserPosts,
  ProfileSelfUserPrivatePosts,
} from './profile.posts.component';

interface IProfilePostsRootProps {
  currentUser: firebase.User;
  post: Post[];
  type: 'self-user' | 'other-user';
  user?: RegistrationObject;
}

/**
 * Return card view of self user's open post
 * @param props
 */

export const ProfileRootPosts = (props: IProfilePostsRootProps) => {
  const { user, post, type, currentUser } = props;

  return type === 'self-user' ? (
    <ProfileRootSelfUserPosts
      currentUser={currentUser}
      user={user}
      type={type}
      post={post}
    />
  ) : (
    <ProfileRootOtherUserPosts
      currentUser={currentUser}
      user={user}
      type={type}
      post={post}
    />
  );
};

export const ProfileRootSelfUserPosts = (props: IProfilePostsRootProps) => {
  const { currentUser, post, type } = props;
  const { TabPane } = Tabs;
  return (
    <Tabs centered defaultActiveKey="1">
      <TabPane
        tab={
          <span>
            <AppleOutlined />
            All Posts
          </span>
        }
        key="self-user-tab-1"
      >
        <ProfileSelfUserPosts
          type={type}
          currentUser={currentUser}
          post={post}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <AndroidOutlined />
            Public Posts
          </span>
        }
        key="self-user-tab-2"
      >
        <ProfileSelfUserOpenPosts
          type={type}
          currentUser={currentUser}
          post={post.filter((post) => (post.privacy as any) === 'open')}
        />
      </TabPane>

      <TabPane
        tab={
          <span>
            {/* <AppleOutlined /> */}
            <img
              style={{ marginRight: 10, height: 20, width: 20 }}
              src={require('../../images/incognito.svg')}
              alt="incog"
            />
            Private Posts
          </span>
        }
        key="self-user-tab-3"
      >
        <ProfileSelfUserPrivatePosts
          type={type}
          currentUser={currentUser}
          post={post.filter((post) => (post.privacy as any) === 'hard-closed')}
        />
      </TabPane>
    </Tabs>
  );
};

export const ProfileRootOtherUserPosts = (props: IProfilePostsRootProps) => {
  const { currentUser, post, type } = props;
  const { TabPane } = Tabs;
  return (
    <Tabs defaultActiveKey="1">
      <TabPane
        tab={
          <span>
            <AppleOutlined />
            All Posts
          </span>
        }
        key="other-user-tab-1"
      >
        <ProfileOtherUserPosts
          type={type}
          currentUser={currentUser}
          post={post}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <AndroidOutlined />
            Public Posts
          </span>
        }
        key="other-user-tab-2"
      >
        <ProfileOtherUserOpenPosts
          type={type}
          currentUser={currentUser}
          post={post.filter((post) => (post.privacy as any) === 'open')}
        />
      </TabPane>
    </Tabs>
  );
};
