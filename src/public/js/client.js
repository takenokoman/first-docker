import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import axiosBase from "axios";
import Cookies from "universal-cookie";

//jsx
import Header from "./Header.js";
import Posts from "./Posts.js";
import Mypage from "./Mypage.js";
import Nav from "./Nav.js";
import Edit from "./Edit.js";
import Login from "./Login.js";
import Register from "./Register.js";
import Complete from "./Complete.js";
import Options from "./Options.js";

//UserContexts
import UserContext from "./contexts/userContext.js";

const cookies = new Cookies();
const axios = axiosBase.create({
  baseURL: 'http://localhost:3000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  responseType: 'json'
});


class Layout extends React.Component {
  constructor() {
    super();
  }


  componentDidMount() {
    console.log("TOPページです");
  }
  render() {
    return (
      <div>
        <Router>
          <Header/>
          <div id="contents">
            <Route exact path="/" exact component={Posts} />
            <Route path="/mypage/" exact component={Mypage} />
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
