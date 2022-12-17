import React from 'react';

import { Navigate } from "react-router-dom";
const Protected = ({ user, children }) => {
    // const verifyUser = async () => {
    //     const response = await fetch(
    //         `${process.env.REACT_APP_API_URL}/api/auth/users/userId`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             email: JSON.parse(localStorage.getItem("user")).email,
    //         }
    //     });
    //     if (response.status === 201) {
    //         return <Navigate to="/login" replace />;
    //     } else {
    //         return children;
    //     };
    // };
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default Protected;