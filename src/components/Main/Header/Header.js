import React from "react";
import { useNavigate } from "react-router-dom";
import { key } from "../../../constants";
import { MobileView } from 'react-device-detect';

const Header = () => {
  const navigate = useNavigate();

  const doLogout = () => {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);
    localStorage.removeItem(key.token);
    localStorage.removeItem(key.user_id);
    localStorage.removeItem(key.user_level);
    localStorage.removeItem(key.username)
    localStorage.removeItem(key.secretKey)
    navigate("/login");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-primary navbar-dark bg-main">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" role="button">{localStorage.getItem(key.username)}</a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">

        <li
          className="nav-item"
          onClick={(e) => {
            doLogout();
          }}
        >
          <a
            className="nav-link"
            role="button"
            href="#"
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

        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" role="button">
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

export default Header;
