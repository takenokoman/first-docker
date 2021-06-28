import React from "react";
import axiosBase from "axios";
import { HashRouter as Router, Route, Redirect, Link, withRouter, } from "react-router-dom";
import socketIOClient from "socket.io-client";
import endpoint from "../config/port.config.js";
import Cookies from "universal-cookie";
import axiosConfig from "../config/axios.config.js";

import UserContext from "./contexts/userContext.js";

const env = process.env.NODE_ENV || 'development';

const cookies = new Cookies();
const axios = axiosBase.create(axiosConfig);


export default class Edit extends React.Component {
  constructor() {
    super();
    this.state = {text: "", edit: false};
    this.textChange = this.textChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    console.log(endpoint[env]);
    const userName = cookies.get('userName');
    const text = this.state.text;
    e.preventDefault();
    console.log(userName);
    const socket = socketIOClient(endpoint[env], {
      transport : ['websocket', 'polling', 'flashsocket'],
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
    const editData = {
      userName: userName,
      text: text
    };
    socket.emit("postEdit", editData);
    this.setState({edit: true});
    const tl = this.props.toggleEdit.bind(this);
    tl();
    return <Router><Redirect to='/' /></Router>;
  }
  textChange(e) {
    this.setState({text: e.target.value});
  }

  componentDidMount() {
    console.log("Editコンポーネントはマウントされましたログイン状態:" +
     cookies.get('login'));
  }
  componentWillUnmount() {
    const list1 = Object.keys(this.context);
    const list = list1.forEach((li) => {
      console.log(li);
    });
    console.log("Editコンポーネントはアンマウントされましたログイン状態:" + this.state.edit);

    return <Router><Redirect to='/' /></Router>;
  }
  render() {
    return (
      <div id="edit-wrap">
        <div id="edit-container">
          <button className="close-btn" onClick={this.props.toggleEdit}><span>×</span></button>
          <form onSubmit={this.handleSubmit}>
            <textarea id="post-text" name="postText" rows="7" cols="20"
              placeholder="あったことを書き込みましょう" value={this.state.text}
              onChange={this.textChange} maxLength="120"
              required="required" autoFocus></textarea>
            <button id="edit-post">投稿する</button>
          </form>
        </div>
      </div>
    );
  }
}
Edit.contextType = UserContext;
