import React from "react";
import axiosBase from "axios";
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

export default class Options extends React.Component {
  constructor() {
    super();
    this.state = {imgFile: null, imgUrl: null, userIcon: null, userName: ""};
    this.uploadImg = this.uploadImg.bind(this);
    this.postImg = this.postImg.bind(this);
    this.logout = this.logout.bind(this);
    this.user = cookies.get('user');
  }
  componentDidMount() {
    console.log(cookies.get('userIcon'));
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
   console.log(imgUrl + "完了" + cookies.get('userName'));
   console.log(imgFile);
   console.log(this.state.imgFile);
  }

  postImg(e) {
    console.log("postImg" + cookies.get('userId'));
    e.preventDefault();
    const data = new FormData();
    const userId = cookies.get('userId');
    const imgFile = this.state.imgFile;
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    data.append('file', imgFile);
    data.append('id', userId);
    console.log(data.get('file'));
    if (!userId) {
      alert("ログインしてください");
      return false;
    }
    if (this.state.imgFile !== null) {
      axios
        .post('/api/img', data, header)
        .then((response) => {
          console.log(response.data.userIcon);
          cookies.set('userIcon', response.data.userIcon, { path: '/' , maxAge: 1000*60*30});
          alert("アイコンを変更しました");
          location.reload();
        })
        .catch((error) => {
          console.log(data);
          console.log('ERROR!! occurred in Backend.');
          alert('画像保存に失敗しました');
        });
    } else {
      alert("ファイルが選択されていません");
      return false;
    }
  }

  logout() {
    cookies.remove('login', { path: '/'});
    cookies.remove('userId', { path: '/'});
    cookies.remove('userName', { path: '/'});
    cookies.remove('userIcon', { path: '/'});
    console.log('現在のクッキーのご様子' + cookies.get('login'));
    console.log(cookies.getAll());
    location.reload();
  }

  render() {
    return (
      <div id="option-wrap">
        <section id="profile">
          <div className="user-icon">
            <img id="user-icon" src={
              cookies.get('userIcon') ?
                "../img/" + cookies.get('userIcon') :
                "../img/default-icon.svg"
            } />
          </div>
          <div>
            <p>
              {cookies.get('login') ? cookies.get('userName') : "ログインしてください"}
            </p>
          </div>
        </section>
        <section id="icon-option">
          <b>アイコンの変更</b>
          <br />
          <form onSubmit={this.postImg}>
            <div id="img-preview">
              <img src={this.state.imgUrl} />
            </div>
            <br />
            <label id="upload-label" className="color-btn">
              ファイルを選択
              <input id="upload-icon" type="file" name="userIcon"
                accept="image/jpeg, image/png" onChange={this.uploadImg} />
            </label>
            <input id="post-img" className="color-btn" type="submit" value="送信" />
          </form>
        </section>
        {(cookies.get('login'))?
          <section><button onClick={this.logout} className="color-btn">ログアウト</button></section>
        :
          null
        }
      </div>
    );
  }
}
Options.contextType = UserContext;
