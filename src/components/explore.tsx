import { Col, Row } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserPostViewing,
} from '../redux/user/user.actions';
import { API_BASE_URL, GET_ALL_POST_ENDPOINT } from '../service/api';
import ExploreLayout from './exploreLayout';
import { LOADER_OBJECTS } from './images';
import { Post, RegistrationObject } from './interfaces/user.interface';

interface ExploreProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserPostViewing?: (uid: Post | null) => void;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

const Explore = (props: ExploreProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  // array of array of posts
  const [posts, setPosts] = useState<any[] | undefined>(undefined);
  useEffect(() => {
    setLoading(true);
    // call api
    const fetchPosts = async () => {
      await Axios(`${API_BASE_URL}${GET_ALL_POST_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${props.currentUserToken}`,
        },
      })
        .then((res) => {
          setLoading(false);
          console.log('@EXPLORE:', res.data, Object.keys(res.data).length);

          let sets: any[] = [];

          // weird logic aka get post by pack of 9
          const numberOfSets = Math.floor(res.data.length / 9);
          let index = 0;
          // even if less than 9 we still render what we get
          // but the layout will remain the same
          while (index <= numberOfSets) {
            sets.push(res.data.slice(index * 9, index * 9 + 9));
            index++;
          }
          console.log('@EXPLORE:', sets);

          setPosts(sets);
        })
        .catch((e) => {
          setLoading(false);
          console.log('@EXPLORE ERROR:', e);
        });
    };
    fetchPosts();
    // setTimeout(() => setLoading(false), 2000);
  }, [props.currentUserToken]);
  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Spin size="small" />
        <p>Loading your stuff...</p> */}
        <img
          height="200"
          width="100"
          src={LOADER_OBJECTS.LOADING_GEARS_01}
          alt="LOADING"
        />
      </div>
    );
  }

  return (
    <Row justify="center" className="explore__container">
      <Col xl={16} lg={20} md={22} sm={24} xs={24}>
        {posts &&
          Object.keys(posts).length > 0 &&
          posts.map((post) => (
            <ExploreLayout key={post.id} arrayOfPosts={post} />
          ))}
        {/* <ExploreLayout arrayOfPosts={postsArray} /> */}
        {/* <ExploreLayout arrayOfPosts={postsArray} /> */}
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
    currentUserToken: state.user.currentUserToken,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
    setCurrentUserPostViewing: (post: Post | null) =>
      dispatch(setCurrentUserPostViewing(post)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
