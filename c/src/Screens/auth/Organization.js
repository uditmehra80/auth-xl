import React, { useState } from "react";
import "./style.css";
import { Form } from "reactstrap";
import InputField from "../../components/Input/index";
import Button from "../../components/Button/index";

export const CreateOrganization = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  // const [usernameError, setUsernameError] = useState("");
  // const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const created_at = new Date();

  const register = (event) => {
    event.preventDefault();
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // let mobileReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!name) {
      setNameError("! Please enter your name");
      return false;
    } else if (!email) {
      setEmailError("! Please enter your email");
      return false;
    } else if (!emailReg.test(email)) {
      setEmailError("! Please put a valid email!");
      return false;
    } else if (!password) {
      setPasswordError("! Please enter your password");
      return false;
    } else if (password.length < 8) {
      setPasswordError("! Your password must be at least 8 characters");
      return false;
    } else if (!confirmPassword) {
      setConfirmPasswordError("! Please enter your confirm password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("! Please enter same password");
      return false;
    } else {
      fetch(process.env.REACT_APP_API_URL + "/organisation/registration", {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          created_at: new Date(),
        }),
      })
        .then(function (res) {
          // console.log(res.ok);
        })
        .catch(function (res) {
          console.log(res);
        });
    }
  };

  return (
    <div className="form_body">
      <Form className="form organization_form">
        <h3>Register Organization</h3>
        <InputField
          className="input"
          label="Name"
          for="exampleName"
          type="text"
          name="name"
          id="exampleName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>{nameError}</p>
        <InputField
          className="input"
          label="Email"
          for="exampleEmail"
          type="email"
          name="email"
          id="exampleEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>{emailError}</p>

        {/* <InputField
          className="input"
          label="Username"
          for="exampleUsername"
          type="text"
          name="username"
          id="exampleUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <p>{usernameError}</p> */}

        <InputField
          className="input"
          for="examplePassword"
          label="Password"
          type="password"
          name="password"
          id="examplePassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>{passwordError}</p>

        <InputField
          className="input"
          label="Confirm Password"
          for="exampleConfirmPassword"
          type="password"
          name="confirmPassword"
          id="exampleConfirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <p>{confirmPasswordError}</p>

        <Button title="Register" onClick={register} />
      </Form>
    </div>
  );
};
export default CreateOrganization;
