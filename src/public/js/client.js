import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import axiosBase from "axios";

//jsx
import Header from "./Header.js";
import Posts from "./Posts.js";
import MyPosts from "./MyPosts.js";
import Nav from "./Nav.js";
import Edit from "./Edit.js";
import Login from "./Login.js";
import Register from "./Register.js";
import Complete from "./Complete.js";
import Options from "./Options.js";

//UserContexts
import UserContext from "./contexts/userContext.js";

const axios = axiosBase.create({
  baseURL: 'http://localhost:3000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
});


class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      isLogedIn: false,
      userId: 0
    };
  }
  handleLogin(userName, userId, userIcon) {
    console.log("handleLoginまではきました");
    this.setState({
      userName: userName,
      isLogedIn: true,
      userId: userId,
      userIcon: userIcon
    });
    this.context.userName = this.state.userName;
    this.context.userId = this.state.userId;
    this.context.userIcon = this.state.userIcon;
    this.context.isLogedIn = this.state.isLogedIn;
    console.log("handleLoginです" + userName + "さん。ログイン状態は" + this.state.isLogedIn);
    console.log(this.context.userIcon);
  }
  componentDidMount() {
    console.log("TOPページですが");
  }
  render() {
    return (
      <div>
        <Router>
          <UserContext.Provider value={{userName: this.state.userName, isLogedIn: this.state.isLogedIn, userId: this.state.userId,userIcon: this.state.userIcon, handleLogin: this.handleLogin.bind(this)}}>
            <Header/>
          </UserContext.Provider>
          <div id="contents">
            <Route exact path="/" exact component={Posts} />
            <Route path="/mypage/" exact component={MyPosts} />
            <Route path="/options/" exact component={Options} />
            <Route path="/login/" exact component={Login} />
            <Route path="/register/" exact component={Register} />
            <Route path="/complete/" exact component={Complete} />
            <Route path="/edit/" exact component={Edit} />
          </div>
        </Router>
      </div>
    );
  }
}
Layout.contextType = UserContext;
console.log("呼ばれてはいるよ！");
const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);
