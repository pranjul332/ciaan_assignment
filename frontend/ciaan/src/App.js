import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Pages/Home";
// import NavBelow from "./NavBelow";
import Create from "./Pages/Create";
import Profile from "./Pages/Profile";
import Login from "./auth/Login";
import Registration from "./auth/Registration";

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/Create"];

  return (
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* <Route path='/Videos'element={<Videos/>}></Route>    */}
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/Create" element={<Create />}></Route>
        <Route path="/login" element={<Login />}>
          Login
        </Route>
        <Route path="/registration" element={<Registration />}>
          Registration
        </Route>
      </Routes>
      {/* <NavBelow /> */}
    </div>
  );
};

export default App;
