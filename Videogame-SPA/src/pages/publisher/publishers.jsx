/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: publishers.jsx
 * Description: Create a component to list all publishers.
 */

import {settings} from "../../config/config";
import {useState, useEffect} from 'react';
import {NavLink, Outlet, useLocation} from "react-router-dom";
import "../../assets/css/publisher.css";
import useXmlHttp from "../../services/useXmlHttp";
import {useAuth} from "../../services/useAuth";

const Publishers = () => {
    const {user} = useAuth();
    const {pathname} = useLocation();
    const [subHeading, setSubHeading] = useState("All Publishers");
    const url = settings.baseApiUrl + "/publishers";
    const {
        error,
        isLoading,
        data: publishers
    } = useXmlHttp(url, "GET",{Authorization:`Bearer ${user.jwt}`});

    useEffect(() => {
        setSubHeading("All Publishers");
    }, [pathname]);

    return (
        <div>

            {/* Displays the main page title “Publisher”*/}
            <div className="main-heading">
                <div className="container">Publisher</div>
            </div>

            {/* Displays the current subheading, for example “All Publishers” */}
            <div className="sub-heading">
                <div className="container">{subHeading}</div>
            </div>

            {/* Displays loading image, error message, or the publisher list */}
            <div className="main-content container">

                {/* --- Error Message --- */}
                {error && <div>{error}</div>}

                {/* --- Loading State --- */}
                {isLoading && <div className="image-loading">
                    Please wait while data is being loaded:
                    <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
                </div>}

                {/* --- Publisher List --- */}
                {publishers && <div className="publisher-container">

                    {/* Left side: clickable list of publishers */}
                    <div className="publisher-list">
                        {publishers.data.map((publisher) => (
                            <NavLink key={publisher.publisher_id}
                                     className={({isActive}) => isActive ? "active" : ""}
                                     to={`/publishers/${publisher.publisher_id}`}>
                                <span>&nbsp;</span><div>{publisher.publisher_name}</div>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side: area for publisher details */}
                    <div className="publisher-item">
                        <Outlet context={[subHeading, setSubHeading]}/>
                    </div>
                </div>}
            </div>

        </div>
    );
};

export default Publishers;
