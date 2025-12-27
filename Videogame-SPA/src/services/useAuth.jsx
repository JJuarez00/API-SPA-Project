/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: useAuth.jsx
 * Description: Auth context and hook that manages signup/login/logout state,
 *              calls the API for authentication,
 *              stores the user and JWT,
 *              and exposes auth status plus error/loading flags to the app.
 */

//The code was adopted from https://www.jeffedmondson.dev/blog/react-protected-routes/
import {useState, createContext, useContext} from "react";
import {settings} from "../config/config";

// Create the context
const AuthContext = createContext(null);
const AuthProvider = ({children}) => {  // Ignore the 'children is missing in props validation' error
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isSignup, setIsSignup] = useState(false);

    // Login function
    const login = (account, callback) => {
        const url = settings.baseApiUrl + "/users/authJWT";
        fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        })
            .then(response => {
                if (!response.ok) {
                    throw (response);
                }
                return response.json();
            })
            .then(
                (result) => {
                    setError(null);
                    setIsLoading(false);
                    setIsAuthed(true);
                    setUser({name: result.name, role: result.role, jwt: result.jwt});
                    callback();
                })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                if (err.status == 401) {
                    setError("Incorrect username/password. Please try again.");
                } else {
                    setError("An error has occurred. Please try again.");
                }
            })
    };

    // Logout function
    const logout = () => {
        setError(null);
        setIsLoading(false);
        setIsAuthed(false);
        setIsSignup(false);
        setUser(null);
    };

    // Signup function
    const signup = (account) => {
        const url = settings.baseApiUrl + "/users";
        fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        })
            .then(response => {
                if (!response.ok) {
                    throw (response);
                }
                return response.json();
            })
            .then(
                (result) => {
                    setError(null);
                    setIsLoading(false);
                    setUser({name: result.data.name, role: result.data.role});
                    setIsSignup(true);
                })
            .catch(err => {
                console.log(err)
                setIsLoading(false);
                setError("An error has occurred. Please try again.");
            })
    }

    return (
        // Create the provider so that any component in our application can
        // Use the values that we are sending.
        <AuthContext.Provider value={{error, isLoading, isAuthed, isSignup, user, login, logout, signup}}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export {AuthProvider, useAuth};