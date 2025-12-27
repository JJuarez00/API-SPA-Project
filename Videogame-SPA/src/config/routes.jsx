/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: routes.jsx
 * Description: Defines app routes.
 */

import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/home";
import NoMatch from "../pages/nomatch";
import Publishers from "../pages/publisher/publishers";
import Publisher from "../pages/publisher/publisher.jsx";
import Videogames from "../pages/videogame/videogames.jsx";
import RequireAuth from "../components/RequireAuth";
import {AuthProvider} from "../services/useAuth.jsx";
import Signin from "../pages/auth/signin.jsx";
import Signout from "../pages/auth/signout.jsx";
import Signup from "../pages/auth/signup.jsx";
import Categories from "../pages/category/categories.jsx";
import Category from "../pages/category/category.jsx";
import Platforms from "../pages/platform/platforms.jsx";
import EditPlatform from "../pages/platform/editPlatform.jsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>

                        <Route path="publishers" element={
                            <RequireAuth>
                                <Publishers/>
                            </RequireAuth>
                        }>

                            <Route index element={<p>Select a publisher to view details.</p>} />
                            <Route path=":publisherId" element={<Publisher/>}>
                                <Route path="videogames" element={<Videogames/>}/>
                            </Route>
                        </Route>

                        <Route path="categories" element={
                            <RequireAuth>
                                <Categories/>
                            </RequireAuth>
                        }>
                            <Route path=":category_id" element={<Category/>} />
                        </Route>

                        <Route
                            path="platforms"
                            element={
                                <RequireAuth>
                                    <Platforms />
                                </RequireAuth>
                            }
                        >
                            <Route path=":platformId" element={<EditPlatform/>} />
                        </Route>


                        <Route path="/signin" element={<Signin/>}/>
                        <Route path="/signout" element={<Signout/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="*" element={<NoMatch/>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;