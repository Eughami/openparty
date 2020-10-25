import React, { useEffect, useState } from 'react';
import { Avatar, Row, Spin, Col, Result, Button, Empty } from 'antd';
import firebase from "firebase";
import MyPost from './post/post';
import { Post, PostPrivacy, RegistrationObject, Comment } from './interfaces/user.interface';
import { connect } from 'react-redux';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../redux/user/user.actions';
// import { awaitFillPosts } from "./post/posts";
import Header from "./header/header";

interface IUserProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    currentUser?: firebase.User,
    currentUserInfo?: RegistrationObject,
    match?: any
}

const UserProfile = (props: IUserProps) => {
    console.log("UserProfile Props: ", props);
    const { currentUser, currentUserInfo } = props;
    const { username } = props.match.params;

    const [selfUser, setSelfUser] = useState<boolean | null>(null);
    const [otherUserInfo, setOtherUserInfo] = useState<RegistrationObject | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [realUser, setRealUser] = useState<boolean>(true);

    const [posts, setPosts] = useState<Array<Post> | boolean>([]);

    const awaitFillPosts = async (posts: Array<firebase.database.DataSnapshot>, user: RegistrationObject): Promise<Array<Post>> => {
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
                user_id: user.uid,
                image_url: posts[i].val().image_url,
                tags: posts[i].val().tags,
                id: posts[i].key!,
            });
            console.log("INNER COMMENT: ", posts[i].val());
            if (posts[i].val().comments) {
                const commentKeys = Object.keys(posts[i].val().comments);
                let thisCommentArray: Array<Comment> = [];

                commentKeys.map((commentKey: string) => {
                    const thisComment: Comment = posts[i].val().comments[commentKey];
                    return thisCommentArray.push(thisComment);
                })

                // console.log("INNER COMMENT: ", thisCommentArray);

                temp[i].comments = thisCommentArray;

                thisCommentArray = [];
            }

        }

        return temp;

    };

    useEffect(() => {

        console.log("CHECKING IN!", selfUser);

        if (!currentUser || selfUser === null) {
            // setLoading(false);
            // setRealUser(false);
            return;
        }
        // let unSub_1: any = null;
        // let unSub_2: any = null;
        // let unSub_3: any = null;

        if (selfUser) {
            console.log("GOING IN!");

            //to make it real time, when some action happens in main post node, push/ovw data to this loc
            const unSub_1 = firebase.database().ref("Users").child(currentUser!.uid).child("Posts").on("value", async (snapshot) => {
                if (snapshot.exists()) {
                    // console.log("USE EFFECT RUNNING ", snapshot.val());

                    let ttt: Array<firebase.database.DataSnapshot> = [];
                    let postIds: Array<string> = [];
                    snapshot.forEach((userPost) => {
                        postIds.push(userPost.key!);
                    });

                    const awaitPushPostIds = async () => {
                        for (let i = 0; i < postIds.length; i++) {
                            await firebase.database().ref("Posts").child(postIds[i]).once("value", mainPost => {
                                if (mainPost.exists()) {
                                    ttt.push(mainPost);
                                }
                                // console.log("======TTTTT======", currentUserTtt);
                            })
                        }
                    }

                    await awaitPushPostIds();


                    // postIds.map(async (postId) => {
                    //     await firebase.database().ref("Posts").child(postId).once("value", mainPost => {
                    //         currentUserTtt.push(mainPost);
                    //         console.log("======TTTTT======", currentUserTtt);
                    //     })
                    // });


                    console.log("======TTTTT======", ttt);


                    const newPosts = await awaitFillPosts(ttt, currentUserInfo!);

                    setPosts(newPosts)
                    setLoading(false);
                    setRealUser(true);

                    ttt = [];
                }
                else {
                    setPosts([]);
                    setLoading(false);
                    setRealUser(false);
                }
            })

            return () => firebase.database().ref("Posts").off("value", unSub_1);
        }
        else {
            try {

                //to make it real time, when some action happens in main users node, push/ovw data to this loc
                const unSub_2 = firebase.database().ref("Credentials").child("Usernames").child(username).on("value", otherUser => {
                    if (otherUser.exists()) {
                        const otherUid = otherUser.val().uid;
                        console.log("OTHER UID: ", otherUid);

                        firebase.database().ref("Users").child(otherUid).once("value", async userInfo => {
                            if (userInfo.exists()) {
                                setOtherUserInfo(userInfo.val());

                                let ttt: Array<firebase.database.DataSnapshot> = [];
                                let postIds: Array<string> = [];
                                userInfo.child("Posts").forEach((otherUserPost) => {
                                    postIds.push(otherUserPost.key!);
                                });

                                const awaitPushPostIds = async () => {
                                    for (let i = 0; i < postIds.length; i++) {
                                        await firebase.database().ref("Posts").child(postIds[i]).once("value", mainPost => {
                                            if (mainPost.exists()) {
                                                if (mainPost.val().privacy === PostPrivacy.PUBLIC) {
                                                    ttt.push(mainPost);
                                                }
                                            }
                                        })
                                    }
                                }

                                await awaitPushPostIds();

                                console.log("==== POST IDS: ", postIds);
                                

                                // postIds.map((postId) => {
                                //     return firebase.database().ref("Posts").child(postId).once("value", mainPost => {
                                //         if (mainPost.val().privacy === PostPrivacy.PUBLIC) {
                                //             ttt.push(mainPost);
                                //         }

                                //     })
                                // })

                                // const newPosts = await awaitFillPosts(ttt, otherUserInfo!);
                                const newPosts = await awaitFillPosts(ttt, userInfo.val());

                                setPosts(newPosts)
                                setLoading(false);
                                setRealUser(true);

                                ttt = [];
                            }
                            else {
                                setPosts(false);
                                setLoading(false);
                                setRealUser(false);
                            }
                        })
                    }
                    else {
                        setPosts(false);
                        setLoading(false);
                        setRealUser(false);
                    }
                })

                return () => firebase.database().ref("Credentials").child("Usernames").child(username).off("value", unSub_2);

            } catch (error) {
                console.log(error);
                // unSub_2 = null;
                setPosts(false);
                setLoading(false);
                setRealUser(false);
            }

        }

    }, [currentUser, selfUser, username, currentUserInfo])

    useEffect(() => {
        if (currentUserInfo)
            setSelfUser(username === currentUserInfo.username);
    }, [currentUserInfo, username]);

    if (!realUser || (!loading && posts === false)) {
        // setLoading(false);
        return (
            <div>
                <Header />
                <div style={{ textAlign: "center", marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>
                    <Result
                        status="404"
                        title="That's weird :\"
                        subTitle="The page you visited does not exist."
                    // extra={<Button type="primary">Back Home</Button>}
                    />
                </div>
            </div>
        )
    }

    if ((loading || !currentUserInfo || !currentUser)) {
        return (
            <div>
                <Header />
                <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center" }}>
                    <Spin size="large" />
                </Col>
            </div>
        );
    }
    else {
        console.log("LOADING DONE!111 ", otherUserInfo);
        console.log("LOADING DONE!222 ", currentUserInfo);
        console.log("LOADING DONE!333 ", posts);

        // console.log('')
    }



    return (


        <div>
            <Header />
            <div style={{ marginLeft: "20%", marginRight: "20%", marginTop: "10%" }}>
                {
                    selfUser === true && currentUserInfo ?
                        (
                            <div>

                            <Row style={{ alignItems: "center" }}>
                                <Avatar
                                    src={currentUserInfo!.image_url}
                                    size={150}
                                />
                                <div style={{ marginLeft: 50 }}>
                                    <Col style={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <h1 style={{ marginBottom: 5, marginTop: 15, fontWeight: "bold", }}>
                                            {currentUserInfo!.username}
                                        </h1>
                                        <h1>
                                            Edit
                                    </h1>
                                    </Col>

                                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <p style={{ marginRight: 20 }}>{(posts as Post[]).length} Posts</p>
                                        <p style={{ marginRight: 20 }}>{currentUserInfo!.followers_count} Followers</p>
                                        <p>{currentUserInfo!.following_count} Following</p>
                                    </Row>
                                </div>
                            </Row>

                            <hr />
                            <div className='posts__container'>
                                {(posts as Post[]).length > 0 ? (
                                    (posts as Post[]).map((post, index) =>
                                        <MyPost key={index} post={post} />
                                    )
                                ) : (
                                        <h1 style={{ textAlign: "center" }}>"You Have No Posts</h1>
                                    )
                                }
                            </div>

                            </div>

                        )
                        :
                        selfUser === false && otherUserInfo ? (
                            <div>

                            <Row style={{ alignItems: "center" }}>
                                <Avatar
                                    src={otherUserInfo!.image_url}
                                    size={150}
                                />
                                <div style={{ marginLeft: 50 }}>
                                    <Col style={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <h1 style={{ marginBottom: 5, marginTop: 15, fontWeight: "bold", }}>
                                            {otherUserInfo!.username}
                                        </h1>
                                        <h1>
                                            Follow
                                    </h1>
                                    </Col>

                                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <p style={{ marginRight: 20 }}>{(posts as Post[]).length} Posts</p>
                                        <p style={{ marginRight: 20 }}>{otherUserInfo!.followers_count} Followers</p>
                                        <p>{otherUserInfo!.following_count} Following</p>
                                    </Row>
                                </div>
                            </Row>

                            <hr />
                            <div className='posts__container'>
                                {(posts as Post[]).length > 0 ? (
                                    (posts as Post[]).map((post, index) =>
                                        <MyPost key={index} post={post} />
                                    )
                                ) : (
                                        <h1 style={{ textAlign: "center" }}><Empty /></h1>
                                    )
                                }
                             </div>

                            </div>

                        )
                            :
                            (
                                <Result
                                    status="403"
                                    title="That's weird :\"
                                    subTitle="The page you visited does not exist."
                                // extra={<Button type="primary">Back Home</Button>}
                                />
                            )
                }
            </div>

        </div>
    )

}

const mapStateToProps = (state: any) => {
    return {
        currentUser: state.user.currentUser,
        currentUserInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentUserListener: () => dispatch(setCurrentUserListener()),
        setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
    }

}

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