import React from 'react';
import { Mentions } from 'antd';
import debounce from 'lodash/debounce';
import './mentions.style.css';
import reactStringReplace from 'react-string-replace';
import {
  API_BASE_URL_OPEN,
  SEARCH_TAGS_ENDPOINT,
  SEARCH_USER_ENDPOINT,
} from '../../service/api';
import { Link } from 'react-router-dom';

const { Option } = Mentions;

export const replaceAtMentionsWithLinks = (text: string) => {
  return text.replace(
    /@([a-z\d_]+)/gi,
    '<a  onclick="() => history.replace(`/ares`)" >@$1</a>'
  );
  // if (res.includes("@")) {
  //     return {
  //         f: true,
  //         r: res,
  //     }
  // }
  // return { f: false, r: res };
};
///@([a-z\d_]+)/gi
///[\\<>@#&!]/g
export const replaceAtMentionsWithLinks2 = (
  text: string,
  _replace?: string | string[] | null
) => {
  return (
    <span>
      {reactStringReplace(text, /@([a-z\d_-]+)/gi, (match, i) => (
        <Link
          style={{ color: 'rgba(var(--fe0,0,55,107),1)' }}
          key={i}
          to={`/${match}`}
        >
          @{match}
        </Link>
      ))}
    </span>
  );
};

/**
 * Find and highlight relevant keywords within a block of text
 * @param  label - The text to parse
 * @param  value - The search keyword to highlight
 * @return A JSX object containing an array of alternating strings and JSX
 */
export const formatLabel = (label: string, value: string) => {
  if (!value) {
    return label;
  }
  return (
    <span>
      {label.split(value).reduce((prev: any, current: any, i: any) => {
        if (!i) {
          return [current];
        }
        return prev.concat(
          <Link to={{}} key={value + current}>
            {'@jinxed'.match(/@\S+/g)?.map((str) => `${str}`)}
          </Link>,
          current
        );
      }, [])}
    </span>
  );
};

interface IMentionsProps {
  placeholder?: string;
  autoSize?: boolean;
  rows?: number;
  value?: string;
  onChange?: any;
  border?: string;
  hasRouting?: boolean;
  prefix?: string[];
}

interface IMentionsState {
  search: string;
  loading: boolean;
  users: any[];
}

class AsyncMention extends React.Component<IMentionsProps, IMentionsState> {
  constructor(props: IMentionsProps) {
    super(props);

    this.loadGithubUsers = debounce(this.loadGithubUsers, 800);

    this.state = {
      search: '',
      loading: false,
      users: [],
    };
  }

  onSearch = (search: string, prefix?: string) => {
    this.setState({ search, loading: !!search, users: [] });
    this.loadGithubUsers(search, prefix);
  };

  loadGithubUsers(key: string, prefix?: string) {
    if (!key) {
      this.setState({
        users: [],
      });
      return;
    }

    if (this.props.prefix) {
      if (prefix === '@') {
        return fetch(
          //   `http://localhost:5000/openpaarty/us-central1/api1/v1/users?username=${key}`
          `${API_BASE_URL_OPEN}${SEARCH_USER_ENDPOINT}?username=${key}`
        )
          .then((res) => res.json())
          .then(({ list = [] }) => {
            const { search } = this.state;
            if (search !== key) return;

            this.setState({
              users: list.slice(0, 10),
              loading: false,
            });
          });
      } else if (prefix === '#') {
        return fetch(`${API_BASE_URL_OPEN}${SEARCH_TAGS_ENDPOINT}?tag=${key}`)
          .then((res) => res.json())
          .then(({ list = [] }) => {
            const { search } = this.state;
            if (search !== key) return;

            this.setState({
              users: list.slice(0, 10),
              loading: false,
            });
          });
      }
    }

    fetch(
      //   `http://localhost:5000/openpaarty/us-central1/api1/v1/users?username=${key}`
      `${API_BASE_URL_OPEN}${SEARCH_USER_ENDPOINT}?username=${key}`
    )
      .then((res) => res.json())
      .then(({ list = [] }) => {
        const { search } = this.state;
        if (search !== key) return;

        this.setState({
          users: list.slice(0, 10),
          loading: false,
        });
      });
  }

  render() {
    const { users, loading } = this.state;

    return (
      <Mentions
        value={this.props.value && this.props.value}
        autoSize={this.props.autoSize}
        onChange={this.props.onChange && this.props.onChange}
        placeholder={this.props.placeholder && this.props.placeholder}
        style={{
          width: '100%',
          height: '100%',
          border: this.props.border ? this.props.border : undefined,
        }}
        loading={loading}
        onSearch={this.onSearch}
        prefix={this.props.prefix}
      >
        {users.map(({ username, image_url: avatar, type }) => (
          <Option
            className="antd-demo-dynamic-option"
            key={username}
            value={username}
          >
            {this.props.hasRouting ? (
              <Link to={type === 'tag' ? `/t/${username}` : `/${username}`}>
                <img src={avatar} alt={username} />
                <span>{username}</span>
              </Link>
            ) : (
              <>
                <img src={avatar} alt={username} />
                <span>{username}</span>
              </>
            )}
          </Option>
        ))}
      </Mentions>
    );
  }
}

export default AsyncMention;
