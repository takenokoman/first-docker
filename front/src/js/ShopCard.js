import React from "react";
import axiosBase from "axios";

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
export default class ShopCard extends React.Component {
  constructor() {
    super();
    this.state = {posts: []};
  }
  componentDidMount() {
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
  }
  postLikes(postId, userId) {
    console.log("よんでねえ" + this.context.userId);
    axios
      .post('/api/likes', {
        postId: postId,
        userId: userId
      })
      .then((res) => {

      })
      .catch((error) => {
        alert('取得に失敗しました');
        console.log('ERROR!! occurred in Backend.');
      });
  }
  render() {
    return (
      <div id="sc-container">
        <ul id="sc-ul">
          {this.state.posts.map((post) => {
            return <li className="sc-li" key={post.id}>
              <div>
                <img className="user-icon" src="../img/default-icon.svg" />
              </div>
              <div>
                <p className="user-name">{post.user_name}</p>
                <p>{post.article}</p>
                <button className="likes" onClick={() => this.postLikes(post.id, this.context.userId)}>
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
ShopCard.contextType = UserContext;
  // {
  //   if () {
  //     <i className="fas fa-heart"></i>
  //   } else {
  //     <i className="far fa-heart"></i>
  //   }
  // }
