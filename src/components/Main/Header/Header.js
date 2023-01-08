import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { key } from "../../../constants";

const Header = () => {
  const navigate = useNavigate();

  const doLogout = () => {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user_id);
    localStorage.removeItem(key.user_level);
    localStorage.removeItem(key.username)
    navigate("/login");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-primary navbar-dark bg-main">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <label className="nav-link">ชื่อผู้ใช้งาน : {localStorage.getItem(key.username)}</label>
        </li>
        <li
          className="nav-item"
          onClick={(e) => {
            doLogout();
          }}
        >
          <a
            className="nav-link"
            role="button"
          >
            {"ลงชื่อออก "}
            <i className="fas fa-sign-out-alt" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" role="button">
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
