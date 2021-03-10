import React from "react";
import axiosBase from "axios";
import { BrowserRouter as Router, Route, Redirect, Link, withRouter, } from "react-router-dom";

import UserContext from "./contexts/userContext.js";

const axios = axiosBase.create({
  baseURL: 'http://localhost:3000', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
});


export default class Edit extends React.Component {
  constructor() {
    super();
    this.state = {text: "", edit: false};
    this.textChange = this.textChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    const userName = this.context.userName;
    const text = this.state.text;
    e.preventDefault();
    console.log(userName);
    axios
      .post('/api/edit', {
        userName: userName,
        text: text
      })
      .then((res) => {

      })
      .then((res) => {
        this.setState({edit: true});
        const tl = this.props.toggleEdit.bind(this);
        tl();
      })
      .catch((error) => {
        console.log('ERROR!! occurred in Backend.');
      });
    this.setState({text: ""});
  }
  textChange(e) {
    this.setState({text: e.target.value});
  }

  componentDidMount() {
    console.log("Editコンポーネントはマウントされましたログイン状態:" +
     this.state.edit + this.context.userName + this.context.isLogedIn);
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
