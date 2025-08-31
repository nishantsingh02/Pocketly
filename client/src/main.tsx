import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App /> 
    </GoogleOAuthProvider>
  </React.StrictMode>
);
