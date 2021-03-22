import React from "react";
import { BrowserRouter as Router, Route, Redirect, Link, withRouter, } from "react-router-dom";
import axiosBase from "axios";
import Cookies from "universal-cookie";
//UserContexts
import UserContext from "./contexts/userContext.js";


const cookies = new Cookies();
//axiosの設定
const axios = axiosBase.create({
  baseURL: 'http://localhost:3000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  responseType: 'json'
});



export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', password: '', login: false, showLogin: this.props.showLogin};

    this.userNameChange = this.userNameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  userNameChange(e) {
    this.setState({userName: e.target.value});
  }

  passwordChange(e) {
    this.setState({password: e.target.value});
  }
  handleLogin(userName, userId, userIcon) {
    console.log("handleLoginまではきました" + userName + userId);
    console.log(2 + cookies.get('userId'));
    cookies.set('userId', userId, { path: '/' , maxAge: 60*30});
    cookies.set('userName', userName, { path: '/' , maxAge: 60*30});
    cookies.set('userIcon', userIcon, { path: '/' , maxAge: 60*30});
    cookies.set('login', true, { path: '/' , maxAge: 1800})
    console.log("handleLoginです" + userName + "さん。ログイン状態は" + cookies.get('login'));
    const toString = Object.prototype.toString;
    console.log(toString.call(userIcon));
    console.log(toString.call(cookies.get('userIcon')));
    location.reload();
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
            console.log(res.data.userIcon);
          this.handleLogin(res.data.userName, res.data.userId, res.data.userIcon);
          const tl = this.props.toggleLogin;
          tl();
        } else {
          alert(res.data.msg);
        }
      })
      .catch((error) => {
        alert('ログインに失敗しました');
        console.log('ERROR!! occurred in Backend.');
        console.log(error);
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
