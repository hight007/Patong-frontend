import React, { Component , useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'
import ContentHeader from "../../Main/ContentHeader/ContentHeader";
import LoadingScreen from "../../Main/LoadingScreen";

export default function Icons() {
  const [isLoad, setisLoad] = useState(false)

  const renderIcon = () => {
    const iconsList = Object.keys(iconsModule);
    return iconsList.map(icon => (
      <div className="col-sm-2" style={{ border: 'solid', borderRadius: 10 }}>
        <FontAwesomeIcon style={{ marginRight: 5 }} icon={iconsModule[icon]} />
        <p>{icon}</p>
      </div>
    ))

  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="ไอค่อนที่มีให้เลือกใช้" />
      <section className="content ">
        {/* {renderModalCreateUser()} */}
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            <div className="col-md-12" style={{ textAlign: "center" }}>
              <div className="card card-dark">
                <div className="card-header ">
                </div>
                <div className="card-body">
                  <div className="row">
                    {renderIcon()}

                  </div>
                </div>
                <div className="card-footer">

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

