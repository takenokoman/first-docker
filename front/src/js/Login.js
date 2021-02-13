import React from "react";

export default class Login extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <div id="wrap">
        <div id="container">
          <form id="login-form">
            <h2>ログイン</h2>
            <div id="login-input">
              <input id="user_name" type="text" name="user_name" placeholder="ユーザーネーム" required="required" />
              <input id="pass" type="password" name="pass" placeholder="パスワード" required="required" />
            </div>
            <input id="submit-btn" type="submit" value="ログイン" />
          </form>
        </div>
      </div>
    );
  }
}
