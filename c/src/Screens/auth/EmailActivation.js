import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { Link } from "react-router-dom";

const EmailActivation = () => {
  const { token } = useParams();
  const [handleResponse, setHandleResponse] = useState(true);
  useEffect(() => {
    if (token) {
      const activationEmail = () => {
        fetch(process.env.REACT_APP_API_URL + "/api/auth/emailverify", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin)
          body: JSON.stringify({
            token: token,
          }),
        })
          .then((res) => {
            res.json().then((res) => {
              // console.log(res);
              if (res.status === 201) {
                // console.log(res);
                setHandleResponse(true);
              } else {
                console.log(res.error);
                setHandleResponse(false);
              }
            });
            // console.log(res);
          })
          .catch((res) => {
            console.log(res);
          });
      };
      activationEmail();
    }
  }, []);
  // console.log(token, "tokendet");
  return (
    <>
      {handleResponse ? (
        <div className="verified-email">
          <div>
            <MdCheckCircle className="icon success" />
            <h1> Your email is successfully verified !</h1>
            <Link className="linkForLogin" to="/login">
              Click here to login
            </Link>
          </div>
        </div>
      ) : (
        <div className="verified-email" style={{ color: "red" }}>
          <div>
            <BiError className="icon error" />
            <h1>Something went wrong!</h1>
            <Link className="linkForLogin" to="/signup">
              Click here to go to signup page.
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailActivation;
