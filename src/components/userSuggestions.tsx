import { Button, Col, Descriptions, Row } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RegistrationObject } from './interfaces/user.interface';

const UserSuggestions = ({ users }: any) => {
  useEffect(() => {
    console.log('UserSuggestion mounted with : ', users);
  }, []);
  return (
    <div className="suggested__users__containers">
      {
        Object.keys(users).length > 0
          ? // get the top 10 users
            users.map((user: RegistrationObject, index: number) => (
              <Row
                key={index}
                justify="space-between"
                align="middle"
                gutter={[0, 16]}
              >
                <Col offset={1} style={{ textAlign: 'start' }}>
                  <Row align="middle">
                    <Col>
                      <Avatar src={user.image_url} size={40} />
                    </Col>
                    <Col style={{ marginLeft: 15 }}>
                      <span>
                        <Link
                          style={{ color: 'inherit' }}
                          to={`/${user.username}`}
                        >
                          <strong>{user.username}</strong>
                        </Link>
                      </span>
                      <br />
                      {/* <span>{user.name}</span> */}
                      {/* <br /> */}
                      <span>
                        {user.bio?.slice(0, 30)
                          ? user.bio?.slice(0, 30) + '...'
                          : ''}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Link style={{ color: 'inherit' }} to={`/${user.username}`}>
                    <Button type="link" block>
                      View
                    </Button>
                  </Link>
                </Col>
              </Row>
            ))
          : null
        // <span>No Users Found</span>
      }
    </div>
  );
};

export default UserSuggestions;
