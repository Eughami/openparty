import React from 'react';
import { Mentions } from 'antd';
import debounce from 'lodash/debounce';
import './mentions.style.css';
import { API_BASE_URL_OPEN, SEARCH_USER_ENDPOINT } from '../../service/api';

const { Option } = Mentions;

interface IMentionsProps {
  placeholder?: string;
  autoSize?: boolean;
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
        autoSize={this.props.autoSize}
        onChange={this.props.onChange && this.props.onChange}
        placeholder={this.props.placeholder && this.props.placeholder}
        style={{ width: '100%' }}
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
