/**
 * Author: Joseph Juarez
 * Date: 11/11/2025
 * File: publisher.jsx
 * Description: Display details of a specific publisher.
 */

import {settings} from "../../config/config";
import useXmlHttp from '../../services/useXmlHttp';
import {useParams, Link, useOutletContext, Outlet} from "react-router-dom";
import "../../assets/css/publisher.css";
import {useAuth} from "../../services/useAuth";
import {useEffect} from "react";

const Publisher = () => {
    const {user} = useAuth();
    const [subheading, setSubHeading] = useOutletContext();
    const {publisherId} = useParams();
    const url = settings.baseApiUrl + "/publishers/" + publisherId;
    const {
        error,
        isLoading,
        data: publisher
    } = useXmlHttp(url, "GET",{Authorization:`Bearer ${user.jwt}`});

    useEffect(() => {
        if (publisher) {
            setSubHeading(publisher.publisher_name);
        }
    }, [publisher, setSubHeading]);

    return (
        <>
            {/* --- Error Message --- */}
            {error && <div>{error}</div>}

            {/* --- Loading State --- */}
            {isLoading && <div className="image-loading">
                Please wait while data is being loaded:
                <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
            </div>}

            {/* Right side: area for publisher details */}
            {publisher && <>
                <div className="publisher-details">
                    <div className="publisher-name">{publisher.publisher_name}</div>

                    <div className="publisher-info">
                        <div><strong>Country</strong>: {publisher.country}</div>
                        <div><strong>Year Founded</strong>: {publisher.founded_year}</div>
                        <div><strong>Website</strong>:
                            {publisher.website_url
                                ? <a href={publisher.website_url} target="_blank">Click here to visit website.</a>
                                : <span> No longer active </span>
                            }</div>
                        <div><strong>Videogames</strong>: <Link to={`/publishers/${publisher.publisher_id}/videogames`}>Click here to view videogames</Link></div>

                    </div>

                    {/*Note: We don't have IMG's in our database*/}
                    {/*<div className="publisher-photo">*/}
                    {/*    <img src={publisher.image} alt={publisher.name} id={publisher.id}/>*/}
                    {/*</div>*/}

                </div>
                <div className="publisher-classes">
                    <Outlet/>
                </div>
            </>}
        </>
    );
};

export default Publisher;
