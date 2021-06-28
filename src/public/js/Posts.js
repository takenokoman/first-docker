import React from "react";
import axiosBase from "axios";
import socketIOClient from "socket.io-client";
import endpoint from "../config/port.config.js";
import Cookies from "universal-cookie";
import { animateScroll as scroll } from "react-scroll";
import { moment as momentTZ } from "moment-timezone";
import moment from "moment";

//UserContexts
import UserContext from "./contexts/userContext.js";

const env = process.env.NODE_ENV || 'development';
const socket = socketIOClient(endpoint[env], {
  transport : ['websocket', 'polling', 'flashsocket'],
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

const cookies = new Cookies();
import axiosConfig from "../config/axios.config.js";
import axiosBlobConfig from "../config/axiosBlob.config.js";
const axios = axiosBase.create(axiosConfig);
const axiosBlob = axiosBase.create(axiosBlobConfig);

export default class Posts extends React.Component {
  constructor() {
    super();
    this.state = {posts: [], comments: [], reply: ""};
    this.replyChange = this.replyChange.bind(this);
    this.postReply = this.postReply.bind(this);
    this.postsTime = this.postsTime.bind(this);
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
        console.log(this.state.comments)
      })
      .catch((error) => {
        alert('取得に失敗しました');
        console.log('ERROR!! occurred in Backend.');
      });
    socket.on("memberPost", data => {
      const post = [data];
      this.setState({
        posts: post.concat(this.state.posts)
      });
    });
    socket.on("showLikes", data => {
      // console.log("ソケット来てます" + data + postId);
      const posts = [...this.state.posts];
      posts[data.num].likes = data.likes;
      this.setState({
        posts: posts
      });
    });
    socket.on("memberReply", data => {
      console.log("リプライ");
      const comments = [data];
      this.setState({
        comments: comments.concat(this.state.comments)
      })
      console.log(this.state.comments);
    });
  }
  postLikes(postId, userId, num) {
    console.log("username" + cookies.get('userId') + "num" + num + "postId" + postId);
    if (userId) {
      const data = {
        postId: postId,
        userId: userId,
        num: num
      };
      socket.emit("postLikes", data);
    } else {
      alert("ログインしてください");
      return false;
    }
  }
  getComment(postId) {
    const comments = this.state.comments.find((comment) => {
      return comment.post_id = postId;
    });
  }
  showComment(postId) {
    const li = "comments" + postId;
    const c = document.getElementsByClassName(li);
    const nc = document.querySelectorAll(`:not(.comments${postId})`);
    if (c.length == 0) {return;}
    if (c[0].classList.contains('slidein')) {
      console.log("toggle");
        c[0].classList.remove('slidein');
      for (let i = 0;i < c.length;i++) {
      }
    } else {
      console.log("toggle2");
      nc.forEach(n => {
        n.classList.remove('slidein');
      });
      const postList = "posts" + postId;
      const postClass = document.getElementsByClassName(postList);
      const position = postClass[0].getBoundingClientRect();
      const y = position.top + window.pageYOffset - 100;
      scroll.scrollTo(y);
      c[0].classList.add('slidein');
    }
  }
  replyChange(e) {
    this.setState({reply: e.target.value});
  }
  postReply(e) {
    e.preventDefault();
    const postId = e.target.dataset.postid;
    const userId = e.target.dataset.userid;
    console.log("postReply");
    const data = {
      article: this.state.reply,
      postId: postId,
      userId: userId
    };
    if (userId) {
      socket.emit('postReply', data);
    } else {
      alert("ログインしてください");
      return false;
    }
    this.setState({
      reply: ""
    })
  }
  postsTime(postId, createdAt) {
    let date = moment(createdAt);
    date.locale('ja');
    date.tz('Asia/Tokyo');
    return date.fromNow();
  }
  render() {
    return (
      <div id="posts-container">
        <ul id="posts-ul">
          {this.state.posts.map((post, index) => {
            const li = "comments comments" + post.id;
            const postList = "posts posts" + post.id;
            return <li key={post.id} className={postList}>
              <div id="post">
                <div className="user-icon">
                  <img src={
                    post.user_icon !== null ?
                      "../img/" + post.user_icon
                      :
                      "../img/default-icon.svg"
                  } />
                </div>
                <div className="post-article">
                  <p className="user-name">{post.user_name} . <span className="posts-time">{this.postsTime(post.id, post.created_at)}</span></p>
                  <p>{post.article}</p>
                  <div className="posts-params">
                    <button className="param" onClick={() => this.postLikes(post.id, cookies.get('userId'), index)}>
                      <i className="far fa-heart"></i>
                    </button>
                    <span>{post.likes}</span>
                  </div>
                  <div className="posts-params">
                    <button id={post.id} className="param" onClick={() => this.showComment(post.id)}>
                      <i className="far fa-comment-dots"></i>
                    </button>
                    <span>{this.state.comments.filter((comment) => {
                      return comment.post_id == post.id;
                    }).length}</span>
                  </div>
                </div>
              </div>
              <div className={li}>
                <form className="reply" onSubmit={this.postReply}
                  data-postid={post.id} data-userid={cookies.get('userId')}>
                  <div className="reply-form">
                    <textarea placeholder="Reply..." onChange={this.replyChange} value={this.state.reply} required="required" rows="3" cols="40"></textarea>
                  </div>
                  <button type="submit">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
                <ul>{this.state.comments.filter((comment) => {
                  return comment.post_id == post.id;
                }).map((comment) => {
                  return <li key={comment.id}>
                    <div id="comment">
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
                })}</ul>
              </div>
            </li>;
          })}
        </ul>
      </div>
    );
  }
}
Posts.contextType = UserContext;
