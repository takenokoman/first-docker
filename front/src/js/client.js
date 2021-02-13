import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
//import { hot } from 'react-hot-loader'//いずれreactFastRefleshに置き換わる
import Header from "./Header.js";
import ShopCard from "./ShopCard.js";
import Vote from "./Vote.js";
import Nav from "./Nav.js";
import Edit from "./Edit.js";
import Login from "./Login.js";
import Register from "./Register.js";

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {name: 0};
  }
  render() {
    return (
      <div>
        <Router>
          <Header />
          <Nav />
          <Route path="/" exact component={ShopCard} />
          <Route path="/order/" exact component={Vote} />
          <Route path="/login/" exact component={Login} />
          <Route path="/register/" exact component={Register} />
            <div id="edit-btn">
              <Link to="/edit">＋</Link>
            </div>
            <Route path="/edit/" exact component={Edit} />
        </Router>
      </div>
    );
  }
}
console.log("呼ばれてはいるよ！");
const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);

//var num = Math.floor(Math.random() * 10000);



// <Header />
// <div id="sc-wrap">
//   <h2>宅配弁当</h2>
//   <div id="sc-container">
//     <ShopCard />
//     <ShopCard />
//     <ShopCard />
//     <ShopCard />
//   </div>
// </div>
// <div id="vote-wrap">
//   <h2>最新の投稿</h2>
//   <div id="vote-container">
//     <Vote />
//     <Vote />
//     <Vote />
//     <Vote />
//   </div>
// </div>
// <div id="intro">
//   <h1>MeeNU<span>とは、お弁当の評価記事を見てそのまま注文、予約のできるメディアサービスです。</span></h1>
// </div>
