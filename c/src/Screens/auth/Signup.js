import React, { useState, useEffect } from "react";
import { Form } from "reactstrap";
import Button from "../../components/Button";
import InputField from "../../components/Input";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { selectUser, signup_user } from "../../features/userSlice";
import { useSelector, useDispatch } from "react-redux";

import AuthLayout from "../../Layouts/AuthLayout";
import { ToastContainer, toast } from "material-react-toastify";


const Signup = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // const [responseError, setResponseSms] = useState(null);
  const [responseSms, setResponseSms] = useState(null);
  const [res_success, setRes_success] = useState();

  const [isLoading, setLoading] = useState(false);
  const [resend, setResend] = useState(false);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
      setNameError(false);
      // setAlert(false);
    }, 5000);
  }, [nameError, emailError, passwordError, confirmPassword]);

  const register = (event) => {
    event.preventDefault();

    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // let mobileReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!name) {
      setNameError("Please enter your name");

      return false;
    } else if (name.length < 2) {
      setNameError("Please enter a valid name");

      return false;
    } else if (name.length > 54) {
      setNameError(" your name maximum 54 characters");

      return false;
    } else if (!email) {
      setEmailError("Please enter your email");

      return false;
    } else if (!emailReg.test(email)) {
      setEmailError("Please put a valid email");

      return false;
    }

    else if (!password) {
      setPasswordError("Please enter your password");

      return false;
    } else if (password.length < 8) {
      setPasswordError("Your password must be at least 8 characters");

      return false;
    } else if (!confirmPassword) {
      setConfirmPasswordError("Please enter your confirm password");

      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Please enter same password");

      return false;
    } else {

      setNameError("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");

      setLoading(true);

      fetch(process.env.REACT_APP_API_URL + "/api/auth/users/signup", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email.toLowerCase(),
          password: password,
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
              dispatch(signup_user(true));
              setResend(true);
              setRes_success(true);
              setResponseSms(res.message);
              toast.success(
                " You have successfully registered please check your email to verify your account",
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                }
              );
              setTimeout(() => {
                navigate("/login");
              }, 5000);
            }
          });
        })
        .catch((res) => {
          console.log(res);
          alert("No connection server is not responding");
        });
    }
  };

  const reSendSms = () => {
    toast.success("We have sent you an email again. check your inbox", {
      position: "top-right",
      autoClose: 5000,
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
          if (res.status !== 201) {
            setResponseSms(res.error);
          } else {
            setResend(true);
            setResponseSms(res.message);
          }
        });
      })
      .catch((res) => {
        console.log(res);
        alert("No connection server is not responding");
      });
  };

  return (
    <>
      {user ? (
        <Navigate to="/" />
      ) : (
        <AuthLayout heading="Register for a new account">
          <Form>
            {res_success ? (
              <p className="text-center text-success">{responseSms}</p>
            ) : (
              <p className="text-center error">{responseSms}</p>
            )}
            <InputField
              className="input"
              label="Name"
              for="exampleName"
              type="text"
              name="name"
              id="exampleName"
              value={name}
              placeholder="eg. John Doe"
              onChange={(e) => setName(e.target.value)}
              maxLength="54"
            />
            <p className="error">{nameError}</p>
            <InputField
              label="Email"
              className="input"
              for="exampleEmail"
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="eg. john@organisation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength="50"
            />
            <p className="error">{emailError}</p>

            <InputField
              for="examplePassword"
              className="input"
              label="Password"
              type="password"
              name="password"
              id="examplePassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength="100"
            />
            <p className="error">{passwordError}</p>

            <InputField
              label="Confirm Password"
              className="input"
              for="exampleConfirmPassword"
              type="password"
              name="confirmPassword"
              id="exampleConfirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength="100"
            />
            <p className="error">{confirmPasswordError}</p>

            {!isLoading && (
              <Button
                type="submit"
                title="Register"
                onClick={register}
                className="signup_btn btn"
                id="submit_btn"
              />
            )}
            {isLoading && (
              <Button
                type="submit"
                title={
                  <span>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    >
                      {" "}
                    </span>
                    &nbsp;&nbsp; ...Loading
                  </span>
                }
                id="submit_btn"
                className="signup_btn btn"
                disabled={true}
              />
            )}
            <p className="forgot_signup_div">
              <span>
                Already have an account ?{" "}
                <Link className="link" to="/login">
                  login here
                </Link>
              </span>
            </p>

            {resend ? (
              <p className="resnd_sms">
                If you did not recieve an email
                <span
                  className="resend"
                  onClick={reSendSms}
                  style={{
                    color: "blue",
                    marginLeft: ".2rem",
                  }}
                >
                  click here
                </span>{" "}
                to send again.
              </p>
            ) : null}
          </Form>
          <ToastContainer />
        </AuthLayout>
      )}
    </>
  );
};
export default Signup;
