import React from "react";
import axiosBase from "axios";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
import Cookies from "universal-cookie";
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
export default class Posts extends React.Component {
  constructor() {
    super();
    this.state = {posts: [], comments: []};
  }
  getEdit() {

  }
  componentDidMount() {
    console.log("トップページです");
    axios
      .get('/api/edit')
      .then((res) => {
        const list = [...res.data.posts];
        const comments = [...res.data.comments]
        this.setState({posts: list, comments: comments});
        console.log(res.data.msg + res.data.posts.length + "個" + res.data.posts[0].article);
      })
      .catch((error) => {
        alert('取得に失敗しました');
        console.log('ERROR!! occurred in Backend.');
      });
    const socket = socketIOClient(ENDPOINT);
    socket.on("memberPost", data => {
      const post = [data]
      this.setState({
        posts: post.concat(this.state.posts)
      });
    });
    socket.on("showLikes", (data) => {
      // console.log("ソケット来てます" + data + postId);
      const posts = [...this.state.posts];
      posts[data.num].likes = data.likes;
      this.setState({
        posts: posts
      });
    });
  }
  postLikes(postId, userId, num) {
    console.log("よんでねえ" + cookies.get('userId') + "num" + num + "postId" + postId);
    if (userId) {
      const socket = socketIOClient(ENDPOINT);
      const data = {
        postId: postId,
        userId: userId,
        num: num
      };
      socket.emit("postLikes", data);
    } else {
      alert("ログインはせぇ");
    }
  }

  showComment() {

  }
  render() {
    return (
      <div id="posts-container">
        <ul id="posts-ul">
          {this.state.posts.map((post, index) => {
            return <li key={post.id}>
              <div id="post">
                <div className="user-icon">
                  <img src={
                    post.user_icon !== null ?
                      "../img/" + post.user_icon
                      :
                      "../img/default-icon.svg"
                  } />
                </div>
                <div>
                  <p className="user-name">{post.user_name}</p>
                  <p>{post.article}</p>
                  <div className="posts-params">
                    <button className="param" onClick={() => this.postLikes(post.id, cookies.get('userId'), index)}>
                      <i className="far fa-heart"></i>
                    </button>
                    <span>{post.likes}</span>
                  </div>
                  <div className="posts-params">
                    <button id={post.id} className="param" onClick={() => this.showComment()}>
                      <i className="far fa-comment-dots"></i>
                    </button>
                    <span>10</span>
                  </div>
                </div>
              </div>
              <div id="comments">
                <ul>{() => {
                  let comments;
                  comments = this.state.comments.find((comment) => {
                    return comment.post_id = post.id;
                  });
                  comments.map((comment) => {
                    return <li key={comment.id}>
                      <div id="post">
                        <div className="user-icon">
                          <img src={
                            comment.user_icon !== null ?
                              "../img/" + comment.user_icon
                              :
                              "../img/default-icon.svg"
                          } />
                        </div>
                        <div>
                          <p className="user-name">{comment.user_name}</p>
                          <p>{comment.article}</p>
                        </div>
                      </div>
                    </li>
                  });
                }}</ul>
              </div>
            </li>;
          })}
        </ul>
      </div>
    );
  }
}
Posts.contextType = UserContext;
