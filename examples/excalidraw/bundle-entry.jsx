import React from "react";
import ReactDOM from "react-dom/client";
import ReactDOMLegacy from "react-dom";
import * as ExcalidrawLib from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
window.React = React;
window.ReactDOM = { ...ReactDOMLegacy, createRoot: ReactDOM.createRoot };
window.ExcalidrawLib = ExcalidrawLib;
