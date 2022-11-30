import React, { useState, useEffect } from "react";
import { Form } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import InputField from "../../../components/Input";
import { ToastContainer } from "material-react-toastify";

import "./style.css";
import AuthLayout from "../../../Layouts/AuthLayout";

const ResetPassword = () => {

  const [email, setEmail] = useState();
  const [emailError, setEmailError] = useState("");
  const [responseError, setResponseError] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const [res, setRes] = useState();

  useEffect(() => {
    setTimeout(() => {
      setAlert(false);
    }, 5000);
  }, [isAlert]);

  useEffect(() => {
    setTimeout(() => {
      setEmailError(false);
      setResponseError(false);
    }, 5000);
  }, [emailError]);

  const submit = (event) => {
    event.preventDefault();
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) {
      setEmailError(" Please enter your email");
      return false;
    } else if (!emailReg.test(email)) {
      setEmailError(" Please enter a valid email");
      return false;
    }
    setLoading(true);
    // console.log(email);
    fetch(process.env.REACT_APP_API_URL + "/api/auth/forgot-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.status === 201) {
          setRes(true);
        } else {
          setRes(false);
        }
        setLoading(false);
        setAlert(true);
        if (data.error) {
          // alert(data.error);
          setResponseError(data.error);
          setRes(true);
        } else {
          setRes(false);
          //  M.toast({html:data.message,classes:"#43a047 green darken-1"})
          // alert(data.message)
          setResponseError(data.message);
          // setShowModal((prev) => !prev);
          //  history.push('/newPassword/:token/:id');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthLayout heading="Forgot password ?">
      <Form onSubmit={(event) => submit(event)}>
        {res ? (
          <p className=" text-center error mt-2">{responseError}</p>
        ) : (
          <p className="response-success mt-2">{responseError}</p>
        )}

        {/* <p>Enter the email address associated with your account</p> */}

        <InputField
          className="input"
          label="Email"
          for="exampleEmail"
          type="email"
          name="email"
          id="exampleEmail"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <p className="error">{emailError}</p>
        {/* {isAlert && (
        <Alert
          color={res ? "success" : "danger"}
          fade={false}
          className="responseAlert"
        >
          {responseError}
        </Alert>
      )} */}
        {/* {isAlert && <Alert color="light" fade={false} className="">{responseSucces}</Alert>} */}

        {!isLoading && (
          <Button id="submit_btn" title="Request Password Reset" />
        )}
        {isLoading && (
          <Button
            type="submit"
            title={
              <span>
                {" "}
                {/* <FontAwesomeIcon icon={faSpinner} /> */}
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
            className="signup_btn"
            disabled={true}
          // id="button"
          />
        )}
        <ToastContainer />
        <p className="forgot_signup_div">
          <span>
            Go back to login{" "}
            <Link className="link" to="/login">
              click here
            </Link>
          </span>
        </p>

        {/* <span>
          Go back to
          <Link className="link" to="/login">
            &nbsp;login
          </Link>
        </span> */}
      </Form>
      {/* <Modal /> */}
    </AuthLayout>
  );
};

export default ResetPassword;
