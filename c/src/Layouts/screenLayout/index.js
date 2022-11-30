import React from "react";
import Nav from '../screenLayout/Nav';
import "./style.css";

const ScreenLayout = (props) => {

  return (
    <div className="main-container">
      <Nav />
      <div className="child ">{props.children}</div>
    </div>
  );
};

export default ScreenLayout;
