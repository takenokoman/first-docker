import React from "react";
import axiosBase from "axios";
import { BrowserRouter as Router, Route, Redirect, Link, withRouter, } from "react-router-dom";

const axios = axiosBase.create({
  baseURL: 'http://localhost:3000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  responseType: 'json'
});

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {userName: '', password: '', register: false};

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
    const name = this.state.userName;
    const pass = this.state.password;
    e.preventDefault();
    axios
      .post('/api/register', {
        name: name,
        pass: pass
      })
      .then((res) => {
        alert('登録したユーザー名: ' + res.data.name);
        console.log(res.data.name + "さん");
      })
      .then((res) => {
        this.setState({register: true});
        const tl = this.props.toggleRegister.bind(this);
        tl();
      })
      .catch((error) => {
        alert('登録に失敗しました');
        console.log('ERROR!! occurred in Backend.');
      });
    this.setState({userName: '', password: ''});
  }
  componentDidMount() {
    console.log("Registerコンポーネントはマウントされましたログイン状態:" + this.state.register);
  }
  componentWillUnmount() {
    console.log("Registerコンポーネントはアンマウントされましたログイン状態:" + this.state.register);

    return <Router><Redirect to='/' /></Router>;
  }

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <button className="close-btn" onClick={this.props.toggleRegister.bind(this)}><span>×</span></button>
          <form id="form" onSubmit={this.handleSubmit}>
            <h2>新規登録</h2>
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
