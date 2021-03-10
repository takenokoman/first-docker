import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import axiosBase from "axios";

//jsx
import Header from "./Header.js";
import ShopCard from "./ShopCard.js";
import Vote from "./Vote.js";
import Nav from "./Nav.js";
import Edit from "./Edit.js";
import Login from "./Login.js";
import Register from "./Register.js";
import Complete from "./Complete.js";

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
  handleLogin(userName, userId) {
    console.log("handleLoginまではきました");
    this.setState({
      userName: userName,
      isLogedIn: true,
      userId: userId
    });
    console.log("handleLoginです" + userName + "さん。ログイン状態は" + this.state.isLogedIn);
  }
  componentDidMount() {
    console.log("TOPページですが");
  }
  render() {
    return (
      <div>
        <Router>
          <UserContext.Provider value={{userName: this.state.userName, isLogedIn: this.state.isLogedIn, userId: this.state.userId, handleLogin: this.handleLogin.bind(this)}}>
            <Header/>
          </UserContext.Provider>
          <div id="contents">
            <Route exact path="/" exact component={ShopCard} />
            <Route path="/order/" exact component={Vote} />
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
ShopCard.contextType = UserContext;
console.log("呼ばれてはいるよ！");
const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);
