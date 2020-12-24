import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import Posts from './post/posts';
import Header from './header/header';
import { connect } from 'react-redux';
// import { setCurrentUserRootDatabaseListener } from '../redux/user/user.actions';

const Homepage = ({ currentUserInfo }: any) => {
  useEffect(() => {
    document.title = 'Open Party • Home 🤘';
  }, []);

  return (
    <>
      <Row>
        <Col
          xxl={{ span: 8, offset: 0 }}
          lg={6}
          md={4}
          sm={3}
          xs={{ span: 0 }}
        ></Col>
        <Col
          xxl={{ span: 8, offset: 0 }}
          lg={{ span: 11, offset: 1 }}
          md={{ span: 16, offset: 0 }}
          sm={{ span: 18, offset: 0 }}
          xs={{ span: 24, offset: 0 }}
        >
          <Posts />
        </Col>
        <Col
          xxl={{ span: 8, offset: 0 }}
          lg={{ span: 6, offset: 0 }}
          md={4}
          sm={3}
          xs={{ span: 0 }}
        ></Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  // checkUserSession: () => dispatch(checkUserSession()),
  // userUpated: () => dispatch(userUpated({})),
  // setCurrentUserRootDatabaseListener: () => dispatch(setCurrentUserRootDatabaseListener())
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
