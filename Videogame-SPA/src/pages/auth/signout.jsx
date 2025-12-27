/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: signout.jsx
 * Description: User sign-out component that logs out the current user on load and displays a confirmation message.
 */

import {useAuth} from "../../services/useAuth";
import {useEffect} from 'react'

import React from 'react';

const Signout = () => {
    const {logout} = useAuth();

    useEffect(() => {
        logout();
    })

    return (
        <>
            <div className="main-heading">
                <div className="container">Authorization</div>
            </div>
            <div className="sub-heading">
                <div className="container">Sign Out</div>
            </div>
            <div className="main-content container">
                You have signed out.
            </div>
        </>
    );
};

export default Signout;