import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import InputField from "../../../components/Input";
import { Form } from "reactstrap";
import { useParams } from "react-router-dom";
import "./style.css";
import AuthLayout from "../../../Layouts/AuthLayout";
import { ToastContainer, toast } from "material-react-toastify";
import { useNavigate } from "react-router";

const NewPassword = () => {
  const [password, setpassword] = useState();
  const [passwordError, setpasswordError] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [confirmPassError, setConfirmPassError] = useState();
  const [responseError, setResponseError] = useState(null);
  const [response, setResponse] = useState(null);
  const [isAlert, setAlert] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [res, setRes] = useState();
  const history = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setAlert(false);
    }, 5000);
  }, [isAlert]);

  const { token } = useParams();
  // console.log(token);

  // useEffect(() => {
  //   fetch("http://localhost:3000/passwordword")
  //     .then((response) => response.json())
  //     .then((data) => console.log(data));
  // }, []);

  const submit = () => {
    if (!password) {
      setpasswordError("! Please enter the new password");
      return false;
    } else if (password.length < 8) {
      setpasswordError("! Your password must be at least 8 characters");
      return false;
    } else if (!confirmPass) {
      setConfirmPassError("! Please enter the new password");
      return false;
    } else if (confirmPass !== password) {
      setConfirmPassError("! Please enter the same Password");
      return false;
    } else {
      console.log({ password: password, confirmPass: confirmPass });
    }
    setLoading(true);
    setAlert(false);
    fetch(process.env.REACT_APP_API_URL + "/api/auth/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        token: token,
      }),
    })
      .then((res) => res.json(), console.log(res))
      .then((data) => {
        if (data.status === 201) {
          setRes(false);
          console.log(data);
          toast.success(data.message, {
            autoClose: 3000,
            position: "top-right",
            hideProgressBar: false,
          });
          setResponse(data.message);

          setTimeout(() => {
            history("/login");
          }, 3000);
        } else {
          toast.success(data.error, {
            autoClose: 3000,
            position: "top-right",
            hideProgressBar: false,
          });
          setRes(true);
          setResponseError(data.error);
        }
        setAlert(true);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("No connection server is not responding !", {
          autoClose: 3000,
          position: "top-right",
          hideProgressBar: false,
        });
      });
  };
  return (
    <AuthLayout heading="Reset  new passowrd">
      <ToastContainer />
      <Form>
        {res ? (
          <p className="response-error">{responseError}</p>
        ) : (
          <p className="response-success">{response}</p>
        )}
        <InputField
          className="input"
          for="examplePassword"
          label="New Password"
          type="password"
          name="password"
          id="examplePassword"
          value={password}
          onChange={(event) => {
            setpassword(event.target.value);
          }}
        />
        <p className="error password-error" style={{ marginTop: "-1rem" }}>
          {passwordError}
        </p>
        <InputField
          label="Confirm New Password"
          className="input"
          for="exampleConfirmPassword"
          type="password"
          name="confirmPassword"
          id="exampleConfirmPassword"
          value={confirmPass}
          onChange={(event) => {
            setConfirmPass(event.target.value);
          }}
        />
        <p className="error">{confirmPassError}</p>
        {/* {isAlert && (
        <Alert
          color={res ? "success" : "danger"}
          fade={false}
          className="responseAlert"
        >
          {responseError}
        </Alert>
      )} */}
        {!isLoading && (
          <Button id="submit_btn" title="Reset" onClick={submit} />
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
            className="login_btn btn"
            disabled={true}
          // id="button"
          />
        )}
      </Form>
      {/* <p>Enter the email address associated with your account</p> */}
    </AuthLayout>
  );
};
export default NewPassword;
