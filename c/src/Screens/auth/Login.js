import React, { useEffect, useState } from "react";
import { Form } from "reactstrap";
import Button from "../../components/Button";
import InputField from "../../components/Input";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "material-react-toastify";

import {
  login,
  allStates,
  signup_user,
} from "../../features/userSlice";
import { selectUser } from "../../features/userSlice";
// import { useSelector } from "react-redux";
import "./style.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AuthLayout from "../../Layouts/AuthLayout";

// import { toast, ToastContainer } from "react-toastify";
const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setLoading] = useState(false);
  // const [isAlert, setAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resend, setResend] = useState(false);
  const [responseSms, setResponseSms] = useState(null);
  const [res_success, setRes_success] = useState(false);

  const dispatch = useDispatch();
  const reduxState = useSelector(allStates);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAlert(false);
  //     setResponseSms(false);
  //   }, 5000);
  // }, [isAlert]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setEmailError(false);
  //     setPasswordError(false);
  //   }, 5000);
  // }, [emailError, passwordError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) {
      setEmailError("Please enter your email");
      setTimeout(() => {
        setEmailError(false);
        setPasswordError(false);
      }, 5000);
      return false;
    } else if (!emailReg.test(email)) {
      setEmailError("Please put a valid email!");
      setTimeout(() => {
        setEmailError(false);
        setPasswordError(false);
      }, 5000);
      return false;
    } else if (!password) {
      setPasswordError("Please enter your password");
      setTimeout(() => {
        setEmailError(false);
        setPasswordError(false);
      }, 5000);
      return false;
    }
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    await fetch(process.env.REACT_APP_API_URL + "/api/auth/users/login", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
      }),
    })
      .then((res) => {
        console.log(res, "res")
        res.json().then((res) => {
          setLoading(false);
          if (res.status === 401) {
            setResend(true);
          }

          if (res.error) {
            setResponseSms(res.error);
          } else {
            const token = res.token;
            setRes_success(true);
            setResponseSms(res.message);
            dispatch(signup_user(false));
            localStorage.setItem("user-detail", JSON.stringify(res.data));
            localStorage.setItem(
              "getData",
              JSON.stringify({
                baseData: true,
                hospitalData: true,
                eventData: true,
              })
            );
            dispatch(
              login({
                email: email,
                token: token,
                loggedIn: true,
              })
            );
          }
        });
      })
      .catch(function (res) {
        setLoading(false);
        console.log(res);
      });
  };

  const reSendSms = () => {
    toast.success("We have sent you an email again. check your inbox", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });

    fetch(process.env.REACT_APP_API_URL + "/api/auth/re-send-link", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => {
        // console.log(res);
        setLoading(false);
        res.json().then((res) => {
          // console.log(res);
          if (res.error) {
            setResponseSms(res.error);
          } else {
            setResend(true);
            setRes_success(true);
            setResponseSms(res.message);
          }
        });
      })
      .catch((res) => {
        console.log(res);
        // alert("no connection server is not responding");
      });
  };

  const user = useSelector(selectUser);

  return (
    <>
      {user ? (
        <Navigate to="/" />
      ) : (
        <AuthLayout heading="Login to your account">
          <ToastContainer />
          <Form onSubmit={(event) => handleSubmit(event)}>
            {/* <h3>Login</h3> */}
            {res_success ? (
              <p className="text-center mt-2 success">{responseSms}hhh</p>
            ) : (
              <p className="text-center mt-2 error">{responseSms}</p>
            )}
            <InputField
              className="input"
              label="Email"
              for="exampleEmail"
              type="email"
              name="email"
              id="exampleEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

            // placeholder="with a placeholder"
            />
            <p className="error">{emailError}</p>

            <InputField
              className="input"
              for="examplePassword"
              label="Password"
              type="password"
              name="password"
              id="examplePassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            // placeholder="password placeholder"
            />
            <p className="error">{passwordError}</p>
            {/* {isAlert && (
              <Alert color="danger" fade={false} className="">
                {responseError}
              </Alert>
            )} */}
            {/* <Button className="loginBtn">Login</Button> */}
            {!isLoading && (
              <Button
                type="submit"
                title="Login"
                id="submit_btn"
                className="login_btn btn d-block"
              // id="button"
              />
            )}
            {isLoading && (
              <Button
                type="submit"
                title={
                  <span>
                    {/* <FontAwesomeIcon icon={faSpinner} />  */}
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    >
                      {" "}
                    </span>
                    &nbsp;&nbsp;...Loading
                    {/* <LinearProgress color="inherit"/> */}
                  </span>
                }
                id="submit_btn"
                className="login_btn btn"
                disabled={true}
              // id="button"
              />
            )}
            <div className="forgot_signup_div main-d-p">
              {resend || reduxState.signup_user ? (
                <p style={{ fontSize: "1rem" }}>
                  <span
                    onClick={reSendSms}
                    style={{
                      color: "blue",
                      fontSize: "1rem",
                      cursor: 'pointer'
                    }}
                  >
                    Click here
                  </span>{" "}
                  to resend verification link.
                </p>
              ) : null}
              <p>
                <span>
                  Not registered yet?
                  <Link className="link" to="/signup">
                    &nbsp; Click here
                  </Link>
                </span>
              </p>
              <p>
                <span>
                  Forgot Password?{" "}
                  <Link className="link" to="/reset">
                    Click here
                  </Link>
                </span>
              </p>

            </div>
          </Form>
        </AuthLayout>
      )}
      {showModal && (
        <h4>hey</h4>
      )}
    </>
  );
};
export default Login;
