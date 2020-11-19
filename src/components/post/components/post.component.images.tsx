import React from 'react'
import { Carousel } from 'antd'
import { Post } from '../../interfaces/user.interface';

interface IPostImagesProps {
    post: Post
}

export const PostImages = (props: IPostImagesProps) => {

    return (
        <div className="Post-image">
            <div className="Post-image-bg">
                {/* How to handle posts w/out images?? */}
                <Carousel adaptiveHeight swipeToSlide touchMove dotPosition="top">
                    {props.post.image_url?.map((url, idx) => (
                        <div key={idx}>
                            <img alt={props.post.caption} src={url} />
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
