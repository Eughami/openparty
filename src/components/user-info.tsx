import React, { useEffect, useState } from "react";
import {
  Avatar,
  Row,
  Spin,
  Col,
  Result,
  Button,
  Tabs,
  Empty,
  Popconfirm,
  message,
  Divider,
} from "antd";
import firebase from "firebase";
import MyPost from "./post/post";
import {
  Post,
  PostPrivacy,
  RegistrationObject,
  Comment,
} from "./interfaces/user.interface";
import { connect } from "react-redux";
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserEligiblePosts,
  setCurrentUserToken,
} from "../redux/user/user.actions";
import axios from "axios";
import bluebird from "bluebird";
import {
  EditOutlined,
  AppleOutlined,
  AndroidOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import {
  API_BASE_URL,
  CANCEL_FOLLOW_REQUEST_ENDPOINT,
  CAN_USER_VIEW_PROFILE_ENDPOINT,
  SEND_FOLLOW_REQUEST_ENDPOINT,
  UNFOLOW_REQUEST_ENDPOINT,
} from "../service/api";

interface IUserProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>;
  setCurrentUserToken?: (currentUser: firebase.User) => Promise<string | null>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string;
  match?: any;
  currentUserEligiblePosts?: Array<any>;
}

const UserProfile = (props: IUserProps) => {
  console.log("UserProfile Props: ", props);
  const {
    currentUser,
    currentUserInfo,
    currentUserEligiblePosts,
    setCurrentUserEligiblePosts,
    currentUserToken,
  } = props;
  const { username } = props.match.params;
  const { TabPane } = Tabs;

  const [selfUser, setSelfUser] = useState<boolean | null>(false);
  const [otherUserInfo, setOtherUserInfo] = useState<RegistrationObject | null>(
    null
  );
  const [otherUserPrivacy, setOtherUserPrivacy] = useState<boolean>(false);
  const [requestedFollow, setRequestedFollow] = useState<boolean>(false);

  const [followActionLoading, setFollowActionLoading] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [postsDoneLoading, setPostsDoneLoading] = useState<boolean>(false);
  const [realUser, setRealUser] = useState<boolean>(true);

  const [privacyStatus, setPrivacyStatus] = useState<string>("Public");

  const [posts, setPosts] = useState<Array<Post> | boolean>([]);

  const awaitFillPosts = async (
    posts: Array<firebase.database.DataSnapshot>,
    user: RegistrationObject
  ): Promise<Array<Post>> => {
    if (!user) return [];

    let temp: Array<Post> = [];

    console.log("GETTING ALL POSTS... ", posts.length);
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
      console.log("INNER COMMENT: ", posts[i].val());
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
    if (currentUserInfo?.username === username) {
      setLoading(false);
      setSelfUser(true);
      setRealUser(true);
      firebase
        .database()
        .ref("Postsv2")
        .child(currentUser?.uid!)
        .on(
          "value",
          async (ssh) => {
            // console.log(ssh.val());

            if (ssh.exists()) {
              let ttt: Array<firebase.database.DataSnapshot> = [];

              ssh.forEach((post) => {
                ttt.push(post);
              });

              console.log("====== POST IDS: ", ttt);

              setPosts(await awaitFillPosts(ttt, currentUserInfo!));

              setPostsDoneLoading(true)
            } else {
              setPosts([]);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    } else {
      setPosts([]);
      // setOtherUserInfo(null)
      setSelfUser(false);
      setLoading(true);
    }
  }, [currentUserInfo, currentUser, username]);

  useEffect(() => {
    if (!currentUser) return;

    if (!currentUserToken) {
      props.setCurrentUserToken!(currentUser);
      return;
    }

    const decodeProfile = async () => {
      // const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/users/can-view-user-profile", {
      const result = await axios.post(
        `${API_BASE_URL}${CAN_USER_VIEW_PROFILE_ENDPOINT}`,
        {
          targetUsername: username,
        },
        {
          headers: {
            authorization: `Bearer ${currentUserToken}`,
          },
        }
      );

      console.log("@5555=========", result.data);

      if (result.data.success) {
        if (result.data.selfUser) {
          setLoading(false);
          setSelfUser(true);
        } else {
          setPrivacyStatus(result.data.privacy);

          if (result.data.privacy === "following") {
            setFollowActionLoading(false);

            if (currentUserEligiblePosts === null) {
              //serious issues here
            }

            //Get data from user root profile
            firebase
              .database()
              .ref("Users")
              .child(result.data.targetUid)
              .on(
                "value",
                async (ssh) => {
                  console.log(ssh.val());

                  setOtherUserPrivacy(false);
                  setLoading(false);
                  setOtherUserInfo(ssh.val());
                }, //HERE IS WHERE DB SNAPS FROM PRIVACY CHANGE
                (error: any) => {
                  if (error.code) {
                    if (error.code === "PERMISSION_DENIED") {
                      setLoading(false);
                      setOtherUserInfo(result.data.targetUser);
                      setOtherUserPrivacy(true);
                    }
                  }
                }
              );

            //Get data from user's posts
            let temp: any = {};

            // console.log("@SETTLED COMDS: ", currentUserEligiblePosts!.filter(eligible => eligible.uidRef === username));
            await bluebird
              .map(
                currentUserEligiblePosts!.filter(
                  (eligible) => eligible.username === username
                ),
                async (
                  obj: { uidRef: string; postRef: string },
                  index: number
                ) => {
                  firebase
                    .database()
                    .ref("Postsv2")
                    .child(obj.uidRef)
                    .child(obj.postRef)
                    .on(
                      "value",
                      async (ssh) => {
                        //No need to check post privacy again because all posts we have access to are here?
                        temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                        temp[`${obj.uidRef + obj.postRef}`].key = `${
                          obj.uidRef + obj.postRef
                        }`;

                        if (localStorage.getItem("otherUserPostsSet")) {
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
                        }

                        if (
                          index ===
                            currentUserEligiblePosts!.filter(
                              (eligible) => eligible.username === username
                            ).length -
                              1 &&
                          !localStorage.getItem("otherUserPostsSet")
                        ) {
                          console.log("IN COND: ", Object.values(temp));

                          setPosts(
                            Object.values(temp).sort(
                              (s1: any, s2: any) =>
                                s2.date_of_post - s1.date_of_post
                            ) as any[]
                          );

                          setPostsDoneLoading(true);

                          console.log("@POSTS DEBUG: ", Object.values(temp));

                          localStorage.setItem("otherUserPostsSet", "true");
                        }
                      },
                      (error: any) => {
                        console.log("@SSH ERROR: ", error);
                        if (error.code) {
                          if (error.code === "PERMISSION_DENIED") {
                            const lastKey = error.message
                              .split(":")[0]
                              .split("/")[3];

                            // delete temp[lastKey];

                            // setPosts(Object.values(temp));

                            //TODO: Maybe show 'post not available message'?
                          }
                        }
                      }
                    );
                },
                {
                  concurrency: currentUserEligiblePosts!.filter(
                    (eligible) => eligible.username === username
                  ).length,
                }
              )
              .then(() => {
                console.log("DONE MAPPING");
              });
          } else {
            firebase
              .database()
              .ref("FollowRequests")
              .child(result.data.targetUser.uid)
              .child(currentUser.uid)
              .on("value", (ssh) => {
                setFollowActionLoading(false);
                setRequestedFollow(ssh.exists());
              });

            if (result.data.privacy === "closed") {
              setLoading(false);
              setOtherUserInfo(result.data.targetUser);
              setOtherUserPrivacy(true);
            }
            if (result.data.privacy === "open") {
              setLoading(false);
              setOtherUserInfo(result.data.targetUser);
              setOtherUserPrivacy(false);

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
                      .ref("Postsv2")
                      .child(obj.uidRef)
                      .child(obj.postRef)
                      .on(
                        "value",
                        async (ssh) => {
                          //No need to check post privacy again because all posts we have access to are here?
                          temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                          temp[`${obj.uidRef + obj.postRef}`].key = `${
                            obj.uidRef + obj.postRef
                          }`;

                          if (localStorage.getItem("publicUserPostsSet")) {
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
                          }

                          if (
                            index === result.data.targetUser.posts.length - 1 &&
                            !localStorage.getItem("publicUserPostsSet")
                          ) {
                            console.log("IN COND: ", Object.values(temp));

                            setPosts(
                              Object.values(temp).sort(
                                (s1: any, s2: any) =>
                                  s2.date_of_post - s1.date_of_post
                              ) as any[]
                            );

                            setPostsDoneLoading(true);

                            console.log("@POSTS DEBUG: ", Object.values(temp));

                            localStorage.setItem("publicUserPostsSet", "true");
                          }
                        },
                        (error: any) => {
                          console.log("@SSH ERROR: ", error);
                          if (error.code) {
                            if (error.code === "PERMISSION_DENIED") {
                              const lastKey = error.message
                                .split(":")[0]
                                .split("/")[3];

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
                  console.log("DONE MAPPING");
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
      }
    };

    decodeProfile();

    // return () => localStorage.removeItem("otherUserProfileLoaded")
  }, [
    currentUserEligiblePosts,
    username,
    currentUser,
    currentUserToken,
    props.setCurrentUserToken,
  ]);

  const confirm = async (otherUserInfo: RegistrationObject) => {
    // const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/users/unfollow-user", {
    const result = await axios.post(
      `${API_BASE_URL}${UNFOLOW_REQUEST_ENDPOINT}`,
      {
        targetUser: otherUserInfo.uid,
      },
      {
        headers: {
          authorization: `Bearer ${currentUserToken}`,
        },
      }
    );

    console.log(result.data);

    await setCurrentUserEligiblePosts!(currentUser!);

    message.success("Unfollow successful");
  };

  const cancel = (e: any) => {
    console.log(e);
    // message.error('Click on No');
  };

  const handleFollowRequest = async (otherUserInfo: RegistrationObject) => {
    await axios.post(
      //   'http://localhost:5000/openpaarty/us-central1/api/v1/users/send-follow-request',
      `${API_BASE_URL}${SEND_FOLLOW_REQUEST_ENDPOINT}`,
      {
        targetUsername: otherUserInfo.username,
        username: currentUserInfo?.username,
        image_url: currentUserInfo?.image_url,
      },
      {
        headers: {
          authorization: `Bearer ${currentUserToken}`,
        },
      }
    );

    message.success("Follow request sent");
  };

  const handleCancelFollowRequest = async (
    otherUserInfo: RegistrationObject
  ) => {
    await axios.post(
      //   'http://localhost:5000/openpaarty/us-central1/api/v1/users/cancel-follow-request',
      `${API_BASE_URL}${CANCEL_FOLLOW_REQUEST_ENDPOINT}`,
      {
        targetUser: otherUserInfo.uid,
      },
      {
        headers: {
          authorization: `Bearer ${currentUserToken}`,
        },
      }
    );

    message.success("Follow request canceled");
  };

  if (!realUser) {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <Result
            status="404"
            title="That's weird :\"
            subTitle="The page you visited does not exist."
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div>
      {/* <Header /> */}
      <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
        {selfUser && currentUserInfo ? (
          <div>
            <Row style={{ alignItems: "center" }}>
              <Avatar src={currentUserInfo!.image_url} size={150} />
              <div style={{ marginLeft: 50 }}>
                <Row
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: 5,
                      // marginTop: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {currentUserInfo!.username}
                  </h1>
                  <Button icon={<EditOutlined />}>Edit</Button>
                  {/* <h1>Edit</h1> */}
                </Row>

                <Row
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ marginRight: 20 }}>
                    {(posts as Post[]).length} Posts
                  </p>
                  <p style={{ marginRight: 20 }}>
                    {currentUserInfo!.followers_count} Followers
                  </p>
                  <p>{currentUserInfo!.following_count} Following</p>
                </Row>

                {currentUserInfo.bio && <span>{currentUserInfo.bio}</span>}
              </div>
            </Row>

            <Divider />
            <div className="posts__container">
              {
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        <AppleOutlined />
                        Posts
                      </span>
                    }
                    key="self-user-tab-1"
                  >
                    {!postsDoneLoading ? (
                      <Spin />
                    ) : (posts as Post[]).length > 0 ? (
                      (posts as Post[]).map((post, index) => (
                        <MyPost key={index} post={post} />
                      ))
                    ) : (
                      <h1 style={{ textAlign: "center" }}>You Have No Posts</h1>
                    )}
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <AndroidOutlined />
                        Tab 2
                      </span>
                    }
                    key="self-user-tab-2"
                  >
                    Tab 2
                  </TabPane>
                </Tabs>
              }
            </div>
          </div>
        ) : !selfUser && otherUserInfo ? (
          <div>
            <Row style={{ alignItems: "center" }}>
              <Avatar src={otherUserInfo!.image_url} size={150} />
              <div style={{ marginLeft: 50 }}>
                <Col
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: 5,
                      // marginTop: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {otherUserInfo!.username}
                  </h1>
                  <span style={{ cursor: "pointer" }}>
                    {followActionLoading ? (
                      <Spin size="small" />
                    ) : privacyStatus === "following" ? (
                      <Popconfirm
                        title="You will have to send a request to follow again."
                        onConfirm={() => confirm(otherUserInfo)}
                        onCancel={cancel}
                        okText="Unfollow"
                        cancelText="Cancel"
                      >
                        <Button icon={<UserDeleteOutlined />}>Unfollow</Button>
                        {/* <p>Unfollow</p> */}
                      </Popconfirm>
                    ) : privacyStatus === "Public" ? (
                      requestedFollow ? (
                        <Button
                          onClick={() =>
                            handleCancelFollowRequest(otherUserInfo)
                          }
                        >
                          Cancel Request
                        </Button>
                      ) : (
                        // <p
                        //   onClick={() =>
                        //     handleCancelFollowRequest(otherUserInfo)
                        //   }
                        // >

                        //   Cancel Request
                        // </p>
                        <Button
                          onClick={() => handleFollowRequest(otherUserInfo)}
                          icon={<UserAddOutlined />}
                        >
                          Follow
                        </Button>
                      )
                    ) : requestedFollow ? (
                      <Button
                        onClick={() => handleCancelFollowRequest(otherUserInfo)}
                      >
                        Cancel Request
                      </Button>
                    ) : (
                      // <p
                      //   onClick={() =>
                      //     handleCancelFollowRequest(otherUserInfo)
                      //   }
                      // >
                      //   Cancel Request
                      // </p>
                      <Button
                        onClick={() => handleFollowRequest(otherUserInfo)}
                        icon={<UserAddOutlined />}
                      >
                        Follow
                      </Button>
                    )}
                  </span>
                </Col>
                {!otherUserPrivacy ? (
                  <>
                    <Row
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ marginRight: 20 }}>
                        {(posts as Post[]).length} Posts
                      </p>
                      <p style={{ marginRight: 20 }}>
                        {otherUserInfo!.followers_count} Followers
                      </p>
                      <p>{otherUserInfo!.following_count} Following</p>
                    </Row>
                    {otherUserInfo.bio && <span>{otherUserInfo.bio}</span>}
                  </>
                ) : (
                  <>
                    <Row
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ marginRight: 20 }}>
                        {otherUserInfo.posts_count} Posts
                      </p>
                      <p style={{ marginRight: 20 }}>
                        {otherUserInfo.followers_count} Followers
                      </p>
                      <p>{otherUserInfo.following_count} Following</p>
                    </Row>
                    {otherUserInfo.bio && <span>{otherUserInfo.bio}</span>}
                  </>
                )}
              </div>
            </Row>

            <Divider />
            <div className="posts__container">
              {!otherUserPrivacy ? (
                !postsDoneLoading ? <Spin /> :
                (posts as Post[]).length > 0 ? (
                  <Row gutter={6}>
                    
                      <Col flex="1 0 0%" className="gutter-row" span={12}>
                        <div style={{ padding: "8px 0" }}>
                        {(posts as Post[]).map((post, index) => (
                          <img  width="100%" key={index} src={post.image_url![0]} alt={post.caption}  />
                          ))}
                        </div>
                      </Col>
                    
                  </Row>
                ) : (
                  <h1 style={{ textAlign: "center" }}>
                    <Empty />
                  </h1>
                )
                // <Tabs defaultActiveKey="1">
                //   <TabPane
                //     tab={
                //       <span>
                //         <AppleOutlined />
                //         Posts
                //       </span>
                //     }
                //     key="other-user-tab-1"
                //   >
                //     {!postsDoneLoading ? (
                //       <Spin />
                //     ) : (posts as Post[]).length > 0 ? (
                //       (posts as Post[]).map((post, index) => (
                //         <MyPost key={index} post={post} />
                //       ))
                //     ) : (
                //       <h1 style={{ textAlign: "center" }}>
                //         <Empty />
                //       </h1>
                //     )}
                //   </TabPane>
                //   <TabPane
                //     tab={
                //       <span>
                //         <AndroidOutlined />
                //         Tab 2
                //       </span>
                //     }
                //     key="other-user-tab-2"
                //   >
                //     Tab 2
                //   </TabPane>
                // </Tabs>
              
              ) : (
                <p style={{ textAlign: "center" }}>
                  This user's profile is private. Follow them to see more
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "15%" }}>
            <Spin size="small" />
          </div>
          // <Result
          //     status="403"
          //     title="That's weird :\"
          //     subTitle="The page you visited does not exist."
          // // extra={<Button type="primary">Back Home</Button>}
          // />
        )}
      </div>
    </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = {
  screen: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 200,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
};
