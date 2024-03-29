import React from "react";
import {createRoutesFromElements, createBrowserRouter, Route} from "react-router-dom";
import {Router} from "../constants/router";
import {Home} from "../pages/Home/Home";
import {MainLayout} from "../layouts/MainLayout/MainLayout";
import {Room} from "../pages/Room/Room";
import {PrivateRoute} from "../hoc/PrivateRoute";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path={Router.ROOT} element={<MainLayout/>}>
                <Route index element={<Home/>}/>
                <Route path={Router.ROOM} element={<PrivateRoute><Room/></PrivateRoute>}/>
            </Route>
            <Route path={'*'} element={<h2>NOT FOUND</h2>}/>
        </>
    )
);

export {router};