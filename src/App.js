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

// Stock
import Receive from './components/Stock/Receive';
import Issues from './components/Stock/Issues';
import Move from './components/Stock/Move';
import Reprint from './components/Stock/Reprint';
import Return from './components/Stock/Return';

// Report
import ReportStock from './components/Report/Stock';
import StockQtyAlert from './components/Report/StockQtyAlert';
import StockDetail from './components/Report/StockDetail';
import StockTracking from "./components/Report/StockTracking/StockTracking";
import SummaryStockTracking from './components/Report/SummaryStockTracking';

// Master
import Users from './components/Master/User';
import Product from './components/Master/Product';
import PrintProduct from './components/Master/Product/PrintProduct';
import Area from './components/Master/Area';
import PrintArea from './components/Master/Area/PrintArea';
import Icons from './components/Master/Icons';


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

        {/* Stock */}
        <Route path="/Stock/Receive" element={<RequireAuth><Receive /></RequireAuth>} />
        <Route path="/Stock/Issues" element={<RequireAuth><Issues /></RequireAuth>} />
        <Route path="/Stock/Move" element={<RequireAuth><Move /></RequireAuth>} />
        <Route path="/Stock/Return" element={<RequireAuth><Return /></RequireAuth>} />
        <Route path="/Stock/RePrintStock/:stockId" element={<RequireAuth><Reprint /></RequireAuth>} />

        {/* Report */}
        <Route path="/Report/Stock" element={<RequireAuth><ReportStock /></RequireAuth>} />
        <Route path="/Report/StockQtyAlert" element={<RequireAuth><StockQtyAlert /></RequireAuth>} />
        <Route path="/Report/StockDetail" element={<RequireAuth><StockDetail /></RequireAuth>} />
        <Route path="/Report/StockDetail/:productId" element={<RequireAuth><StockDetail /></RequireAuth>} />
        <Route path="/Report/StockTracking/:stockId" element={<RequireAuth><StockTracking /></RequireAuth>} />
        <Route path="/Report/SummaryStockTracking/" element={<RequireAuth><SummaryStockTracking /></RequireAuth>} />
        
        {/* master */}
        <Route path="/Master/Users" element={<RequireAuth userLevel={["admin", "power"]}><Users /></RequireAuth>} />
        <Route path="/Master/Products" element={<RequireAuth userLevel={["admin", "power"]}><Product /></RequireAuth>} />
        <Route path="/Master/Products/PrintProduct/:productId" element={<RequireAuth userLevel={["admin", "power"]}><PrintProduct /></RequireAuth>} />
        <Route path="/Master/Area" element={<RequireAuth userLevel={["admin", "power"]}><Area /></RequireAuth>} />
        <Route path="/Master/Area/PrintArea/:list_area_id" element={<RequireAuth userLevel={["admin", "power"]}><PrintArea /></RequireAuth>} />
        <Route path="/Master/Icons" element={<RequireAuth userLevel={["admin", "power"]}><Icons /></RequireAuth>}/>
        
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
