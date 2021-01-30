export interface ValidatorResponse {
  error?: { message: string; example?: any };
  status: number;
  success: boolean;
}

enum AgeRating {
  _18 = '18+',
  _21 = '21+',
  _16 = '16+',
  _12 = '12+',
}

enum PostTags {
  BEACH_PARTY = 'Beach party',
  DRUG_PARTY = 'Drug party',
  COCAINE_PARTY = 'Cocaine party',
}

enum PostPrivacy {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
  FOLLOWERS = 'Followers',
}
interface Comment {
  comment: string;
  likes: number;
  id: string;
  comments?: Array<Comment>;
  timestamp: number;
  user: {
    username: string;
    image_url: string;
    user_id: string;
  };
}

interface PostTags_v2 {
  Tag: {
    name: string;
    accent: string; //accent = color
  };
}

interface Post {
  uid: string; //ID of the user owning the post
  location?: Map<number, number>; //Lat & Lng of the location of the post
  likes: number;
  age_rating?: AgeRating;
  image_url?: string;
  caption: string;
  comments?: Array<Comment>;
  users_showing_up?: number; //Indicating how many users would be showing up to this event,
  date_of_post?: number;
  date_of_event?: number | null;
  privacy: PostPrivacy;
  tags?: Array<PostTags>;
  user: {
    username: string;
    image_url: string;
  };
  id: string;
}

interface RegistrationObject {
  agreement?: boolean;
  confirm?: string;
  email: string;
  password?: string;
  phone: string;
  prefix: string;
  username: string;
  uid?: string;
  //initial user properties
  followers_count?: number;
  following_count?: number;
  image_url?: string;
  posts_count?: number;
  Posts?: Array<string>;
}

/**
 * Request body format to use during requests
 */

interface RegistrationRequest {
  /**
   * Registration email
   */
  email: string;
  username: string;
  phone: string;
  prefix: string;
  password: string;
  auth: string;
}

interface AddPostRequest {
  caption: string;
  image_url: string;
  privacy: PostPrivacy;
  tags: Array<PostTags>;
  uid: string;
  user: {
    username: string;
    image_url: string;
  };
  date_of_event?: number;
}

interface LikePostRequest {
  id: string;
  uid: string;
}

interface LikeCommentRequest {
  id: string;
  uid: string;
  postId: string;
}

interface UnLikePostRequest {
  id: string;
  uid: string;
}

interface UnLikeCommentRequest {
  id: string;
  uid: string;
  postId: string;
}

interface UsernameAvailableRequest {
  /**
   * Requesting username
   */
  username: string;
  uid: string;
  open?: string | boolean | number;
}

interface ChangeUsernameRequest {
  /**
   * Requesting username
   */
  username: string;
  uid: string;
}

interface AddCommentRequest {
  postId: string;
  user: {
    username: string;
    image_url: string;
    user_id: string;
  };
  comment: string;
}

export interface DeleteCommentRequest {
  postId: string;
  commentId: string;
}
