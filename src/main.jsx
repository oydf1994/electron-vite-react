import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Reader from "./Reader";
// import './samples/node-api'
import "antd/dist/antd.css";
import "./assets/styles/index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="reader" element={<Reader />} />
    </Routes>
  </HashRouter>
);

postMessage({ payload: "removeLoading" }, "*");
