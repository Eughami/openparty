import React from 'react';
import { Carousel, Row } from 'antd';
import { RightCircleTwoTone, LeftCircleTwoTone } from '@ant-design/icons';
import { Post } from '../../interfaces/user.interface';

interface IPostImagesProps {
  post: Post;
  imageHeight?: number;
}

export const PostImages = (props: IPostImagesProps) => {
  const { imageHeight } = props;
  return (
    <div>
      {/* How to handle posts w/out images?? */}
      <Carousel
        nextArrow={<RightCircleTwoTone twoToneColor="#ccc" />}
        prevArrow={<LeftCircleTwoTone twoToneColor="#ccc" />}
        arrows
        adaptiveHeight
        swipeToSlide
        touchMove
        dotPosition="top"
      >
        {props.post.image_url?.map((url, idx) => (
          <Row className="Post-image" justify="center" align="middle" key={idx}>
            <img
              style={{
                height: imageHeight ? `${imageHeight}px` : 'auto',
              }}
              alt={props.post.caption}
              src={url}
            />
          </Row>
        ))}
      </Carousel>
    </div>
  );
};
