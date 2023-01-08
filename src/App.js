import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";

import { key } from "./constants";
import Swal from "sweetalert2";
import moment from "moment";

import './App.css';

//Main
import Header from "./components/Main/Header";
import Sidebar from "./components/Main/Sidebar";
import Footer from "./components/Main/Footer";

//Authen
import Login from "./components/Authen/Login";

//Home
import Home from "./components/Main/Home";

//Master
import Users from './components/Master/User';

const showElement = (element) => {
  const isLogined = localStorage.getItem(key.isLogined);
  if (isLogined == "true") {
    return element;
  }
};

function App() {
  const [value, setValue] = useState(0); // integer state

  const doForceUpdate = () => {
    try {
      setValue(value + 1);
    } catch (error) { }
  };

  return (
    <BrowserRouter>
      {showElement(<Header />)}
      {showElement(<Sidebar />)}
      <Routes>
        <Route path="/Home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/Login" element={<Login forceUpdate={doForceUpdate} />} />

        {/* master */}
        <Route path="/Master/Users" element={<Users />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Navigate to="/Home" />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Navigate to="/Home" />
            </RequireAuth>
          }
        />
      </Routes>

      {showElement(<Footer />)}
    </BrowserRouter>
  );
}

export default App;

function RequireAuth(props) {
  const navigate = useNavigate();
  // check permission
  if (localStorage.getItem(key.isLogined) != "true") {
    window.location.replace('/Login');
  }

  //check time to login
  const loginTime = moment(localStorage.getItem(key.loginTime)).format(
    "DD-MMM-yyyy HH:mm:ss"
  );
  if (moment().diff(moment(loginTime), "h") > 4) {


    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "เวลาการเข้าใช้งานหมดอายุ โปรดลงชื่อเข้าใช้ใหม่",
    }).then(() => {
      localStorage.removeItem(key.isLogined);
      localStorage.removeItem(key.loginTime);
      localStorage.removeItem(key.token);
      localStorage.removeItem(key.user_id);
      localStorage.removeItem(key.user_level);
      localStorage.removeItem(key.username)
      navigate("/Login");
      return <Navigate to="/Login" />;
    });
  }

  //check user level
  if (props.userLevel) {
    const userLevel = localStorage.getItem(key.user_level)
    if (!props.userLevel.includes(userLevel)) {
      navigate("/Home");
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "ระดับไม่เพียงพอต่อการเข้าถึง",
      }).then(() => {
        return <Navigate to="/Home" />;
      });
    }

  }

  return props.children;
}
