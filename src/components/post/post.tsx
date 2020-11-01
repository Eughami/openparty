import React, { useEffect, useState } from "react";
import "./post.css"
import { Input, Row, Form, Button, Avatar, Tag } from 'antd';
import { ShareAltOutlined, HeartTwoTone, CommentOutlined, SwapRightOutlined } from '@ant-design/icons';
import { Comment, Post as PostInterface, PostTags } from "../interfaces/user.interface";
import TimeAgo from 'react-timeago';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';

import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from '../../redux/user/user.actions';
import { RegistrationObject } from '../../components/interfaces/user.interface';
import { Link } from "react-router-dom";
interface IPostProps {
    setCurrentUserListener?: () => Promise<any>,
    setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
    currentUser?: firebase.User,
    currentUserInfo?: RegistrationObject,
    post: PostInterface
}

/**
 * Make a unique id for a comment or whatever we want
 * 
 * @deprecated We now use the database auto id instead
 */
export const makeId = (length: number) => {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const Post = (props: IPostProps) => {
    console.log("POST.TSX PROPS: ", (props.post.likes));
    // const { post } = props;
    const [postCommentLoading, setPostCommentLoading] = useState<boolean>(false)
    const [comment, setComment] = useState<Comment>({ comment: "", comments: [], id: "", likes: 0, timestamp: 0, user: { image_url: "", user_id: "", username: "" } });
    // const [userLikePost, setUserLikesPost] = useState<boolean>(false);

    props.post.likes = Object.keys(props.post.likes ? props.post.likes : {});

    const { user_id, likes, image_url, caption, comments, users_showing_up, date_of_event, date_of_post, tags, id: post_id } = props.post

    const { image_url: avatar_url, username } = props.post.user;

    const { currentUser, currentUserInfo } = props;

    const [userLikePost, setUserLikePost] = useState<boolean>(props.post.likes.indexOf(currentUser?.uid!) !== -1);

    const resetCommentForm = () => setComment({ comment: "", comments: [], id: "", likes: 0, timestamp: 0, user: { image_url: "", user_id: "", username: "" } });

    const onPostComment = async () => {
        console.log('Finish: ', props.post);
        if (!currentUserInfo) return alert("We're having trouble posting your comment. Please wait...");

        setPostCommentLoading(true);

        const token = await currentUser!.getIdToken(false);

        const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/add-comment", {
            postId: post_id,
            user: {
                username: currentUserInfo?.username,
                image_url: currentUserInfo?.image_url,
            },
            targetUsername: username,
            comment: comment.comment,
        }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        console.log("@ADD COMMENT RESULT: ", result);

        setPostCommentLoading(false)
        resetCommentForm()
        if (result.status !== 201) {
            alert('Your comment could not be added at this time.')
        }
    };

    const getPostTagColor = (tag: PostTags): string => {
        switch (tag) {
            case PostTags.BEACH_PARTY:
                return "magenta";
            case PostTags.COCAINE_PARTY:
                return "processing";
            case PostTags.DRUG_PARTY:
                return "red";
            default:
                return "green"
        }
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { value } = event.target;
        if (value.length > 0) {
            setComment({
                comment: value,
                user: { user_id: currentUser ? currentUser.uid : "-user", image_url: avatar_url, username: currentUserInfo ? currentUserInfo.username : "-user" },
                comments: [],
                likes: 0,
                id: makeId(26), //generate new comment_id here,
                timestamp: 0,
            })
        }
        else {
            setComment({ ...comment, comment: "" })
        }
    }

    //TODO: Maybe to make things appear faster, we can fake increase/decrease the 
    //number of likes-- before posting to our endpoint. We can catch any errors afterwards and
    // act appropriately
    const handlePostLike = async () => {
        const token = await currentUser!.getIdToken(false);
        if (userLikePost) {



            const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/unlike-post", {
                id: post_id,
                targetUsername: username
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            setUserLikePost(false);

            console.log("@LIKE POST RESULT: ", result);

        }
        else {
            console.log("YOU ARE LIKING POST", post_id);

            const result = await axios.post("http://localhost:5000/openpaarty/us-central1/api/v1/posts/like-post", {
                id: post_id,
                targetUsername: username,
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            setUserLikePost(true);

            console.log("@UNLIKE POST RESULT: ", result);
        }

    }

    return (
        <article className="Post">

            <header>
                <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={avatar_url} alt={username} />
                    </div>
                    <div className="Post-user-nickname">
                        <Link
                            to={{
                                pathname: `/${username}`,
                            }}
                        >
                            <span> {username} </span>
                        </Link>

                    </div>
                </div>
            </header>
            <div className="Post-image">
                <div className="Post-image-bg">
                    {/* How to handle posts w/out images?? */}
                    <img alt={caption} src={image_url} />
                </div>
            </div>
            <div className="Post-caption">
                <Row className='post__clikes__and__comments' align='middle'>
                    <span style={{ fontSize: "25px" }}>
                        <HeartTwoTone onClick={handlePostLike} twoToneColor={userLikePost ? "#eb2f96" : "#ccc"} />
                    </span>
                    <span style={{ fontSize: "25px" }}>
                        <CommentOutlined />
                    </span>
                    <span style={{ fontSize: "25px" }}>
                        <ShareAltOutlined />
                    </span>

                </Row>
                <TimeAgo live date={`${date_of_post ? new Date(date_of_post).toISOString() : ""}`} />
                <Row style={{}} align='middle'>
                    <p style={{ textAlign: "left", fontWeight: "bold" }}> {likes.length} {likes.length <= 1 ? "like" : "likes"}</p>
                    {/* <span style={{ textAlign: "left" }} >
                    </span> */}
                </Row>

                <Row style={{ marginBottom: 10 }} className='post__clikes__and__comments' align='middle'>
                    {
                        tags && tags.map((tag: PostTags, index: number) => <Tag color={getPostTagColor(tag)} key={index}> {tag} </Tag>)
                    }
                    {/* <div><Tag color="processing">Beach Party</Tag> </div>
                    <div><Tag color="red">BYO-Coke</Tag> </div>
                    <div><Tag color="green">Drinks</Tag> </div>
                    <div><Tag>Bikini</Tag> </div> */}
                </Row>

                {/* <Row className='post__captions' align='middle'>
                </Row> */}
                <strong>{username}</strong> {caption}
                <br />

                {/* <p style={{ fontWeight: "bold" }}>Comments</p><br /> */}
                {
                    comments && Object.values(comments).map((comment: Comment, index: number) =>
                        <Row style={{ alignContent: "center" }} key={index}>
                            <Link
                                to={{
                                    pathname: `/${comment.user.username}`,
                                }}
                            >
                                <span style={{ fontWeight: "bold" }}>{comment.user.username} </span>
                            </Link>

                            <span style={{ marginLeft: 10 }}>{comment.comment}</span><br />
                            {/* <span style={{ float: "right", fontSize: "small" }}>
                                
                            </span> */}
                            {/* <span style={{ marginLeft: 10, float: "right" }}>{"16 Oct 2020"}</span><br /> */}
                        </Row>
                    )
                }


            </div>
            {/* <Row className=''> */}
            {/* <Form form={form} name="horizontal_comment" onFinish={onFinish}>
                <Row  >
                    <Form.Item
                        style={{ flex: 1, }}
                        name="comment"
                        rules={[{ required: true, message: 'Please input your comment' }]}
                    >
                        <Input height={300} prefix={<SwapRightOutlined className="site-form-item-icon" />} placeholder="Add a comment..." />
                    </Form.Item>
                    <Form.Item shouldUpdate={true}>
                        {() => (
                            <Button

                                type="primary"
                                htmlType="submit"
                                disabled={
                                    !form.isFieldsTouched(true) ||
                                    Boolean(form.getFieldsError().filter(({ errors }) => errors.length).length)
                                }
                            >
                                Post
                            </Button>
                        )}
                    </Form.Item>
                </Row>
            </Form> */}
            {/* </Row> */}
            <Row>
                <Row style={{ flex: 1 }} className='post__add__comment'>
                    <Input value={comment.comment} onChange={(event) => handleCommentChange(event)} placeholder="Add a comment..." />
                </Row>
                <Button loading={postCommentLoading} onClick={onPostComment} disabled={comment.comment.length === 0} style={{ height: 50 }} >Post</Button>
            </Row>
        </article>
    );

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

export default connect(mapStateToProps, mapDispatchToProps)(Post);