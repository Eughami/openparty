export enum AgeRating {
  _18 = "18+",
  _21 = "21+",
  _16 = "16+",
  _12 = "12+",
}

export enum PostTags {
  BEACH_PARTY = "Beach party",
  DRUG_PARTY = "Drug party",
  COCAINE_PARTY = "Cocaine party",
}

export enum PostPrivacy {
  PUBLIC = "Public",
  PRIVATE = "Private",
  FOLLOWERS = "Followers",
}
export interface Comment {
  comment: string,
  likes: number,
  id: string,
  comments: Array<Comment>,
  timestamp: number,
  user: {
    username: string,
    image_url: string
    user_id: string,
  },
};

export interface PostTags_v2 {
  Tag: {
    name: string, accent: string, //accent = color
  }
}

export interface Post {
  uid: string, //ID of the user owning the post
  location?: Map<number, number> //Lat & Lng of the location of the post
  likes: Array<string>,
  age_rating?: AgeRating,
  image_url?: Array<string>,
  caption: string,
  comments?: Array<Comment>,
  users_showing_up?: number, //Indicating how many users would be showing up to this event,
  date_of_post?: number,
  date_of_event?: number,
  privacy: PostPrivacy,
  tags?: Array<PostTags>,
  user: {
    username: string,
    image_url: string
  },
  id: string,
};


export interface RegistrationObject {
  agreement?: boolean,
  confirm?: string,
  email: string,
  password: string,
  phone: string,
  prefix: string,
  username: string,
  uid: string,
  //initial user properties
  followers_count: number,
  following_count: number,
  image_url: string,
  posts_count: number,
  Posts: Array<string>,
  privacy: string,
  bio?: string,
} 