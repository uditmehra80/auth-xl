import React from "react";
import { Button } from "reactstrap";
import "./style.css";
export default (props) => {
  return (
    <Button
      id="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
      type={props.type}
      ref={props.ref}
    >
      {props.title}
    </Button>
  );
};
