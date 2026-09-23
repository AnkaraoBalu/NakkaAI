import { createElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./components/SiteLayout.jsx";
import Home from "./home/Home.js";
import NotFound from "./components/NotFound.jsx";

export default function AppRouter() {
  return createElement(
    BrowserRouter,
    null,
    createElement(
      Routes,
      null,
      createElement(
        Route,
        { element: createElement(SiteLayout) },
        createElement(Route, { index: true, element: createElement(Home) }),
        createElement(Route, {
          path: "code.html",
          element: createElement(Home),
        }),
        createElement(Route, { path: "*", element: createElement(NotFound) }),
      ),
    ),
  );
}
