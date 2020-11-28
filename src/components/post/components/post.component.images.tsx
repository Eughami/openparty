import React from "react";
import { Carousel } from "antd";
import { Post } from "../../interfaces/user.interface";

interface IPostImagesProps {
  post: Post;
  imageHeight?: number;
}

export const PostImages = (props: IPostImagesProps) => {
  const { imageHeight } = props;
  return (
    <div className="Post-image">
      <div className="Post-image-bg">
        {/* How to handle posts w/out images?? */}
        <Carousel adaptiveHeight swipeToSlide touchMove dotPosition="top">
          {props.post.image_url?.map((url, idx) => (
            <div key={idx}>
              <img
                alt={props.post.caption}
                src={url}
                height={`${imageHeight} ? ${imageHeight}px : auto`}
                width="auto"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};
