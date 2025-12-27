/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: useXmlHttp.jsx
 * Description: Custom React hook that performs HTTP requests using XMLHttpRequest and exposes response data, loading state, and errors.
 */

import {useState, useEffect} from 'react';

const UseXmlHttp = (url,
                    method= "GET",
                    headers = {}) => {
    headers = {
        ...{"Content-Type": "application/json"},
        ...headers
    };

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    //useEffect function
    useEffect(() => {
        let request = new XMLHttpRequest();
        request.open(method, url, true);
        request.timeout = 2000;   // Time in milliseconds.
        for(let name in headers) { // Set headers; there might be one or more headers.
            request.setRequestHeader(name, headers[name]);
        }

        request.onload = () => {   // Request finished.
            setIsLoading(false)
            if (request.status === 200) {
                setData(JSON.parse(request.response));
            } else {
                console.log(request.status)
                setError("Status: " + request.status + "; Error: " + request.statusText);
            }
        }

        request.ontimeout = () => { // Request timed out.
            setIsLoading(false);
            setError("Error: The request has timed out.");
        }

        request.send();

    }, [url]); // Resend the request whenever url has changed.

    return {data, isLoading, error};
};
export default UseXmlHttp;