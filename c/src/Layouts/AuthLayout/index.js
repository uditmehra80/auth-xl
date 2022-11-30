import React from "react";
import { Card } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./style.css";

const AuthLayout = (props) => {
  let history = useNavigate();
  return (
    <>
      <div className="auth_container w-100">
        <div className="nav">
          <h1
            className="logo"
            onClick={() => {
              history("/");
            }}
          >
            XL-CTB
          </h1>
          <span className="nav_right">
            <span
              className="nav_login_btn nav_btn"
              onClick={() => {
                history("/login");
              }}
            >
              Login
            </span>
            <span
              onClick={() => {
                history("/signup");
              }}
              className="registration_btn nav_btn ml-5"
            >
              Register
            </span>
          </span>
        </div>
        <div className="height-90vh d-flex w-100 justify-content-center align-content-center">

          {/* <h3 className="form_heading text-center mt-0 mb-0">{props.heading}</h3> */}
          <Card className="m-auto conatiner-card d-flex justify-content-center">
            {props.children}
          </Card>

        </div>
      </div>
    </>
  );
};
export default AuthLayout;
