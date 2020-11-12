import React, { useEffect, useState } from 'react';
import MyPost from './post';
import firebase from "firebase";
import { Comment, Post, PostPrivacy, RegistrationObject } from '../interfaces/user.interface';
import { Spin, Empty, Col, Skeleton, BackTop } from "antd";
import { connect } from 'react-redux';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../../redux/user/user.actions';
import axios from "axios"
import bluebird from "bluebird"

interface IPostsProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    currentUser?: firebase.User,
    currentUserInfo?: RegistrationObject,
    fromProfile?: boolean,
    currentUserEligiblePosts?: Array<any>,
}

/**
 * Assign posts object and return an array of posts
 * @param posts the postsRef pointing to the database node
 * @param user optional user object to be with the post
 * @returns Array of Posts
 * @deprecated We now make request to our server 
 */

export const awaitFillPosts = async (posts: Array<firebase.database.DataSnapshot>, user?: RegistrationObject): Promise<Array<Post>> => {
    if (user) {
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
    }

    let temp: Array<Post> = [];
    // console.log("GETTING ALL POSTS... ");

    for (let i = 0; i < posts.length; i++) {

        await firebase.database().ref("Users").child(posts[i].val().uid).once("value", userPosts => {
            if (userPosts.exists()) {
                // console.log("CHECKER: ", posts[i].val());
                temp.push({
                    caption: posts[i].val().caption,
                    user: {
                        image_url: userPosts.val().image_url,
                        username: userPosts.val().username,
                    },
                    likes: posts[i].val().likes,
                    privacy: posts[i].val().privacy,
                    uid: userPosts.key!,
                    image_url: posts[i].val().image_url,
                    tags: posts[i].val().tags,
                    id: posts[i].key!,
                });
                if (posts[i].val().comments) {
                    const commentKeys = Object.keys(posts[i].val().comments);
                    // console.log("INNER COMMENT: ", commentKeys);
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
        });

    }

    return temp;
};

const Posts = (props: IPostsProps) => {
    const { currentUser, currentUserInfo, currentUserEligiblePosts } = props;

    console.log("CARDS.TSX PROPS: ", props);

    const [loading, setLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<Array<any>>([])

    useEffect(() => {
        if (!currentUser) return;
        const getEligible = async () => {

            let temp: any = {};
            await bluebird.map(currentUserEligiblePosts!, async (obj: { uidRef: string, postRef: string }, index: number) => {
                firebase.database().ref("Postsv2").child(obj.uidRef).child(obj.postRef).on("value", async ssh => {

                    //No need to check post privacy again because all posts we have access to are here?
                    temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                    temp[`${obj.uidRef + obj.postRef}`].key = `${obj.uidRef + obj.postRef}`;

                    if (localStorage.getItem("postsSet")) {
                        temp[`${obj.uidRef + obj.postRef}`] = ssh.val();
                        temp[`${obj.uidRef + obj.postRef}`].key = `${obj.uidRef + obj.postRef}`;

                        setPosts(Object.values(temp).sort((s1: any, s2: any) => s2.date_of_post - s1.date_of_post)); setLoading(false)
                    }

                    if (index === currentUserEligiblePosts!.length - 1 && !localStorage.getItem("postsSet")) {

                        setPosts(Object.values(temp).sort((s1: any, s2: any) => s2.date_of_post - s1.date_of_post));

                        console.log("@POSTS DEBUG: ", Object.values(temp).sort((s1: any, s2: any) => s2.date_of_post - s1.date_of_post));

                        // Object.values(temp).map((temp: any) => {
                        //     return console.log("THIS@TEMP: ", temp.date_of_post);

                        // })

                        localStorage.setItem("postsSet", "true");

                        setLoading(false)
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
            }, { concurrency: currentUserEligiblePosts!.length }).then(() => {
                console.log("DONE MAPPING");
                // setTimeout(() => {
                //     setLoading(false)

                // }, 1000);
                // setLoading(false)
            })

            // setTimeout(() => {
            //     setLoading(false)

            // }, 1000);

        }

        getEligible();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserEligiblePosts])


    if (loading) {
        return (
            <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center" }}>
                {/* <Spin size="large" /> */}
                <Skeleton avatar active paragraph={{ rows: 4 }} />
            </Col>
        )
    }


    return (
        <div className='posts__container'>
            <BackTop />
            {

                posts.length > 0 ? posts.map((val) => <MyPost key={val.key} post={val} />
                )
                    :
                    <p style={{ textAlign: "center" }}>You are not following anyone. To see posts here go follow people.</p>
            }

        </div>
    );





    // return (
    //     <div className='posts__container'>
    //         {posts.length > 0 ? (
    //             posts.map((post, index) =>
    //                 <MyPost key={index} post={post} />
    //             )
    //         ) : (
    //                 <Empty />
    //             )
    //         }
    //     </div>
    // );
};

const mapStateToProps = (state: any) => {
    return {
        currentUser: state.user.currentUser,
        currentUserInfo: state.user.userInfo,
        currentUserEligiblePosts: state.user.currentUserEligiblePosts,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentUserListener: () => dispatch(setCurrentUserListener()),
        setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);