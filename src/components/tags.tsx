import React, { useEffect, useState } from 'react'
import { setCurrentUserListener, setCurrentUserToken, setCurrentUserRootDatabaseListener, setCurrentUserEligiblePosts } from '../redux/user/user.actions';
import { Post, RegistrationObject, Comment } from './interfaces/user.interface'
import MyPost from './post/post';
import { connect } from 'react-redux';
import axios from "axios"
import bluebird from "bluebird"
import firebase from 'firebase';
import { BackTop, Col, Skeleton } from 'antd';


interface ITagsProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>,
    setCurrentUserToken?: (currentUser: firebase.User) => Promise<string | null>,
    currentUser?: firebase.User,
    currentUserInfo?: RegistrationObject,
    currentUserToken?: string,
    match?: any,
    currentUserEligiblePosts?: Array<any>,
}


const Tags = (props: ITagsProps) => {

    console.log("Tag Props: ", props);
    const { currentUser, currentUserInfo, currentUserEligiblePosts, setCurrentUserEligiblePosts, currentUserToken } = props;
    const { tag } = props.match.params;
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<Array<Post>>([]);

    useEffect(() => {
        const decodeProfile = async () => {
            if (!currentUser) return;

            if (!currentUserToken) {
                props.setCurrentUserToken!(currentUser)
                return;
            }

            const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/tags-post", {
                tag
            }, {
                headers: {
                    authorization: `Bearer ${currentUserToken}`
                }
            });

            console.log(result.data);


            if (result.data.success) {
                let temp: any = {};

                await bluebird.map(result.data.uFP, async (obj: { uidRef: string, postRef: string }, index: number) => {
                    firebase.database().ref("Postsv2").child(obj.uidRef).child(obj.postRef).on("value", async ssh => {

                        temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                        temp[`${obj.uidRef + obj.postRef}`].key = `${obj.uidRef + obj.postRef}`;

                        if (localStorage.getItem("tagPostsSet")) {
                            temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                            temp[`${obj.uidRef + obj.postRef}`].key = `${obj.uidRef + obj.postRef}`;

                            setPosts(Object.values(temp).sort((s1: any, s2: any) => s2.date_of_post - s1.date_of_post) as any[]);
                        }

                        if (index === result.data.uFP.length - 1 && !localStorage.getItem("tagPostsSet")) {
                            console.log("IN COND: ", Object.values(temp));

                            setPosts(Object.values(temp).sort((s1: any, s2: any) => s2.date_of_post - s1.date_of_post) as any[]);

                            console.log("@POSTS DEBUG: ", Object.values(temp));

                            localStorage.setItem("tagPostsSet", "true");
                        }

                    }, (error: any) => {
                        console.log("@SSH ERROR: ", error);
                        if (error.code) {
                            if (error.code === "PERMISSION_DENIED") {
                                const lastKey = error.message.split(":")[0].split("/")[3];

                                // delete temp[lastKey];

                                // setPosts(Object.values(temp));

                                //TODO: Maybe show 'post not available message'?
                            }
                        }

                    })
                }, { concurrency: result.data.uFP.length }).then(() => {
                    console.log("DONE MAPPING");
                }).then(() => setLoading(false))

            }

        }


        decodeProfile();

        // return () => localStorage.removeItem("otherUserProfileLoaded") 
    }, [tag, currentUser, currentUserToken, props.setCurrentUserToken])


    if (loading) {
        return (
            <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "7%", textAlign: "center" }}>
                {/* <Spin size="large" /> */}
                <Skeleton avatar active paragraph={{ rows: 4 }} />
            </Col>
        )
    }


    return (
        <div style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%" }}>
            <div >
                <BackTop />
                {

                    posts.length > 0 && posts.map((val: any) => <MyPost key={val.key} post={val} />
                    )
                    // :
                    // <p style={{ textAlign: "center" }}>You are not following anyone. To see posts here go follow people.</p>
                }

            </div>
        </div>


    )

}

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
        setCurrentUserToken: (currentUser: firebase.User) => dispatch(setCurrentUserToken(currentUser)),
        setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid)),
        setCurrentUserEligiblePosts: (currentUser: firebase.User) => dispatch(setCurrentUserEligiblePosts(currentUser)),
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Tags);