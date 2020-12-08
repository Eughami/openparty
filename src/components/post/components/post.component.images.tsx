import React from 'react';
import { Carousel, Row } from 'antd';
import { Post } from '../../interfaces/user.interface';

interface IPostImagesProps {
  post: Post;
  imageHeight?: number;
}

export const PostImages = (props: IPostImagesProps) => {
  const { imageHeight } = props;
  return (
    <div className="">
      {/* <div className="Post-image-bg"> */}
      {/* How to handle posts w/out images?? */}
      <Carousel adaptiveHeight swipeToSlide touchMove dotPosition="top">
        {props.post.image_url?.map((url, idx) => (
          <Row className="Post-image" key={idx}>
            <img id="fucking_image" alt={props.post.caption} src={url} />
          </Row>
        ))}
      </Carousel>
    </div>
  );
};
