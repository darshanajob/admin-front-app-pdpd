import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import axios from "axios";

import store from "./store";
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_ENDPOINT;

axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Authorization'] = localStorage.getItem('auth-token');
axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById("root"));
if (process.env.REACT_APP_ENVIRONMENT === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}
root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
);

serviceWorker.unregister()
