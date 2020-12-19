import React from 'react';
import { Mentions } from 'antd';
import debounce from 'lodash/debounce';
import './mentions.style.css';
import reactStringReplace from 'react-string-replace';
import { API_BASE_URL_OPEN, SEARCH_USER_ENDPOINT } from '../../service/api';
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

export const replaceAtMentionsWithLinks2 = (
  text: string,
  _replace?: string | string[] | null
) => {
  return (
    <span>
      {reactStringReplace(text, /@([a-z\d_]+)/gi, (match, i) => (
        <Link key={i} to={`/${match}`}>
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

  onSearch = (search: string) => {
    this.setState({ search, loading: !!search, users: [] });
    console.log('Search:', search);
    this.loadGithubUsers(search);
  };

  loadGithubUsers(key: string) {
    if (!key) {
      this.setState({
        users: [],
      });
      return;
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
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading={loading}
        onSearch={this.onSearch}
      >
        {users.map(({ username, image_url: avatar }) => (
          <Option
            className="antd-demo-dynamic-option"
            key={username}
            value={username}
          >
            <img src={avatar} alt={username} />
            <span>{username}</span>
          </Option>
        ))}
      </Mentions>
    );
  }
}

export default AsyncMention;
