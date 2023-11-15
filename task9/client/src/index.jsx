import React from "react";
import ReactDOM from "react-dom/client"
import {App} from "./App";
import {Provider} from "react-redux";
import './null.scss'
import {setupStore} from "./store/store";

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

const store = setupStore()

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);