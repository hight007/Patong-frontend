import React, { Component, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import ContentHeader from '../../../Main/ContentHeader/ContentHeader'
import ReactToPrint from 'react-to-print';
import { httpClient } from "../../../../utils/HttpClient";
import { apiName, key, OK } from "../../../../constants";
import './PrintProduct.css'
import moment from 'moment/moment';
import LoadingScreen from '../../../Main/LoadingScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import { useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';

export default function PrintProduct() {
  const [isLoad, setisLoad] = useState(false)
  const [product, setproduct] = useState(null)
  const [dataToPrint, setdataToPrint] = useState([])
  const [quantity, setquantity] = useState(0)
  // const [dimensions, setDimensions] = React.useState({ width: 100, height: 30 });
  const [printWidth, setprintWidth] = useState(100)
  const [printHeight, setprintHeight] = useState(30)

  const params = useParams();
  const componentRef = useRef(null);

  useEffect(() => {
    doGetProduct()
    debounceSearch()
  }, [])

  const renderQrCodeByQuantity = async (e) => {
    if (e.target.value !== '') {
      setisLoad(true)
      setquantity(e.target.value)
      let result = [];
      for (let index = 0; index < e.target.value; index++) {
        result.push({
          productId: product.productId,
          productName: product.productName,
          spec: product.spec,
          detail: product.detail,
          description: product.description,
          serialNumber: [product.productId, product.runningSN + index + 1, localStorage.getItem(key.user_id) ?? 1, product.default_total_quantity].join('|'),
          generateBy: localStorage.getItem(key.user_id) ?? 1
        })
      }
      setdataToPrint(result)
      setisLoad(false)
    }
  }

  const debounceSearch = _.debounce(renderQrCodeByQuantity, 500);

  const quantityChanged = async (e) => {
    e.persist();
    await doGetProduct()
    debounceSearch(e);
  };

  const doGetProduct = async () => {
    const { productId } = params
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.products.product + `Print/productId=${productId}`)
      console.log(response.data.result);
      if (response.data.api_result === OK) {
        await setproduct(response.data.result)
        return
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
      return
    }
  }

  const doPrintManage = async () => {
    if (product != null && quantity > 0) {
      await httpClient.patch(apiName.products.product, {
        productId: product.productId,
        runningSN: parseInt(quantity) + parseInt(product.runningSN)
      })
    }

  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="????????????????????????????????????" />
      <LoadingScreen isLoad={isLoad} />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header bg-main">

                </div>

                <div className="card-body row">
                  <div className="form-group col-sm-4">
                    <label >??????????????? (????????????)</label>
                    <input type="number" onChange={(e) => quantityChanged(e)} min={1} required className="form-control" />
                  </div>
                  <div className="form-group col-sm-4">
                    <label >??????????????? (mm)</label>
                    <input type="number" value={printWidth} onChange={(e) => setprintWidth(e.target.value)} required className="form-control" placeholder="?????????????????????????????????????????????" />
                  </div>
                  <div className="form-group col-sm-4">
                    <label >????????? (mm)</label>
                    <input type="number" value={printHeight} onChange={(e) => setprintHeight(e.target.value)} required className="form-control" placeholder="?????????????????????????????????????????????" />
                  </div>

                  <ReactToPrint
                    trigger={() => <div className="form-group col-sm-12"><button className="btn btn-warning">????????????????????????????????????????????????</button></div>}
                    content={() => {
                      doPrintManage()
                      return componentRef.current
                    }}
                    pageStyle={`@page {
                                  size: ${printWidth}mm ${printHeight}mm !important;
                                  margin: 0;
                              }`}
                  />
                  <hr></hr>
                  <ComponentToPrint
                    dataToPrint={dataToPrint}
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
      const data = this.props.dataToPrint
      const secretKey = localStorage.getItem(key.secretKey)
      if (data) {
        return data.map((item, index) => (
          <>
            <div className="col-md-12 row" style={{ margin: 10 }}>
              <div className="col-md-2">
                <QRCode
                  size={128}
                  value={CryptoJS.AES.encrypt(item.serialNumber, secretKey).toString()}
                />
                <label style={{ fontSize: 0.1 }} className="col-md-12">
                  {CryptoJS.AES.encrypt(item.serialNumber, secretKey).toString()}
                </label>
              </div>
              <div className="col-md-10 row">
                <h4 className="col-md-12">??????????????????????????? : {item.serialNumber} </h4>
                <h5 className="col-md-12">?????????????????????????????? : {item.productName}</h5>
                <h5 className="col-md-12">???????????? : {item.spec}</h5>
                <h6 className="col-md-12">?????????????????? : {moment().format('DD/MM/YYYY')}</h6>

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
          <div className="row" >
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }
}