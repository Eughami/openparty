import { Col, Row, Skeleton, Spin } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserPostViewing,
} from '../redux/user/user.actions';
import {
  API_BASE_URL,
  EXPLORE_POSTS_ENDPOINT,
  POST_ROOT,
} from '../service/api';
import ExploreLayout from './exploreLayout';
import { LOADER_OBJECTS } from './images';
import { Post, RegistrationObject } from './interfaces/user.interface';
import { useQuery } from 'react-query';

interface ExploreProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserPostViewing?: (uid: Post | null) => void;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
}

const fetchPosts = async (currentUserToken: string) => {
  return Axios(`${API_BASE_URL}${EXPLORE_POSTS_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${currentUserToken}`,
    },
  })
    .then((res) => {
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

      return sets;
    })
    .catch((e) => {
      console.log('@EXPLORE ERROR:', e);
    });
};

const Explore = (props: ExploreProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  // array of array of posts
  const [posts, setPosts] = useState<any[] | undefined>(undefined);
  const { data, status } = useQuery('explore', () =>
    fetchPosts(props.currentUserToken!)
  );
  console.log('@RQ', data);

  if (status === 'loading') {
    return (
      <Row justify="center" style={{ paddingTop: 60 }}>
        {/* <div className="page__global__loader"> */}
        {[1, 1, 1, 1].map((_, index) => (
          <Col span={9} offset={1}>
            <Skeleton key={index} avatar active paragraph={{ rows: 4 }} />
          </Col>
        ))}
        {/* <Spin size="large" /> */}

        {/* <img
          height="200"
          width="100"
          // use party icons
          src={LOADER_OBJECTS.LOADING_PULSE_01}
          alt="LOADING"
        /> */}
        {/* </div> */}
      </Row>
    );
  }

  //TODO: check if status === error

  return (
    <Row justify="center" className="explore__container">
      <Col xl={16} lg={20} md={22} sm={24} xs={24}>
        {data
          ? Object.keys(data).length > 0 &&
            data.map((post: any, index: number) => (
              <ExploreLayout key={index} arrayOfPosts={post} />
            ))
          : null}
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
