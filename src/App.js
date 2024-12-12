import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <div>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isAuthorized ? (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateRoute>
                    <DefaultComponent isShowHeader={route.isShowHeader} role={route.role}>
                      <Page />
                    </DefaultComponent>
                  </PrivateRoute>
                }
              />
            ) : (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <>
                    <Page />
                  </>
                }
              />
            );
            return Layout;
          })}
        </Routes>
      </div>
    </>
  );
}

export default App;
