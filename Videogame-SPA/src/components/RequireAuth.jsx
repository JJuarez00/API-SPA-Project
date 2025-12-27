/**
 * Author: Ashley Rodriguez Vega
 * Date: 11/14/2025
 * File: RequireAuth.jsx
 * Description: This creates a component to protect pages
 */

import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../services/useAuth";

import React from 'react';

const RequireAuth = ({children}) => {
    let {isAuthed} = useAuth();
    let location = useLocation();
    if (!isAuthed) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    return children;
};
export default RequireAuth;