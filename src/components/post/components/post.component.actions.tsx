import React, { useState } from "react";
import { Post } from "../../interfaces/user.interface";
import { Row } from "antd";
import {
  ShareAltOutlined,
  HeartTwoTone,
  CommentOutlined,
} from "@ant-design/icons";
import { handlePostLike } from "../post.actions";

interface IPostActionsProps {
  post: Post;
  currentUser: firebase.User;
}

export const PostActions = (props: IPostActionsProps) => {
  const { post, currentUser } = props;

  const [userLikePost, setUserLikePost] = useState<boolean>(
    Array.isArray(post.likes)
      ? post.likes.indexOf(currentUser?.uid!) !== -1
      : Object.values(post.likes).indexOf(currentUser?.uid!) !== -1
  );
  return (
    <Row className="post__clikes__and__comments" align="middle">
      <span style={{ fontSize: "25px" }}>
        <HeartTwoTone
          onClick={() =>
            handlePostLike(
              setUserLikePost,
              userLikePost,
              post.uid,
              post.id,
              currentUser
            )
          }
          twoToneColor={userLikePost ? "#eb2f96" : "#ccc"}
        />
      </span>
      <span style={{ fontSize: "25px" }}>
        <CommentOutlined />
      </span>
      <span style={{ fontSize: "25px" }}>
        <ShareAltOutlined />
      </span>
    </Row>
  );
};

interface IPostActionLikeProps {
  post: Post;
  currentUser: firebase.User;
}

export const PostActionLike = (props: IPostActionLikeProps) => {
  const { post, currentUser } = props;

  const [userLikePost, setUserLikePost] = useState<boolean>(
    Array.isArray(post.likes)
      ? post.likes.indexOf(currentUser?.uid!) !== -1
      : Object.values(post.likes ? post.likes : {}).indexOf(
          currentUser?.uid!
        ) !== -1
  );
  return (
    <span style={{ fontSize: "25px" }}>
      <HeartTwoTone
        onClick={() =>
          handlePostLike(
            setUserLikePost,
            userLikePost,
            post.uid,
            post.id,
            currentUser
          )
        }
        twoToneColor={userLikePost ? "#eb2f96" : "#ccc"}
      />
    </span>
  );
};

interface IPostActionCommentProps {
  post: Post;
  currentUser: firebase.User;
}

export const PostActionComment = (props: IPostActionCommentProps) => {
  return (
    <span style={{ fontSize: "25px" }}>
      <CommentOutlined />
    </span>
  );
};
