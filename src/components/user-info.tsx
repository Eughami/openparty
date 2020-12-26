import React, { useEffect, useState } from 'react';
import { Row, Spin, Result, Empty, Divider, Col } from 'antd';
import firebase from 'firebase';
import {
  Post,
  RegistrationObject,
  Comment,
  PrivacyStatus,
} from './interfaces/user.interface';
import { connect } from 'react-redux';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserEligiblePosts,
  setCurrentUserToken,
  setCurrentUserViewing,
} from '../redux/user/user.actions';
import axios from 'axios';
import bluebird from 'bluebird';
import { confirmUnfollow } from './profile/profile.actions';
import { ProfileAvatar } from './profile/components/profile.component.pfp';
import { ProfileUsername } from './profile/components/profile.component.username';
import { ProfileStats } from './profile/components/profile.component.stats';
import { ProfileBio } from './profile/components/profile.component.bio';
import {
  ProfileActionFollow,
  ProfileActionMessage,
  ProfileActionUnfollow,
  ProfileActionCancelFollowRequest,
  ProfileActionEdit,
} from './profile/components/profile.component.actions';
import { API_BASE_URL, CAN_USER_VIEW_PROFILE_ENDPOINT } from '../service/api';
import { ProfileRootPosts } from './profile/components/profile.component.posts';
import './user-info.style.css';
import { Link } from 'react-router-dom';
import { LOADER_OBJECTS } from './images/index';

