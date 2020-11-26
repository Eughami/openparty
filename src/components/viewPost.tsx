import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Post } from './interfaces/user.interface';
import MyPost from './post/post';

interface postIdInterface {
  postId: string;
}
interface ViewPostProps extends RouteComponentProps<any> {}
const ViewPost = (props: ViewPostProps) => {
  const [post, setPost] = useState<Post>();
  const { postId: id }: postIdInterface = useParams();
  useEffect(() => {
    const fetchPost = async (postId: string) => {
      firebase
        .database()
        .ref('Postsv2')
        .child('RSZm265JXDYyaQ4vGxQFe2Qb5rw2')
        .child(postId)
        .on('value', async (ssh) => {
          if (ssh.exists()) {
            setPost(ssh.val());
          }
          console.log('hello', ssh.val());
        });
    };

    fetchPost(id);
  }, []);

  // const id: postIdInterface = useParams();
  // console.log('VIEW POST PROPS.', props);
  // console.log('VIEW POST PROPS.', id.postId);

  const { history, match } = props;
  return (
    <>
      {post ? <MyPost post={post} fullPage={true} /> : <h1>404 NOT FOUND!</h1>}
    </>
  );
};

export default ViewPost;
