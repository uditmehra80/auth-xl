import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, signup_user } from "../../features/userSlice";
import { logout } from "../../features/userSlice";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from '@mui/material/Tooltip';
import "./style.css";


const Nav = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const handlelogout = (event) => {
    dispatch(logout());
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  let userData = JSON.parse(localStorage.getItem("user-detail"));
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="d-flex justify-content-between position-head">
        <div className="d-flex justify-content-center align-items-center">
          <Link className="text-dark text-decoration-none" to={'/'}>
            <h1>XL-CTB</h1>
          </Link>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Button
            variant="contained"
            color="error"
            onClick={(event) => handlelogout(event)}
            className="ml-2"
          >
            LOGOUT
          </Button>
        </div>
      </div>
    </>
  );
};

export default Nav;
