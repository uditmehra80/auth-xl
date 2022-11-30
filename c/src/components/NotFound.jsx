import React from "react";
import { BiError } from "react-icons/bi";
import { Link } from "react-router-dom";

function NotFound(props) {
  return (
    <div>
      <div className="verified-email" style={{ color: "red" }}>
        <div>
          <BiError className="icon error" />
          <h1>Page not found</h1>
          <Link className="linkForLogin" to="/">
            Back to the dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
