import React from "react";
import axiosBase from "axios";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
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
export default class Posts extends React.Component {
  constructor() {
    super();
    this.state = {posts: []};
  }
  getEdit() {

  }
  componentDidMount() {
    console.log("トップページです");
    axios
      .get('/api/edit')
      .then((res) => {
        const list = [...res.data.posts];
        this.setState({posts: list});
        console.log(res.data.msg + "ぎだ!" + res.data.posts.length + "個も!" + res.data.posts[0].article);
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
    console.log("よんでねえ" + this.context.userId + "num" + num + "postId" + postId);
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

    // axios
    //   .post('/api/likes', {
    //     postId: postId,
    //     userId: userId
    //   })
    //   .then((res) => {
    //
    //   })
    //   .catch((error) => {
    //     alert('取得に失敗しました');
    //     console.log('ERROR!! occurred in Backend.');
    //   });
  }
  render() {
    return (
      <div id="sc-container">
        <ul id="sc-ul">
          {this.state.posts.map((post, index) => {
            return <li className="sc-li" key={post.id}>
              <div>
                <img className="user-icon" src="../img/default-icon.svg" />
              </div>
              <div>
                <p className="user-name">{post.user_name}</p>
                <p>{post.article}</p>
                <button className="likes" onClick={() => this.postLikes(post.id, this.context.userId, index)}>
                  <i className="far fa-heart"></i>
                </button>
                <span>{post.likes}</span>
              </div>
            </li>;
          })}
        </ul>
      </div>
    );
  }
}
Posts.contextType = UserContext;
  // {
  //   if () {
  //     <i className="fas fa-heart"></i>
  //   } else {
  //     <i className="far fa-heart"></i>
  //   }
  // }
