import { Avatar, Button, Col, Divider, Row, Skeleton } from 'antd';
import Search from 'antd/lib/input/Search';
import Axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setCurrentUserListener,
  setCurrentUserToken,
  setCurrentUserRootDatabaseListener,
  setCurrentUserEligiblePosts,
  setCurrentUserViewing,
} from '../redux/user/user.actions';
import { API_BASE_URL, GET_USER_FOLLOWERS } from '../service/api';
import {
  RegistrationObject,
  userFollowerInterface,
} from './interfaces/user.interface';

interface IUserFollowingsProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>;
  setCurrentUserToken?: (currentUser: firebase.User) => Promise<string | null>;
  setCurrentUserViewing?: (user: RegistrationObject | null) => void;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  match?: any;
  currentUserEligiblePosts?: Array<any>;
}
const Followers = (props: IUserFollowingsProps) => {
  const [followingLoading, setFollowingLoading] = useState<boolean>(false);
  const [followings, setFollowings] = useState<
    userFollowerInterface[] | undefined
  >(undefined);
  const { username } = props.match.params;
  console.log('@USER.Following, username', username);
  console.log('@USER.Following, token', props.currentUserToken);

  // fetch followings
  const getFollowings = () => {
    setFollowingLoading(true);
    Axios.get(
      `${API_BASE_URL}${GET_USER_FOLLOWERS}`.replace(':username', username),
      {
        headers: {
          Authorization: `Bearer ${props.currentUserToken}`,
        },
      }
    )
      .then((res: AxiosResponse) => {
        const followingsRes: userFollowerInterface[] = res.data;
        console.log('@USER FOLLOwing:', followings);
        setFollowingLoading(false);
        setFollowings(followingsRes);
      })
      .catch((e) => {
        console.log('@USER FOLLOwing:Error', e);
        setFollowingLoading(false);
      });
  };
  useEffect(() => {
    getFollowings();
  }, []);
  return (
    <Row justify="center">
      <Col
        xxl={8}
        xl={10}
        lg={12}
        md={14}
        sm={18}
        xs={24}
        className="user__followings__container"
      >
        {/* TODO. Implement Search for followers */}
        {/* <Search placeholder="Search" /> */}

        {/* Suggest User if user is not following anyone */}
        {!followingLoading && followings === null && <span>No followers</span>}
        <Col sm={24} xs={0}>
          <Divider
            orientation="left"
            style={{ fontWeight: 'bold', marginBottom: 20 }}
          >
            Followers
          </Divider>
        </Col>
        {followingLoading ? (
          <Skeleton loading={true} active avatar />
        ) : (
          followings &&
          followings?.map((following, index: number) => (
            <Row
              key={index}
              justify="space-between"
              align="middle"
              gutter={[0, 16]}
            >
              <Col style={{ textAlign: 'start' }}>
                <Row align="middle">
                  <Col>
                    <Avatar src={following.image_url} size={40} />
                  </Col>
                  <Col style={{ marginLeft: 15 }}>
                    <span>
                      <Link
                        style={{ color: 'inherit' }}
                        to={`/${following.username}`}
                      >
                        <strong>{following.username}</strong>
                      </Link>
                    </span>
                    <br />
                    {/* <span>{user.name}</span> */}
                    {/* <br /> */}
                    <span>
                      {following.bio?.slice(0, 40)
                        ? following.bio?.slice(0, 40) + '...'
                        : ''}
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button type="primary">Follow</Button>
              </Col>
            </Row>
          ))
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
    currentUserEligiblePosts: state.user.currentUserEligiblePosts,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserToken: (currentUser: firebase.User) =>
      dispatch(setCurrentUserToken(currentUser)),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
    setCurrentUserEligiblePosts: (currentUser: firebase.User) =>
      dispatch(setCurrentUserEligiblePosts(currentUser)),

    setCurrentUserViewing: (user: RegistrationObject | null) =>
      dispatch(setCurrentUserViewing(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
