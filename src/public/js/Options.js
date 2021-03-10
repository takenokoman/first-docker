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

export default class Options extends React.Component {
  constructor() {
    super();
    this.state = {imgFile: null, imgUrl: null, userIcon: null, userName: ""};
    this.uploadImg = this.uploadImg.bind(this);
    this.postImg = this.postImg.bind(this);
  }
  componentDidMount() {
    console.log(this.context.userIcon);

      this.setState({userName: this.context.userName, userIcon: this.context.userIcon});
      console.log(this.state.userName + this.state.userIcon);
  }
  uploadImg(e){

   URL.revokeObjectURL(imgUrl);
   console.log("uploadImg");
   const imgFile = e.target.files[0];
   const imgUrl = URL.createObjectURL(imgFile);
   this.setState({
     imgFile: imgFile,
     imgUrl: imgUrl
   });
   console.log(imgUrl + "完了" + this.context.userId);
   console.log(imgFile);
   console.log(this.state.imgFile);
  }
  postImg(e) {
    console.log("postImg" + this.context.userId);
    e.preventDefault();
    const data = new FormData();
    const userId = this.context.userId;
    const imgFile = this.state.imgFile;
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    data.append('file', imgFile);
    data.append('id', userId);
    console.log(imgFile.name);
    console.log(data.get('file'));
    if (!userId) {
      alert("ログインしてください");
      return false;
    }
    if (this.state.imgFile !== null) {
      axios
        .post('/api/img', data, header)
        .then((response) => {
          alert("アイコンを変更しました")
        })
        .catch((error) => {
          console.log(data);
          console.log('ERROR!! occurred in Backend.');
          alert('画像保存に失敗しました');
        });
    } else {
      alert("ファイルが選択されていません");
    }
  }
  render() {
    return (
      <div id="option-wrap">
        <section id="profile">
          <div className="user-icon">
            <img id="user-icon" src={
              this.state.userIcon !== null ?
                "../img/" + this.state.userIcon
              :
                "../img/default-icon.svg"
            } />
          </div>
          <div><p>{this.context.isLogedIn ? this.state.userName : "ログインしてください"}</p></div>
        </section>
        <section id="icon-option">
          <b>アイコンの変更</b>
          <br />
          <form onSubmit={this.postImg}>
            <div id="img-preview">
              <img src={this.state.imgUrl} />
            </div>
            <br />
            <label id="upload-label">
              ファイルを選択
              <input id="upload-icon" type="file" name="userIcon" accept="image/jpeg, image/png" onChange={this.uploadImg} />
            </label>
            <input id="post-img" type="submit" value="送信" />
          </form>
        </section>
      </div>
    );
  }
}
Options.contextType = UserContext;
