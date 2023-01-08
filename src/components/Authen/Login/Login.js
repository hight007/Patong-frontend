import { apiName, key, OK, server, YES } from "../../../constants";
// import { httpClient } from "../../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../../utils/HttpClient";
import LoadingScreen from "../../Main/LoadingScreen";

import './Login.css'

export default function Login(props) {
  const [isLoad, setisLoad] = useState(false)
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')

  useEffect(() => {
    props.forceUpdate();

    const isLogined = localStorage.getItem(key.isLogined)
    if (isLogined) {
      // navigate("/home");
      window.location.replace('/Home');
    }

  }, [])


  const doLogin = async () => {
    setisLoad(true)
    //Check login with server
    const response = await httpClient.post(apiName.authen.login, { username, password })
    if (response.data.api_result === OK) {
      //login pass
      localStorage.setItem(key.isLogined, "true")
      localStorage.setItem(key.username, username)
      localStorage.setItem(key.user_id, response.data.user_id)
      localStorage.setItem(key.user_level, response.data.user_level)
      localStorage.setItem(key.token, response.data.token)
      localStorage.setItem(
        key.loginTime,
        moment().format("DD-MMM-yyyy HH:mm:ss")
      );
      props.forceUpdate();
      setisLoad(false)
      window.location.replace('/Home');
    } else {
      //login failed
      Swal.fire({
        title: 'Login failed!',
        text: response.data.error,
        icon: "error",
      }).then(() => { setisLoad(false) })
    }
  }

  return (
    <div className="login-page" style={{ height: '100vh' , backgroundColor: 'darkGray'}}>
      <div className="login-box">
        {/* /.login-logo */}
        <div className="card card-outline card-default">

          <div className="card-header text-center" style={{padding : 10 , backgroundColor : 'black'}}>
            <img style={{ width: '100%', height: '100%' }} src="/img/Patong_bg.jpg" />
          </div>
          <div className="card-body" style={{ backgroundColor: '#FFD002'}}>

            {/* <h2 className="login-box-msg resizeable">ปะตง</h2> */}
            <form onSubmit={(e) => {
              e.preventDefault();
              doLogin();
            }}>
              <LoadingScreen isLoad={isLoad} />
              <div className="input-group mb-3">
                <input required onChange={(e) => {
                  setusername(e.target.value);
                }} type="text" className="form-control resizeable" placeholder="ชื่อผู้ใช่งาน" />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input required onChange={(e) => {
                  setpassword(e.target.value)
                }} type="password" className="form-control resizeable" placeholder="รหัสผ่าน" />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                {/* /.col */}
                <div className="col-12">
                  <button type="submit" className="btn btn-dark btn-block resizeable">ลงชื่อเข้าใช้</button>
                </div>
                {/* /.col */}
              </div>
              {/* loading */}


            </form>
            {/* /.social-auth-links */}
          </div>
          {/* /.card-body */}
        </div>
        {/* /.card */}
      </div>
    </div>
  )
}