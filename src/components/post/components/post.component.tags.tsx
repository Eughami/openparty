import React from 'react';
import { Post, PostTags as IPostTags } from '../../interfaces/user.interface';
import { Row, Tag, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { getPostTagColor } from '../post.actions';

interface IPostTagsProps {
  post: Post;
  showTooltip?: boolean;
  limitTags?: number;
  style?: React.CSSProperties;
}

export const PostTags = (props: IPostTagsProps) => {
  const { post, limitTags, showTooltip = true, style } = props;

  if (showTooltip) {
    if (limitTags) {
      return (
        <Row style={style ? { ...style } : { marginBottom: 10 }} align="middle">
          {post.tags && (
            <Tooltip title="Click to view posts with this tag">
              {post.tags &&
                post.tags
                  .slice(0, limitTags)
                  .map((tag: IPostTags, index: number) => (
                    <Tag
                      className="post_tags"
                      color={getPostTagColor(tag)}
                      key={index}
                    >
                      <Link
                        to={{
                          pathname: `/t/${tag}`,
                        }}
                      >
                        {tag}
                      </Link>{' '}
                    </Tag>
                  ))}
            </Tooltip>
          )}
        </Row>
      );
    } else {
      return (
        <Row style={{ marginBottom: 10 }} align="middle">
          {post.tags && (
            <Tooltip title="Click to view posts with this tag">
              {post.tags &&
                post.tags.map((tag: IPostTags, index: number) => (
                  <Tag
                    className="post_tags"
                    color={getPostTagColor(tag)}
                    key={index}
                  >
                    <Link
                      to={{
                        pathname: `/t/${tag}`,
                      }}
                    >
                      {tag}
                    </Link>{' '}
                  </Tag>
                ))}
            </Tooltip>
          )}
        </Row>
      );
    }
  } else {
    if (limitTags) {
      return (
        <Row
          style={{ marginBottom: 10 }}
          className="post__clikes__and__comments"
          align="middle"
        >
          {post.tags &&
            post.tags
              .slice(0, limitTags)
              .map((tag: IPostTags, index: number) => (
                <Tag color={getPostTagColor(tag)} key={index}>
                  <Link
                    to={{
                      pathname: `/t/${tag}`,
                    }}
                  >
                    {tag}
                  </Link>{' '}
                </Tag>
              ))}
        </Row>
      );
    } else {
      return (
        <Row
          style={{ marginBottom: 10 }}
          className="post__clikes__and__comments"
          align="middle"
        >
          {post.tags &&
            post.tags.map((tag: IPostTags, index: number) => (
              <Tag color={getPostTagColor(tag)} key={index}>
                <Link
                  to={{
                    pathname: `/t/${tag}`,
                  }}
                >
                  {tag}
                </Link>{' '}
              </Tag>
            ))}
        </Row>
      );
    }
  }
};
