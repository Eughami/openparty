export enum AgeRating {
  "18+",
  "21+",
  "16+",
  "12+",
}

export enum PostTags {
  "Beach party",
  "Drug party",
}

export enum PostPrivacy {
  "Public",
  "Private",
  "Followers",
}
export interface Comment {
  user_id: string,
  comment: string,
  likes: number,
  id: string,
  comments: Array<Comment>
};

export interface Post {
  user_id: string, //ID of the user owning the post
  location?: Map<number, number> //Lat & Lng of the location of the post
  likes: number,
  age_rating?: AgeRating,
  image_url?: string,
  caption: string,
  comments?: Array<Comment>,
  users_showing_up?: number, //Indicating how many users would be showing up to this event,
  date_of_post?: Date,
  date_of_event?: Date,
  privacy: PostPrivacy,
  user: {
    username: string,
    image_url: string
  }
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
} 