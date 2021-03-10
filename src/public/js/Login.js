import React from "react";
import { BrowserRouter as Router, Route, Redirect, Link, withRouter, } from "react-router-dom";
import axiosBase from "axios";

//UserContexts
import UserContext from "./contexts/userContext.js";

//axiosの設定
const axios = axiosBase.create({
  baseURL: 'http://localhost:3000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
});



export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', password: '', login: false, showLogin: this.props.showLogin};

    this.userNameChange = this.userNameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  userNameChange(e) {
    this.setState({userName: e.target.value});
  }

  passwordChange(e) {
    this.setState({password: e.target.value});
  }


  handleSubmit(e) {
    e.preventDefault();
    const userName = this.state.userName;
    const pass = this.state.password;
    axios
      .post('/api/login', {
        userName: userName,
        pass: pass
      })
      .then((res) => {
        if (res.data.login) {
          console.log(res.data.userName + "さんがログインしました。ログイン状態:"
            + this.state.login+ res.data.userId);
          this.props.handleLogin(res.data.userName, res.data.userId, res.data.userIcon);
          this.setState({login: true});
          const tl = this.props.toggleLogin;
          tl();
        } else {
          alert(res.data.msg);
        }
      })
      .catch((error) => {
        alert('ログインに失敗しました');
        console.log('ERROR!! occurred in Backend.');
      });
    this.setState({password: ''});
    console.log('...');
  }
  componentDidMount() {
    console.log("Loginコンポーネントはマウントされましたログイン状態:" + this.state.login);
  }
  componentWillUnmount() {
    console.log("Loginコンポーネントはアンマウントされましたログイン状態:" + this.state.login);


  }
  render() {
    return (
      <div className="wrap">
        <div className="container">
          <button className="close-btn" onClick={this.props.toggleLogin}><span>×</span></button>
          <form id="form" onSubmit={this.handleSubmit}>
            <h2>ログイン</h2>
            <div id="input">
              <input id="userName" type="text"
                name="user_name" placeholder="ユーザーネーム"
                required="required" value={this.state.userName}
                onChange={this.userNameChange} autoFocus />
              <input id="pass" type="password"
                name="pass" placeholder="パスワード"
                required="required" value={this.state.password}
                onChange={this.passwordChange} />
            </div>
            <input id="submit-btn" type="submit" value="送信" />
          </form>
        </div>
      </div>
    );
  }
}
