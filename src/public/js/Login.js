import React from "react";
import { HashRouter as Router, Route, Redirect, Link, withRouter, } from "react-router-dom";
import axiosBase from "axios";
import Cookies from "universal-cookie";
//UserContexts
import UserContext from "./contexts/userContext.js";


const cookies = new Cookies();
//axiosの設定
import axiosConfig from "../config/axios.config.js";
import axiosBlobConfig from "../config/axiosBlob.config.js";
const axios = axiosBase.create(axiosConfig);
const axiosBlob = axiosBase.create(axiosBlobConfig);

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', password: '', login: false, showLogin: this.props.showLogin};

    this.userNameChange = this.userNameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.toArrayBuffer = this.toArrayBuffer.bind(this);
    this.getIcon = this.getIcon.bind(this);
  }

  userNameChange(e) {
    this.setState({userName: e.target.value});
  }

  passwordChange(e) {
    this.setState({password: e.target.value});
  }
  toArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return ab;
  }
  handleLogin(userName, userId, userIcon) {
    console.log('handle login' + userIcon);

    cookies.set('userId', userId, { path: '/' , maxAge: 60*30});
    cookies.set('userName', userName, { path: '/' , maxAge: 60*30});
    cookies.set('userIcon', userIcon, { path: '/' , maxAge: 60*30});
    cookies.set('login', true, { path: '/' , maxAge: 1800});

    console.log("handleLoginです" + userName + "さん。ログイン状態は" + cookies.get('login'));
    const toString = Object.prototype.toString;
    console.log(toString.call(userIcon));
    // console.log(toString.call(imgUrl(blob)));
    console.log(toString.call(cookies.get('userIcon')));
    console.log(cookies.get('userIcon'));
    location.reload();
  }
  getIcon(userId) {
    console.log("id" + userId);
    return new Promise((resolve, reject) => {
      axiosBlob
        .post('/api/icon', {
          userId: userId
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: 'image/jpeg' });
          console.log("blob data" + res.data);
          console.log(JSON.stringify(res.data));
          console.log(new Uint8Array(res.data));
          console.log(new Uint8Array(res.data));
          const iconUrl = URL.createObjectURL(blob);
          console.log("created URL" + iconUrl);
          const toString = Object.prototype.toString;
          console.log(res.headers);
          console.log(res.config);
          console.log(toString.call(res));
          console.log(toString.call(iconUrl));
          resolve(iconUrl);
        })
        .catch((err) => {
          alert('アイコン取得に失敗しました');
          console.log('ERROR!! occurred in Backend.');
          console.log(err);
        });
    })
  }
  handleSubmit(e) {
    console.log('handle');
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
          this.getIcon(res.data.userId)
            .then((value) => {
                console.log(res.data.userName + "さんがログインしました。ログイン状態:"
                  + this.state.login + res.data.userId);
                console.log(value);
                this.handleLogin(res.data.userName, res.data.userId, value);
                const tl = this.props.toggleLogin;
                tl();
            });
        } else {
          alert(res.data.msg);
        }
      })
      .catch((error) => {-
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
