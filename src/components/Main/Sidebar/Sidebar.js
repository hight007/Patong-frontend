import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { key } from "../../../constants"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollyBox, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons'

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
        <a href
          className={`nav-link ${location.pathname.includes("Stock/") ? "active" : ""
            }`}
        >
          <FontAwesomeIcon className="nav-icon" icon={faDollyBox} />
          <p>
            สต๊อก
            <i className="right fas fa-angle-left" />

          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              href
              onClick={() => navigate("/Stock/Receive")}
              className={
                location.pathname === "/Stock/Receive"
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
              href
              onClick={() => navigate("/Stock/Issues")}
              className={
                location.pathname === "/Stock/Issues"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>จ่ายสต๊อก</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              href
              onClick={() => navigate("/Stock/Move")}
              className={
                location.pathname === "/Stock/Move"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>ย้ายสต๊อก</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_report_render = () => {
    return (
      <li className="nav-item has-treeview">
        <a
          className={`nav-link ${location.pathname.includes("Report/") ? "active" : ""
            }`}
          href
        >
          <FontAwesomeIcon className="nav-icon" icon={faMagnifyingGlassChart} />

          <p>
            รายงาน
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              href
              onClick={() => navigate("/Report/Stock")}
              className={
                location.pathname === "/Report/Stock"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>จำนวนสต๊อก</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              href
              onClick={() => navigate("/Report/StockQtyAlert")}
              className={
                location.pathname === "/Report/StockQtyAlert"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>แจ้งเตือนสต๊อก</p>
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
            href
            className={`nav-link ${location.pathname.includes("Master/") ? "active" : ""
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
                href
                onClick={() => navigate("/Master/Users")}
                className={
                  location.pathname === "/Master/Users"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>ผู้ใช้งาน</p>
              </a>
            </li>
            <li className="nav-item">
              <a
                href
                onClick={() => navigate("/Master/Products")}
                className={
                  location.pathname === "/Master/Products"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>สินค้า</p>
              </a>
            </li>
            <li className="nav-item">
              <a
                href
                onClick={() => navigate("/Master/Area")}
                className={
                  location.pathname === "/Master/Area"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>พื้นที่</p>
              </a>
            </li>
            <li className="nav-item">
              <a
                href
                onClick={() => navigate("/Master/Icons")}
                className={
                  location.pathname === "/Master/Icons"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="far fa-circle nav-icon" />
                <p>ไอค่อน</p>
              </a>
            </li>
          </ul>
        </li>

      );
    }
  };

  return (
    <aside className="main-sidebar bg-main sidebar-dark-warning elevation-4 ">
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
                  {menu_report_render()}
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