interface IUserProps {
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

const UserProfile = (props: IUserProps) => {
  console.log('UserProfile Props: ', props);
  const {
    currentUser,
    currentUserInfo,
    currentUserEligiblePosts,
    setCurrentUserViewing,
    currentUserToken,
  } = props;
  const { username } = props.match.params;

  const [selfUser, setSelfUser] = useState<boolean | null>(false);
  const [otherUserInfo, setOtherUserInfo] = useState<RegistrationObject | null>(
    null
  );
  const [otherUserPrivacy, setOtherUserPrivacy] = useState<boolean>(false);
  const [requestedFollow, setRequestedFollow] = useState<boolean>(false);

  const [profileActionLoading, setFollowActionLoading] = useState<boolean>(
    true
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [isHardError, setIsHardError] = useState<boolean>(false);
  const [postsDoneLoading, setPostsDoneLoading] = useState<boolean>(false);
  const [realUser, setRealUser] = useState<boolean>(true);

  // const [privacyStatus, setPrivacyStatus] = useState<string>('Public');
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>(
    PrivacyStatus.PRIVATE
  );

  const [posts, setPosts] = useState<Array<Post> | boolean>([]);

  const awaitFillPosts = async (
    posts: Array<firebase.database.DataSnapshot>,
    user: RegistrationObject
  ): Promise<Array<Post>> => {
    if (!user) return [];

    let temp: Array<Post> = [];

    console.log('GETTING ALL POSTS... ', posts.length);
    for (let i = 0; i < posts.length; i++) {
      temp.push({
        caption: posts[i].val().caption,
        user: {
          image_url: user.image_url,
          username: user.username,
        },
        likes: posts[i].val().likes,
        privacy: posts[i].val().privacy,
        uid: user.uid,
        image_url: posts[i].val().image_url,
        tags: posts[i].val().tags,
        id: posts[i].key!,
        date_of_post: posts[i].val().date_of_post,
        date_of_event: posts[i].val().date_of_event,
      });
      console.log('INNER COMMENT: ', posts[i].val());
      if (posts[i].val().comments) {
        const commentKeys = Object.keys(posts[i].val().comments);
        let thisCommentArray: Array<Comment> = [];

        commentKeys.map((commentKey: string) => {
          const thisComment: Comment = posts[i].val().comments[commentKey];
          return thisCommentArray.push(thisComment);
        });

        // console.log("INNER COMMENT: ", thisCommentArray);

        temp[i].comments = thisCommentArray;

        thisCommentArray = [];
      }
    }

    return temp.sort((s1, s2) => s2.date_of_post! - s1.date_of_post!);
  };

  useEffect(() => {
    if (realUser) {
      setCurrentUserViewing!(otherUserInfo);
      document.title = `Open Party • @${username}`;
    } else {
      document.title = `Open Party • Content Not Available`;
    }
    //clean up
    return () => setCurrentUserViewing!(null);
  }, [username, realUser, otherUserInfo, setCurrentUserViewing]);

  useEffect(() => {
    const doStuff = async () => {
      if (currentUserInfo?.username === username) {
        setPosts([]);
        setPostsDoneLoading(false);
        setLoading(false);
        setSelfUser(true);
        setRealUser(true);
        firebase
          .database()
          .ref('Postsv2')
          .child(currentUser?.uid!)
          .on(
            'value',
            async (ssh) => {
              // console.log(ssh.val());

              if (ssh.exists()) {
                let ttt: Array<firebase.database.DataSnapshot> = [];

                ssh.forEach((post) => {
                  ttt.push(post);
                });

                console.log('====== POST IDS: ', ttt);

                setPosts(await awaitFillPosts(ttt, currentUserInfo!));

                setPostsDoneLoading(true);
              } else {
                setPostsDoneLoading(true);
                setPosts([]);
              }
            },
            (error: any) => {
              console.log(error);
            }
          );
      } else {
        setSelfUser(false);

        if (!currentUser) return;

        if (!currentUserToken) {
          props.setCurrentUserToken!(currentUser);
          return;
        }

        await axios
          .post(
            `${API_BASE_URL}${CAN_USER_VIEW_PROFILE_ENDPOINT}`,
            {
              targetUsername: username,
            },
            {
              headers: {
                authorization: `Bearer ${currentUserToken}`,
              },
            }
          )
          .then(async (result) => {
            if (result.data.success) {
              setIsHardError(false);
              if (result.data.selfUser) {
                setLoading(false);
                setSelfUser(true);
              } else {
                // setPrivacyStatus(result.data.privacy);

                //If following user, then target user's posts is in the global eligible posts state. Simply
                // filter by username and add listeners to database [to make it real time]
                if (result.data.privacy === 'following') {
                  setFollowActionLoading(false);
                  setRequestedFollow(false);
                  setPostsDoneLoading(false);

                  //Get data from user root profile
                  firebase
                    .database()
                    .ref('Users')
                    .child(result.data.targetUid)
                    .on(
                      'value',
                      async (ssh) => {
                        console.log(ssh.val());

                        setOtherUserPrivacy(false);
                        setOtherUserInfo(ssh.val());
                        setPrivacyStatus(PrivacyStatus.FOLLOWERS);
                        setLoading(false);
                      },
                      //HERE IS WHERE DB SNAPS FROM PRIVACY CHANGE
                      (error: any) => {
                        console.log(
                          'HMM @SUDDEN CHANGE IN USER PERMISSION- WAS FOLLOWED USER ',
                          error
                        );

                        if (error.code) {
                          if (error.code === 'PERMISSION_DENIED') {
                            console.log(
                              '@DB SNAPPED FROM PRIVACY. REVERTING TO FALLBACK USER INFO'
                            );

                            setOtherUserInfo(result.data.privateUserInfo);
                            setOtherUserPrivacy(true);
                            setPrivacyStatus(PrivacyStatus.PRIVATE);
                            setLoading(false);
                          } else {
                            setLoading(false);
                            setIsHardError(true);
                          }
                        } else {
                          setLoading(false);
                          setIsHardError(true);
                        }
                      }
                    );

                  //Get data from user's posts
                  let temp: any = {};

                  if (currentUserEligiblePosts === null) {
                    setPosts([]);

                    setPostsDoneLoading(true);
                    return;
                  }

                  const filteredEligiblePosts = currentUserEligiblePosts!.filter(
                    (post) => post.uidRef === result.data.targetUid
                  );

                  if (
                    filteredEligiblePosts.length === 0 ||
                    currentUserEligiblePosts === null ||
                    (currentUserEligiblePosts &&
                      currentUserEligiblePosts.length === 0)
                  ) {
                    console.log(
                      "SELF USER'S ELIGIBLE POST IS 0",
                      filteredEligiblePosts,
                      currentUserEligiblePosts
                    );

                    setPosts([]);

                    setPostsDoneLoading(true);
                    return;
                  }

                  //if filtered post len is 0 but res.data.user post is not 0... directly boycott filter
                  // if() {

                  // }

                  await bluebird
                    .map(
                      filteredEligiblePosts,
                      async (
                        obj: { uidRef: string; postRef: string },
                        index: number
                      ) => {
                        firebase
                          .database()
                          .ref('Postsv2')
                          .child(obj.uidRef)
                          .child(obj.postRef)
                          .on(
                            'value',
                            async (ssh) => {
                              if (!ssh.exists()) {
                                // setPosts([]);

                                // setPostsDoneLoading(true);
                                return;
                              }
                              //No need to check post privacy again because all posts we have access to are here?
                              temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                              temp[`${obj.uidRef + obj.postRef}`].key = `${
                                obj.uidRef + obj.postRef
                              }`;

                              if (localStorage.getItem('otherUserPostsSet')) {
                                temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                                temp[`${obj.uidRef + obj.postRef}`].key = `${
                                  obj.uidRef + obj.postRef
                                }`;

                                setPosts(
                                  Object.values(temp).sort(
                                    (s1: any, s2: any) =>
                                      s2.date_of_post - s1.date_of_post
                                  ) as any[]
                                );

                                setPostsDoneLoading(true);
                              }

                              if (
                                index === filteredEligiblePosts.length - 1 &&
                                !localStorage.getItem('otherUserPostsSet')
                              ) {
                                setPosts(
                                  Object.values(temp).sort(
                                    (s1: any, s2: any) =>
                                      s2.date_of_post - s1.date_of_post
                                  ) as any[]
                                );

                                setPostsDoneLoading(true);
                                localStorage.setItem(
                                  'otherUserPostsSet',
                                  'true'
                                );
                              }
                            },
                            (error: any) => {
                              console.log('@SSH ERROR: ', error);
                              if (error.code) {
                                if (error.code === 'PERMISSION_DENIED') {
                                  // delete temp[lastKey];
                                  // setPosts(Object.values(temp));
                                  //TODO: Maybe show 'post not available message'?
                                }
                              }
                            }
                          );
                      },
                      {
                        concurrency: filteredEligiblePosts.length,
                      }
                    )
                    .then(() => {
                      // setLoading(false);
                      console.log('DONE MAPPING');
                    });
                } else {
                  //Else add listeners for any change in follow requests
                  firebase
                    .database()
                    .ref('FollowRequests')
                    .child(result.data.targetUser.uid)
                    .child(currentUser.uid)
                    .on('value', (ssh) => {
                      setFollowActionLoading(false);
                      setRequestedFollow(ssh.exists());
                    });

                  //If target user's profile is private, don't show them any posts. Just show them simple info
                  if (result.data.privacy === 'closed') {
                    setLoading(false);
                    // setPosts([]);
                    setPostsDoneLoading(true);
                    setOtherUserInfo(result.data.targetUser);
                    setOtherUserPrivacy(true);
                    setPrivacyStatus(PrivacyStatus.PRIVATE);
                  }
                  //If user's profile is open, then only show the target user's public posts and info
                  if (result.data.privacy === 'open') {
                    firebase
                      .database()
                      .ref('Users')
                      .child(result.data.privateUserInfo.uid)
                      .on(
                        'value',
                        (openSsh) => {
                          setOtherUserInfo(openSsh.val());
                          setOtherUserPrivacy(false);
                          setPrivacyStatus(PrivacyStatus.PUBLIC);
                          setLoading(false);
                        },
                        (error: any) => {
                          console.log(
                            'HMM @SUDDEN CHANGE IN USER PERMISSION- OPEN USER PROFILE ',
                            error
                          );

                          if (error.code) {
                            if (error.code === 'PERMISSION_DENIED') {
                              console.log(
                                '@DB SNAPPED FROM PRIVACY. REVERTING TO FALLBACK USER INFO'
                              );

                              setOtherUserInfo(result.data.privateUserInfo);
                              setOtherUserPrivacy(true);
                              setPrivacyStatus(PrivacyStatus.PRIVATE);
                              setLoading(false);
                            } else {
                              setLoading(false);
                              setIsHardError(true);
                            }
                          } else {
                            setLoading(false);
                            setIsHardError(true);
                          }
                        }
                      );

                    if (result.data.targetUser.posts.length === 0) {
                      setPosts([]);

                      setPostsDoneLoading(true);

                      return;
                    }

                    //Get data from user's posts
                    let temp: any = {};

                    // console.log("@SETTLED COMDS: ", currentUserEligiblePosts!.filter(eligible => eligible.uidRef === username));
                    await bluebird
                      .map(
                        result.data.targetUser.posts,
                        async (
                          obj: { uidRef: string; postRef: string },
                          index: number
                        ) => {
                          firebase
                            .database()
                            .ref('Postsv2')
                            .child(obj.uidRef)
                            .child(obj.postRef)
                            .on(
                              'value',
                              async (ssh) => {
                                if (!ssh.exists()) {
                                  // setPosts([]);

                                  // setPostsDoneLoading(true);
                                  return;
                                }
                                //No need to check post privacy again because all posts we have access to are here?
                                temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                                temp[`${obj.uidRef + obj.postRef}`].key = `${
                                  obj.uidRef + obj.postRef
                                }`;

                                if (
                                  localStorage.getItem('publicUserPostsSet')
                                ) {
                                  temp[
                                    `${obj.uidRef + obj.postRef}`
                                  ] = ssh.val();
                                  temp[`${obj.uidRef + obj.postRef}`].key = `${
                                    obj.uidRef + obj.postRef
                                  }`;

                                  setPosts(
                                    Object.values(temp).sort(
                                      (s1: any, s2: any) =>
                                        s2.date_of_post - s1.date_of_post
                                    ) as any[]
                                  );

                                  setPostsDoneLoading(true);
                                }

                                if (
                                  index ===
                                    result.data.targetUser.posts.length - 1 &&
                                  !localStorage.getItem('publicUserPostsSet')
                                ) {
                                  console.log('IN COND: ', Object.values(temp));

                                  setPosts(
                                    Object.values(temp).sort(
                                      (s1: any, s2: any) =>
                                        s2.date_of_post - s1.date_of_post
                                    ) as any[]
                                  );

                                  setPostsDoneLoading(true);

                                  console.log(
                                    '@POSTS DEBUG: ',
                                    Object.values(temp)
                                  );

                                  localStorage.setItem(
                                    'publicUserPostsSet',
                                    'true'
                                  );
                                }
                              },
                              (error: any) => {
                                console.log('@SSH ERROR: ', error);
                                if (error.code) {
                                  if (error.code === 'PERMISSION_DENIED') {
                                    // delete temp[lastKey];
                                    // setPosts(Object.values(temp));
                                    //TODO: Maybe show 'post not available message'?
                                  }
                                }
                              }
                            );
                        },
                        {
                          concurrency: result.data.targetUser.posts.length,
                        }
                      )
                      .then(() => {
                        console.log('DONE MAPPING');
                      });
                  } else if (result.data.code === 404) {
                    setLoading(false);
                    setRealUser(false);
                  }
                }
              }
            } else {
              setLoading(false);
              setRealUser(false);
              setIsHardError(true);
            }
          })
          .catch((error) => {
            console.log('@AXIOS CAN VIEW USER PROFILE ERROR: ', error);

            setLoading(false);
            setIsHardError(true);
            setRealUser(false);
          });
      }
    };
    doStuff();
  }, [
    currentUserInfo,
    currentUser,
    username,
    currentUserEligiblePosts,
    currentUserToken,
    props.setCurrentUserToken,
  ]);

  if (!realUser) {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <Result
            status="404"
            title="That's weird :\"
            subTitle="The page you visited does not exist."
          />
        </div>
      </div>
    );
  }

  if (isHardError) {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <Result
            status="500"
            title="An unexpected error has occurred 🤕"
            // subTitle="The page you visited does not exist."
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Spin size="small" /> */}
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
    <Row>
      <Col
        lg={{ offset: 4, span: 16 }}
        md={{ offset: 3, span: 18 }}
        sm={{ offset: 2, span: 20 }}
        xs={{ offset: 1, span: 22 }}
      >
        {selfUser && currentUserInfo ? (
          <div>
            <Row align="middle">
              <ProfileAvatar user={currentUserInfo} />
              <div style={{ marginLeft: '5%' }}>
                <Row align="middle" justify="start">
                  <ProfileUsername
                    user={currentUserInfo}
                    style={{ fontSize: 20, float: 'left' }}
                  />
                  <Link to={`/account/edit`}>
                    <ProfileActionEdit selfUserInfo={currentUserInfo} />
                  </Link>
                </Row>

                <ProfileStats
                  user={currentUserInfo}
                  postsCount={currentUserInfo.posts_count}
                />
                <ProfileBio user={currentUserInfo} />
              </div>
            </Row>

            <Divider />
            <div className="posts__container">
              {!postsDoneLoading ? (
                <div style={{ textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              ) : (posts as Post[]).length > 0 ? (
                <ProfileRootPosts
                  currentUser={currentUser!}
                  post={posts as Post[]}
                  type="self-user"
                />
              ) : (
                <h1 style={{ textAlign: 'center' }}>You Have No Posts</h1>
              )}
            </div>
          </div>
        ) : !selfUser && otherUserInfo ? (
          <div>
            <Row style={{ alignItems: 'center' }}>
              <ProfileAvatar user={otherUserInfo} />
              <div style={{ paddingLeft: '5%' }}>
                <>
                  <ProfileUsername
                    user={otherUserInfo}
                    style={{ fontSize: 20 }}
                  />
                  <Row justify="start" align="middle">
                    {profileActionLoading ? (
                      <Spin size="small" />
                    ) : privacyStatus === PrivacyStatus.FOLLOWERS ? (
                      <ProfileActionUnfollow
                        style={{ marginRight: 10 }}
                        otherUserInfo={otherUserInfo}
                        onConfirm={
                          () => {
                            setFollowActionLoading(true);
                            confirmUnfollow(
                              otherUserInfo,
                              currentUserToken!
                            ).finally(() => setFollowActionLoading(false));
                          }
                          // .finally(() =>
                          //   setCurrentUserEligiblePosts!(currentUser!)
                          // )
                        }
                      />
                    ) : requestedFollow ? (
                      <ProfileActionCancelFollowRequest
                        style={{ marginRight: 10 }}
                        otherUserInfo={otherUserInfo}
                        currentUserToken={currentUserToken!}
                      />
                    ) : (
                      <ProfileActionFollow
                        style={{ marginRight: 10 }}
                        onConfirm={() => setFollowActionLoading(true)}
                        selfUserInfo={currentUserInfo!}
                        otherUserInfo={otherUserInfo}
                        currentUserToken={currentUserToken!}
                      />
                    )}
                    <ProfileActionMessage
                      selfUserInfo={currentUserInfo!}
                      otherUserInfo={otherUserInfo}
                    />
                  </Row>
                </>
                {!otherUserPrivacy ? (
                  <>
                    <ProfileStats
                      user={otherUserInfo}
                      postsCount={(posts as Post[]).length}
                    />
                    <ProfileBio user={otherUserInfo} />
                  </>
                ) : (
                  <>
                    <ProfileStats
                      user={otherUserInfo}
                      postsCount={otherUserInfo.posts_count}
                    />
                    <ProfileBio user={otherUserInfo} />
                  </>
                )}
              </div>
            </Row>

            <Divider />
            <div className="posts__container">
              {!postsDoneLoading ? (
                <div style={{ textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              ) : !otherUserPrivacy ? (
                (posts as Post[]).length > 0 ? (
                  <ProfileRootPosts
                    currentUser={currentUser!}
                    post={posts as Post[]}
                    type="other-user"
                  />
                ) : (
                  <h1 style={{ textAlign: 'center' }}>
                    <Empty />
                  </h1>
                )
              ) : (
                <p style={{ textAlign: 'center' }}>
                  This user's profile is private. Follow them to see more
                </p>
              )}
              {/* {!otherUserPrivacy ? (
                !postsDoneLoading ? (
                  <div style={{ textAlign: 'center' }}>
                    <Spin size="small" />
                  </div>
                ) : (posts as Post[]).length > 0 ? (
                  <ProfileRootPosts
                    currentUser={currentUser!}
                    post={posts as Post[]}
                    type="other-user"
                  />
                ) : (
                  <h1 style={{ textAlign: 'center' }}>
                    {postsDoneLoading ? <Empty /> : <Spin size="large" />}
                  </h1>
                )
              ) : (
                <p style={{ textAlign: 'center' }}>
                  This user's profile is private. Follow them to see more
                </p>
              )} */}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '15%' }}>
            <Spin size="large" />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
