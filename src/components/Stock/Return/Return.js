import React, { useState, useEffect, useRef, useMemo } from 'react'
import ContentHeader from '../../Main/ContentHeader/ContentHeader'
import LoadingScreen from '../../Main/LoadingScreen'
import CryptoJS from 'crypto-js';
import { apiName, key, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import Swal from 'sweetalert2';

export default function Return() {
  const [isLoad, setisLoad] = useState(false)

  const [qrCode, setqrCode] = useState('')
  const [stockData, setstockData] = useState(null)
  const [quantity, setquantity] = useState(0)

  const refQrCode = useRef(null);
  const refQuantity = useRef(null);


  //Action
  const decryptQrCode = async (qrCode) => {
    const bytes = CryptoJS.AES.decrypt(qrCode, localStorage.getItem(key.secretKey))
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
  }
  const doGetStockData = async (qrCode) => {
    const stockName = await decryptQrCode(qrCode)
    if (stockName.includes('|')) {
      const findByStockName = await httpClient.get(apiName.stocks.findByStockName + '/stockName=' + stockName,)
      if (findByStockName.data.api_result === OK) {
        setstockData(findByStockName.data.result)
      }
    }
  }
  const doReturnStock = async () => {
    try {
      if (parseFloat(stockData.quantity) + parseFloat(quantity) > parseFloat(stockData.total_quantity)) {
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: `จำนวนที่คืน Stock ${stockData.stockName} ไม่ถูกต้อง`
        }).then(() => doReset())
        return
      }
      if (stockData == null || qrCode === '') {
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: `สต๊อกไม่มีในระบบ`
        }).then(() => doReset())
      } else {
        const status = 'recieved'
        const trackingStatus = 'return'

        setisLoad(true)
        if (stockData.status === 'recieved' || stockData.status === 'moved' || stockData.status === 'issued') {
          //do stock return
          const result = await httpClient.patch(apiName.stocks.stock, { stockId: stockData.stockId, status, quantity: parseFloat(stockData.quantity) + parseFloat(quantity), updatedBy: localStorage.getItem(key.user_id) ?? 1 })
          if (result.data.api_result === OK) {
            await httpClient.post(apiName.stocks.StocksTracking, { stockId: stockData.stockId, area_id: stockData.area_id, quantity: parseFloat(quantity), status: trackingStatus, createdBy: localStorage.getItem(key.user_id) ?? 1 })
            Swal.fire({
              icon: 'success',
              title: `คืน Stock ${stockData.stockName} สำเร็จ`,
            }).then(() => doReset())
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `คืน Stock ${stockData.stockName} ล้มเหลว`
            }).then(() => doReset())
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'ล้มเหลว',
            text: `สถานะ Stock ${stockData.stockName} ไม่ถูกต้อง`
          }).then(() => doReset())
          return
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ล้มเหลว',
        text: `รับ qrCode ${qrCode} ล้มเหลว`
      }).then(() => doReset())
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doReset = () => {
    stockData(null)
    setqrCode('')
    setquantity(0)
  }

  //render
  const renderStockReturn = () => {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        doReturnStock()
        refQrCode.current.focus();

      }} className="col-md-12" style={{ textAlign: "center" }}>
        <div className="card row card-warning">

          <div className="card-header ">

          </div>
          <div className="card-body ">
            <div className="form-group col-sm-12">
              <label >สแกนสต๊อก</label>
              <input ref={refQrCode} value={qrCode} onChange={(e) => {
                setqrCode(e.target.value)
                doGetStockData(e.target.value)

              }
              } required className="form-control" placeholder="สแกน QR code" />
            </div>
            <div className="form-group col-sm-12">
              <label >จำนวนที่คืน</label>
              <input type='number' ref={refQuantity} value={quantity} onChange={(e) => {
                setquantity(e.target.value)

              }} required className="form-control" placeholder="จำนวนที่คืน" />
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    )
  }
  const renderStockData = useMemo(() => {
    if (stockData) {
      return (
        <div className="col-md-12 card card-primary">
          <div className="card-body row">
            <div className="form-group col-sm-4">
              <label >ชื่อสต๊อก : {stockData.stockName}</label>
            </div>
            <div className="form-group col-sm-4">
              <label >จำนวนที่มี : {stockData.quantity}</label>
            </div>
            <div className="form-group col-sm-4">
              <label >จำนวนเต็ม : {stockData.total_quantity}</label>
            </div>
          </div>
        </div>
      )
    }

  }, [stockData])

  return (
    <div className="content-wrapper resizeable">
      <ContentHeader header="ย้ายสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            {renderStockReturn()}
            {renderStockData}
          </div>
        </div>
      </section>
    </div>
  )
}

