import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { key } from "../../../constants"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollyBox } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview('init');
  }, [])
  

  const menu_stock_render = () => {
    return (
      <li className="nav-item has-treeview">
        <a href="#"
          className={`nav-link ${location.pathname.includes("PurchaseOrder") ? "active" : ""
            }`}
        >
          {/* <i className="nav-icon fas fa-shopping-cart" /> */}
          <FontAwesomeIcon className="nav-icon" icon={faDollyBox} />
          <p>
            สต๊อก
            <i className="right fas fa-angle-left" />

          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              onClick={() => navigate("/stock/receive")}
              className={
                location.pathname === "/stock/receive"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>รับสต๊อก</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => navigate("/stock/issues")}
              className={
                location.pathname === "/stock/issues"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>จ่ายสต๊อก</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_jobOrder_render = () => {
    return (
      <li className="nav-item has-treeview">
        <a
          className={`nav-link ${location.pathname.includes("JobOrder") ? "active" : ""
            }`}
        >
          <i className="nav-icon fas fa-industry" />

          <p>
            คำสั่งงาน
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              // onClick={() => navigate("/JobOrder/jobCards")}
              className={
                location.pathname.includes("JobCards")
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>ปริ้นใบสั่งงาน</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_master_render = () => {
    const userLevel = localStorage.getItem(key.user_level)
    if (userLevel == 'admin' || userLevel == 'power') {
      return (
        <li className="nav-item has-treeview">
          <a

            className={`nav-link ${location.pathname.includes("Master") ? "active" : ""
              }`}
          >
            <i className="nav-icon fas fa-tasks" />

            <p>
              มาสเตอร์
              <i className="right fas fa-angle-left" />
            </p>
          </a>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <a
                onClick={() => navigate("/Master/Users")}
                className={
                  location.pathname === "/Master/Users"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>จัดการผู้ใช้งาน</p>
              </a>
            </li>
            {/* <li className="nav-item">
              <a
                onClick={() => navigate("/Master/Customer")}
                className={
                  location.pathname === "/Master/Customer"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>จัดการลูกค้า</p>
              </a>
            </li> */}
          </ul>
        </li>

      );
    }
  };

  return (
    <aside className="main-sidebar sidebar-dark elevation-4 bg-main">
      <a
        href="/home"
        target={'_blank'}
        className="brand-link bg-main"
        style={{ cursor: "pointer" }}
      >
        <img
          src="/img/Patong_bg.jpg"
          alt="spectrumPro Logo"
          className="brand-image elevation-2 "
          style={{ opacity: "1" }}
        />
        <label className=" elevation-2" style={{ cursor: "pointer" }}>ปะตงศูนย์ล้อ</label>
        <span
          className="brand-text font-weight-light"
          style={{ visibility: "hidden" }}
        >
          {"_"}
        </span>
      </a>
      <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
        <div className="os-resize-observer-host observed">
          <div
            className="os-resize-observer"
            style={{ left: 0, right: "auto" }}
          />
        </div>
        <div
          className="os-size-auto-observer observed"
          style={{ height: "calc(100% + 1px)", float: "left" }}
        >
          <div className="os-resize-observer" />
        </div>
        <div
          className="os-content-glue"
          style={{ margin: "0px -8px", width: 249, height: 462 }}
        />
        <div className="os-padding">
          <div
            className="os-viewport os-viewport-native-scrollbars-invisible"
            style={{ overflowY: "scroll" }}
          >
            <div
              className="os-content"
              style={{ padding: "0px 8px", height: "100%", width: "100%" }}
            >
              <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="true">
                  {menu_stock_render()}
                  {/* {menu_jobOrder_render()} */}
                  {menu_master_render()}
                </ul>

              </nav>
            </div>
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-auto-hidden os-scrollbar-unusable">
          <div className="os-scrollbar-track">
            <div
              className="os-scrollbar-handle"
              style={{ width: "100%", transform: "translate(0px, 0px)" }}
            />
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden">
          <div className="os-scrollbar-track">
            <div
              className="os-scrollbar-handle"
              style={{ height: "44.9525%", transform: "translate(0px, 0px)" }}
            />
          </div>
        </div>
        <div className="os-scrollbar-corner" />
      </div>
    </aside>
  );
};

export default Sidebar;
