import React, { Component, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import ContentHeader from '../../../Main/ContentHeader/ContentHeader'
import ReactToPrint from 'react-to-print';
import Swal from "sweetalert2";
import { httpClient } from "../../../../utils/HttpClient";
import { apiName, key, OK } from "../../../../constants";
import './PrintArea.css'
import moment from 'moment/moment';
import LoadingScreen from '../../../Main/LoadingScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import { json, useParams } from "react-router-dom";

export default function PrintArea() {
  const [isLoad, setisLoad] = useState(false)
  const [listArea, setlistArea] = useState([])
  // const [dimensions, setDimensions] = React.useState({ width: 100, height: 30 });
  const [printWidth, setprintWidth] = useState(100)
  const [printHeight, setprintHeight] = useState(30)

  const params = useParams();
  const componentRef = useRef(null);

  useEffect(() => {
    doGetAreaData()
  }, [])

  const doGetAreaData = async () => {
    const { list_area_id } = params
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.areas.area + `Print/area_id=${list_area_id}`)

      if (response.data.api_result === OK) {
        setlistArea(response.data.result)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="ปริ้นใบพื้นที่" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header bg-main">

                </div>

                <div className="card-body row">
                  <div className="form-group col-sm-6">
                    <label >กว้าง (mm)</label>
                    <input type="number" value={printWidth} onChange={(e) => setprintWidth(e.target.value)} required className="form-control" placeholder="กรอกชื่อพื้นที่" />
                  </div>
                  <div className="form-group col-sm-6">
                    <label >ยาว (mm)</label>
                    <input type="number" value={printHeight} onChange={(e) => setprintHeight(e.target.value)} required className="form-control" placeholder="กรอกชื่อพื้นที่" />
                  </div>
                  <ReactToPrint
                    trigger={() => <button className="btn btn-warning">สั่งพิมพ์ใบพื้นที่</button>}
                    content={() => componentRef.current}
                    pageStyle={`@page {
                                  size: ${printWidth}mm ${printHeight}mm !important;
                                  margin: 0;
                              }`}
                  />
                  <hr></hr>
                  <ComponentToPrint
                    listArea={listArea}
                    ref={componentRef} />
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

class ComponentToPrint extends Component {
  render() {


    const renderContent = () => {
      const data = this.props.listArea

      if (data) {
        return data.map((item, index) => (
          <>
            <div className="col-md-12 row" style={{ margin: 10 }}>
              <div className="col-md-2">
                <QRCode
                  size={128}
                  value={JSON.stringify({ area: item.area, area_id: item.area_id })}
                />
              </div>
              <div className="col-md-10 row">
                <h3 className="col-md-12">Area : {item.area}</h3>
                <h3 className="col-md-12">Zone : {item.zone}</h3>
                <h5 className="col-md-12">Description : {item.description}</h5>
              </div>

            </div>
            <div className="page-break" />
          </>
        )
        )
      }
    }

    return (
      <div>
        <div className="page">
          <div className="subpage">
            <div className="row" >
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}