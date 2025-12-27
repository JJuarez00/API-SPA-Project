/**
 * Author: Joseph Juarez
 * Date: 12/10/2025
 * File: categories.jsx
 * Description: This script creates the categories component to list all the games.
 */

import {settings} from "../../config/config";
import {useAuth} from "../../services/useAuth";
import useAxios from "../../services/useAxios";
import {NavLink, Outlet} from "react-router-dom";
import {useState} from "react";
import "/src/assets/css/category.css";
import Pagination from "./pagination";

const Categories = () => {
    const [url, setUrl] = useState(settings.baseApiUrl + "/categories");
    const {user} = useAuth();

    // Declare the data fetching function
    const {
        error,
        isLoading,
        data: categories
    } = useAxios(url, "GET", {Authorization: "Bearer " + user.jwt});
    return (
        <>
            <div className="main-heading">
                <div className="container">Game Categories</div>
            </div>
            <div className="sub-heading">
                <div className="container">All Categories</div>
            </div>
            <div className="main-content container">
                {error && <div>{error}</div>}
                {isLoading &&
                    <div className="image-loading">
                        Please wait while data is being loaded
                        <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
                    </div>
                }
                {categories &&
                    <div className="category-container">
                        <div className="category-row category-row-header">
                            <div>ID</div>
                            <div>Category Name</div>
                        </div>
                        {categories.data && categories.data.map((category) => (
                            <div key={category.category_id} className="category-row">
                                <div>
                                    <NavLink
                                        className={({isActive}) => isActive ? "active" : ""}
                                        to={`/categories/${category.category_id}`}>
                                        {category.category_id}
                                    </NavLink>
                                </div>
                                <div>{category.category_name}</div>
                            </div>
                        ))}
                    </div>}
                {categories && <Pagination categories={categories} setUrl={setUrl}/>}
            </div>
            <Outlet/>
        </>
    );
};

export default Categories;