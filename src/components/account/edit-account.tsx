import React, { useEffect } from 'react';
import { Tabs, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { EditProfile } from './components/edit-account.component.profile';
import { ChangePassword } from './components/edit-account.component.password';
import { EditPrivacy } from './components/edit-account.component.privacy';
import { RegistrationObject } from '../interfaces/user.interface';
import { useLocation } from 'react-router-dom';

interface IEditAccountInterface {
  currentUserInfo?: RegistrationObject;
  currentUser?: firebase.User;
}

const { TabPane } = Tabs;

const EditAccount = (props: IEditAccountInterface) => {
  const { currentUserInfo, currentUser } = props;
  const location = useLocation();
  console.log('EDIT ACCOUNT: ', props);

  useEffect(() => {
    document.title = `Open Party • Edit Profile`;
  }, []);

  if (!currentUser || !currentUserInfo) {
    return null;
  }

  return (
    <>
      <Row
        style={{
          marginTop: 20,
        }}
      >
        <Col
          lg={{ offset: 4, span: 16 }}
          md={{ offset: 3, span: 18 }}
          sm={{ offset: 2, span: 20 }}
          xs={{ offset: 1, span: 22 }}
        >
          {/* TODO: Change position to 'top' when in mobile view */}
          <Tabs
            tabPosition="left"
            defaultActiveKey={
              location.hash.length > 0 ? location.hash.replace(/#/g, '') : '1'
            }
          >
            <TabPane tab="Edit Profile" key="1">
              <EditProfile currentUser={currentUser!} user={currentUserInfo!} />
            </TabPane>
            <TabPane tab="Change Password" key="2">
              <ChangePassword user={currentUser!} />
            </TabPane>
            <TabPane tab="Notification Settings" key="3">
              Notification Settings
            </TabPane>
            <TabPane tab="Privacy" key="4">
              <EditPrivacy currentUser={currentUser!} user={currentUserInfo!} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUserInfo: state.user.userInfo,
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps, null)(EditAccount);
