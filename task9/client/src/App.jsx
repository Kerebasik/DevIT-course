import React from "react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes/router";
import {AuthProvider} from "./hoc/AuthProvider";

const App = () => {
  return(
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
  )
}

export {App}