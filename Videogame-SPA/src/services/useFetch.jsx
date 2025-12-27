/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: useFetch.jsx
 * Description: Custom hook for authenticated platform API calls (GET/POST/PUT/DELETE and search),
 *              using the logged-in user’s JWT and returning data, loading, and error state.
 */

import {settings} from "../config/config";
import {useState} from "react";
import {useAuth} from "./useAuth";

const UseFetch = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useAuth();
    const baseURI = settings.baseApiUrl + '/platforms';

    // Abort controller to abort a request if it failed
    const abortCont = new AbortController();
    const signal = abortCont.signal;

    // Handle the promise returned from calling a fetch function
    const handleResponse = (promise) => {
        promise
            .then ( async response => {
                if (!response.ok) {
                    const error = await response.json();
                    return Promise.reject(error);
                }
                return response.json();
            })
            .then(data => {
                setIsLoading(false);
                setError(null);
                setData(data);
            })
            .catch(err => {
                setIsLoading(false);
                if (err.name === 'AbortError') {
                    setError('Fetch aborted');
                } else {
                    setError(JSON.stringify(err));
                }
            });
    }

    // Get all platforms.
    const getAll = (id = null) => {
        setIsLoading(true);
        const url = (!id) ? baseURI : baseURI + "/" + id;
        const promise = fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + user.jwt
            },
            signal: signal
        });
        handleResponse(promise);
    }

    // Get a specific platform by id.
    const get = ($id) => {
        getAll($id);
    }


    // Create a platform
    const create = (body) => {
        setIsLoading(true);
        const promise = fetch(baseURI, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + user.jwt
            },
            body: JSON.stringify(body)
        });
        handleResponse(promise);
    }

    // Update an existing platform. platform_id must be included in the body.
    const update = (body) => {
        setIsLoading(true);

        const id = body.platform_id ?? body.id;

        const promise = fetch(baseURI + "/" + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + user.jwt
            },
            body: JSON.stringify(body)
        });
        handleResponse(promise);
    }


    // Delete an existing platform.
    const remove = (platform) => {
        const id = (typeof platform === "object")
            ? (platform.platform_id ?? platform.id)
            : platform;

        const promise = fetch(baseURI + "/" + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + user.jwt
            }
        });

        handleResponse(promise);
    }

    // Search for platforms.
    const search = (query) => {
        const promise = fetch(baseURI + "?q=" + query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + user.jwt
            },
            signal: signal
        });
        handleResponse(promise);
    }

    return {error, isLoading, data, get, getAll, update, remove, create, search};
}
export default UseFetch;