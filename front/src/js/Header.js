import React from "react";
import { Link } from 'react-router-dom';
import Login from "./Login.js";
import Register from "./Register.js";
import Edit from "./Edit.js";
import Nav from "./Nav.js";

//UserContexts
import UserContext from "./contexts/userContext.js";

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {showLogin: false, showRegister: false, showEdit: false}
  }

  toggleLogin() {
    this.setState({
      showLogin: !this.state.showLogin
    });
    console.log(this.state.showLogin + "Login");
  }
  toggleRegister() {

    this.setState({
      showRegister: !this.state.showRegister
    });
    console.log(this.state.showRegister + "Register");
  }
  toggleEdit() {
    console.log("呼ばれてるよ");
    this.setState({
      showEdit: !this.state.showEdit
    });
    console.log(this.state.showEdit + "Edit");
  }
  loginLog(user) {
    console.log(user);
  }

  render() {
    return (
      <header>
        <div id="hd-wrap">
          <div id="hd-container">
            <div id="hd-logo">
              <h1><Link to="/">MeeNU</Link></h1>
            </div>
            <UserContext.Consumer>
              {user => (
                user.isLogedIn ?
                  <div>
                    <div id="user-name">Hello {user.userName}</div>
                    <button id="edit-btn" onClick={this.toggleEdit.bind(this)}>+</button>
                  </div>
                  :
                  <div id="hd-btn">
                    <div id="login">
                      <button onClick={this.toggleLogin.bind(this)}>ログイン</button>
                    </div>
                    <div id="register">
                      <button onClick={this.toggleRegister.bind(this)}>新規登録</button>
                    </div>
                  </div>
                )}
            </UserContext.Consumer>
          </div>
          <Nav />
        </div>
        {this.state.showLogin ?
          <UserContext.Consumer>
            {user => (
              <Login handleLogin={user.handleLogin} showLogin={this.state.showLogin} toggleLogin={this.toggleLogin.bind(this)} />
            )}
          </UserContext.Consumer>
        : null}
        {this.state.showRegister ? <Register toggleRegister={this.toggleRegister.bind(this)} /> : null}
        {this.state.showEdit ?
          <UserContext.Consumer>
            {user => (
              <Edit toggleEdit={this.toggleEdit.bind(this) } userName={user.name} />
            )}
          </UserContext.Consumer>
        : null}
      </header>
    );
  }
}
