import React, { useEffect, useState } from 'react';
import MyPost from './post';
import firebase from "firebase";
import { Post, PostPrivacy, RegistrationObject } from '../interfaces/user.interface';
import { Spin, Empty } from "antd";
import { connect } from 'react-redux';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../../redux/user/user.actions';
import post from './post';
interface IPostsProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    currentUser?: firebase.User,
    userInfo?: RegistrationObject
}

const Posts = (props: IPostsProps) => {
    const { currentUser, userInfo } = props;

    console.log("CARDS.TSX PROPS: ", props);

    const [loading, setLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<Array<Post>>([])

    const awaitFillPosts = async (posts: Array<firebase.database.DataSnapshot>): Promise<Array<Post>> => {
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
                        user_id: userPosts.key!,
                        image_url: posts[i].val().image_url,
                        tags: posts[i].val().tags,
                        comments: posts[i].val().comments,
                        id: posts[i].key!,
                    })
                }
            });

        }

        return temp;
    };


    useEffect(() => {

        if (!currentUser) {
            setLoading(false);
            return;
        }

        const unSub = firebase.database().ref("Posts").on("value", async (snapshot) => {
            if (snapshot.exists()) {
                console.log("USE EFFECT RUNNING ", snapshot.val());

                let ttt: Array<firebase.database.DataSnapshot> = [];
                snapshot.forEach((post) => {
                    if (post.val().privacy === PostPrivacy.PUBLIC || post.val().uid === currentUser!.uid) {
                        ttt.push(post);
                    }
                });

                const newPosts = await awaitFillPosts(ttt);

                setPosts(newPosts)
                setLoading(false);
            }
            else {
                setPosts([]);
                setLoading(false);
            }
        })

        return () => firebase.database().ref("Posts").off("value", unSub);

    }, [currentUser])

    if (loading) {
        return (
            <Spin size="large" />
        )
    }

    return (
        <div className='posts__container'>
            {posts.length > 0 ? (
                posts.map((post, index) =>
                    <MyPost key={index} post={post} />
                )
            ) : (
                    <Empty />
                )
            }
        </div>
    );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Posts);