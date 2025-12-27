/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: Layout.jsx
 * Description: This creates the page layout.
 */

import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
    return (
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    );
};

export default Layout;