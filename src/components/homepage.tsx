import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import Posts from './post/posts';
import Header from './header/header';
import { connect } from 'react-redux';
// import { setCurrentUserRootDatabaseListener } from '../redux/user/user.actions';

const Homepage = ({ currentUserInfo }: any) => {
  // console.log("HOMEPAGE.TSX PROPS: ", currentUserInfo);

  return (
    <>
      {/* <Header /> */}
      <Row className="body__container">
        <Col xs={{ span: 0 }} lg={{ span: 0 }} xl={{ span: 4 }}></Col>
        <Col
          xs={{ span: 22, offset: 1 }}
          lg={{ span: 16, offset: 2 }}
          xl={{ span: 12, offset: 2 }}
        >
          <Posts />
        </Col>
        <Col
          xs={{ span: 0 }}
          lg={{ span: 5, offset: 1 }}
          xl={{ span: 6, offset: 0 }}
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
