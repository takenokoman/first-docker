import React from "react";
import ReactDOM from "react-dom";
//import { hot } from 'react-hot-loader'//いずれreactFastRefleshに置き換わる

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {name: "me"};
  }
  render() {
    return (
      <h1>Welcome!{this.state.name}</h1>
    );
  }
}
console.log("呼ばれてはいるよ！");
const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);
