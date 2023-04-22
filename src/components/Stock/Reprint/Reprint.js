import React, { Component, useEffect, useRef, useState } from "react";
import ContentHeader from "../../Main/ContentHeader/ContentHeader";
import Modal from 'react-modal';
import LoadingScreen from "../../Main/LoadingScreen";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import { apiName, apiUrl, key, OK } from "../../../constants";
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import ReactToPrint from 'react-to-print';
// import CryptoJS from 'crypto-js';

export default function Reprint() {
  const params = useParams();
  const componentRef = useRef(null);

  const [isLoad, setisLoad] = useState(false)

  const [stockData, setstockData] = useState([])

  const [printWidth, setprintWidth] = useState(60)
  const [printHeight, setprintHeight] = useState(30)

  useEffect(() => {
    doGetStockData()
  }, [])


  const doGetStockData = async () => {
    const { stockId } = params
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.stocks.reprint + `/stockId=${stockId}`)

      console.log(response.data);
      if (response.data.api_result === OK) {
        setstockData(response.data.result)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="ปริ้น QR Code สต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header ">

                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="form-group col-sm-4">
                      <label >กว้าง (mm)</label>
                      <input type="number" value={printWidth} onChange={(e) => setprintWidth(e.target.value)} required className="form-control" placeholder="กรอกชื่อพื้นที่" />
                    </div>
                    <div className="form-group col-sm-4">
                      <label >ยาว (mm)</label>
                      <input type="number" value={printHeight} onChange={(e) => setprintHeight(e.target.value)} required className="form-control" placeholder="กรอกชื่อพื้นที่" />
                    </div>
                  </div>

                  <div>
                    <ReactToPrint
                      trigger={() => <div className="form-group col-sm-12"><button className="btn btn-warning">สั่งพิมพ์ใบสต๊อก</button></div>}
                      content={() => {
                        // doPrintManage()
                        return componentRef.current
                      }}
                      pageStyle={`@page {
                                  size: ${printWidth}mm ${printHeight}mm !important;
                                  margin: 0;
                              }`}
                    />
                  </div>

                  <hr></hr>
                  <ComponentToPrint
                    dataToPrint={stockData}
                    ref={componentRef} />
                </div>
                <div className="card-body">
                  {/* {renderStockByProduct()} */}
                </div>
                <div className="card-footer"></div>
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
      const data = this.props.dataToPrint
      const secretKey = localStorage.getItem(key.secretKey)
      if (data) {
        return data.map((item, index) => (
          <>
            <div className="col-md-12 row" style={{ margin: 10 }}>
              <div className="col-md-1">
                <QRCode
                  size={64}
                  value={item.qrCode}
                />
                <label style={{ fontSize: 0.1 }} className="col-md-12">
                  {/* {CryptoJS.AES.encrypt(item.serialNumber, secretKey).toString()} */}
                </label>
              </div>
              <div className="col-md-11 row">
                <h5 className="col-md-12">เลขสินค้า : {item.stockName} </h5>
                <h8 className="col-md-12">ชื่อสินค้า : {item.tbProduct.productName}</h8>
                <h8 className="col-md-12">สเปค : {item.tbProduct.spec}</h8>
                <h8 className="col-md-12">วันที่ : {moment().format('DD/MM/YYYY')}</h8>

              </div>
            </div>
            <div className="page-break" />
          </>
        )
        )
      }
    }

    return (
      <div className="page col-sm-12">
        <div className="subpage">
          <div className="row">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }
}