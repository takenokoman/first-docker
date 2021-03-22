import React from "react";
import { Link } from 'react-router-dom';

export default class Nav extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <nav>
        <ul id="nav-li">
          <li><Link to="/">投稿一覧</Link></li>
          <li><Link to="/options/">マイページ</Link></li>
        </ul>
      </nav>
    );
  }
}
