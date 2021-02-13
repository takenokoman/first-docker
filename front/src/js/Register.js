import React from "react";

export default class Register extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <div id="wrap">
        <div id="container">
          <form id="login-form" action="/login" method="post">
            <h2>新規登録</h2>
            <div id="login-input">
              <input id="user_name" type="text" name="user_name" placeholder="ユーザーネーム" required="required" />
              <input id="pass" type="password" name="pass" placeholder="パスワード" required="required" />
            </div>
            <input id="submit-btn" type="submit" value="送信" />
          </form>
        </div>
      </div>
    );
  }
}
