import React from "react";

export default class ShopCard extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <div id="shop-card">
        <div id="sc-img">
          <img src="/img/meshi.jpg" alt=""/>
        </div>
        <div id="sc-p">
          <p>キッチン伊八</p>
        </div>
      </div>
    );
  }
}
