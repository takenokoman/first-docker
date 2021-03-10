import React from "react";

export default class MyPosts extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <div id="vote">
        <ul>
          {() => {for (let i=0;i<20;i++) {
            return <li className="list" id={i}>aaaaaaaaaaaaaaaaaaaas</li>;
          }}}
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
          <li className="list"></li>
        </ul>
      </div>
    );
  }
}
