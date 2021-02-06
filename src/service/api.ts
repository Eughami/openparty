export const API_BASE_URL =
  'http://localhost:5000/openpaarty/us-central1/api/v1/';
export const API_BASE_URL_OPEN =
  'http://localhost:5000/openpaarty/us-central1/api1/v1/';
// export const API_BASE_URL =
//   'https://us-central1-openpaarty.cloudfunctions.net/api/v1/';
// export const API_BASE_URL_OPEN =
//   'https://us-central1-openpaarty.cloudfunctions.net/api1/v1/';

//post ping
export const PING_ENDPOINT = 'ping';

export const SEARCH_USER_ENDPOINT = 'users';

export const SEARCH_TAGS_ENDPOINT = 'tags';

//post /users
export const REGISTRATION_ENDPOINT = 'users';
//post alien-auth
export const ALIEN_AUTH_ENDPOINT = 'users/alien-auth';

//patch /users/
export const EDIT_ACCOUNT_INFO_ENDPOINT = 'users';

export const ADD_POST_ENDPOINT = 'posts';

export const DELETE_POST_ENDPOINT = 'posts/:postId';

export const EDIT_POST_ENDPOINT = 'posts/:postId';

export const EXPLORE_POSTS_ENDPOINT = 'posts/explore';

export const ADD_COMMENT_ENDPOINT = 'posts/add-comment';

export const PROBE_IMAGE_ENDPOINT = 'posts/probe-image';

export const LIKE_COMMENT_ENDPOINT = 'posts/like-comment';

export const EDIT_COMMENT_ENDPOINT = 'posts/edit-comment';

export const LIKE_POST_ENDPOINT = 'posts/like-post';

export const UNLIKE_POST_ENDPOINT = 'posts/unlike-post';

export const UNLIKE_COMMENT_ENDPOINT = 'posts/unlike-comment';

export const DELETE_COMMENT_ENDPOINT = 'posts/delete-comment';

export const GET_USER_ELIGIBLE_POST_ENDPOINT = 'posts/users-eligible-post';

export const CHECK_POST_STATUS_ENDPOINT = 'posts/check-post-status';

export const GET_PUBLIC_POSTS_ENDPOINT = 'posts/get-public-posts';

export const GET_POST_TAGS_ENDPOINT = 'posts/tags-post';

export const CHANGE_USERNAME_ENDPOINT = 'users/change-username';

export const USERNAME_AVAILABLE_ENDPOINT = 'users/username-available';

export const CAN_USER_VIEW_PROFILE_ENDPOINT = 'users/can-view-user-profile';

export const APPROVE_FOLLOW_ENDPOINT = 'users/approve-follow';

export const IGNORE_FOLLOW_ENDPOINT = 'users/ignore-follow';

export const SEND_FOLLOW_REQUEST_ENDPOINT = 'users/send-follow-request';

export const UNFOLOW_REQUEST_ENDPOINT = 'users/unfollow-user';

export const CANCEL_FOLLOW_REQUEST_ENDPOINT = 'users/cancel-follow-request';

export const GET_ONE_POST = 'posts/post';

export const POST_ROOT = 'posts';

export const GET_MORE_POSTS_FROM_USER = 'posts/more-posts';

export const GET_USER_PROFILE_SNIPPET = 'users/:/username/snippet';

export const GET_POPULAR_TAGS = 'posts/popular/tags';

export const GET_POPULAR_USERS = 'users/recommended/get-popular';

export const GET_USER_FOLLOWINGS = 'users/account/:username/following';

export const GET_USER_FOLLOWERS = 'users/account/:username/followers';

export const INIT_CHAT = 'users/chat/init';

export const GET_UNAUTH_POST = 'p';

export const PROBE_IMAGE_OPEN_ENDPOINT = 'probe-image';

// export const _ENDPOINT = ""
