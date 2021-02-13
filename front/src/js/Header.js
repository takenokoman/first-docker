import React from "react";
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <header>
        <div id="hd-logo">
          <h1><Link to="/">MeeNU</Link></h1>
        </div>
        <div id="hd-btn">
          <div id="login"><Link to="/login">ログイン</Link></div>
          <div id="register"><Link to="/register">かんたん登録</Link></div>
        </div>
      </header>
    );
  }
}
