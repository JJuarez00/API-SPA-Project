/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: signup.jsx
 * Description: User signup component that creates an account,
 *              shows loading/error states,
 *              then logs the user in and redirects.
 */

import {Button} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../services/useAuth";
import "/src/assets/css/auth.css";

import React from 'react';

const Signup = () => {
    const [account, setAccount] = useState({role:4}); // Set default role 4: basic user
    let {isAuthed, isLoading, error, isSignup, user, signup, login} = useAuth();
    let navigate = useNavigate();
    let from = '/signup';

    // Create a user account by calling the signup function
    const createAccount = (e) => {
        e.preventDefault();
        signup(account);
    }

    // Handle the change event in the four text boxes;
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setAccount({...account, [name]: value}); // Spread the JSON object
    }

    // The account has been created. Sign in now.
    useEffect(() => {
        if(user) {
            login(account, ()=>{
                navigate(from, {replace: true});
            });
        }
    }, [isSignup]);

    return (
        <>
            <div className="main-heading">
                <div className="container">Authorization</div>
            </div>
            <div className="sub-heading">
                <div className="container">Sign up</div>
            </div>
            <div className="main-content container">
                <div className="auth-container">
                    {error && <div className="message" style={{color: "red"}}>{error}</div>}
                    {isLoading && <div className="message image-loading">
                        Please wait while data is being loaded
                        <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
                    </div>}
                    {isAuthed
                        ? <div style={{width: "100%", textAlign: "left"}}>Your account has been successfully created. Click the links in the navbar to explore the app.</div>
                        : <form className="form-auth" onSubmit={createAccount}>
                            <h3>Create an account for my Videogame API/SPA</h3>
                            <div className="form-group">
                                <div>
                                    <label>Name</label>
                                    <input type="text" name="name" required onChange={handleInputChange}/>
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input type="email" name="email" required onChange={handleInputChange}/>
                                </div>
                                <div>
                                    <label>Username</label>
                                    <input type="text" name="username" required onChange={handleInputChange}/>
                                </div>
                                <div>
                                    <label>Password</label>
                                    <input type="password" name="password" required onChange={handleInputChange}/>
                                </div>
                                <div className="form-button">
                                    <Button type="submit">Sign up</Button>
                                </div>
                                <div className="form-footer">
                                    <p>Already have an account? <Link to="/signin">Sign in</Link></p>
                                </div>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </>
    );
};

export default Signup;