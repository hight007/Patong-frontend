import React, { useState, useEffect, useRef } from 'react'
import ContentHeader from '../../Main/ContentHeader/ContentHeader'
import LoadingScreen from '../../Main/LoadingScreen'
import CryptoJS from 'crypto-js';
import { apiName, key, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import Swal from 'sweetalert2';

export default function Receive() {
  const [isLoad, setisLoad] = useState(false)
  const [area, setarea] = useState('')
  const [qrCode, setqrCode] = useState('')

  const [areaList, setareaList] = useState([])

  const refQrCode = useRef(null);
  const refArea = useRef(null);

  useEffect(() => {
    doGetAreas()
    refQrCode.current.focus();
  }, [])


  //Action
  const decryptQrCode = async (_qrCode) => {
    const bytes = CryptoJS.AES.decrypt(qrCode, localStorage.getItem(key.secretKey))
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
  }
  const doRecieveStock = async () => {
    try {
      // const area_id = await findAreaId(area)
      const area_qr = JSON.parse(area)
      const {area_id} = area_qr
      const area_name = area_qr.area
      const stockName = await decryptQrCode(qrCode)

      if (area_id == null) {
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: `ไม่เจอพื้นที่ ${area_name} ในระบบ`,
        }).then(() => resetInput())
      } else {

        const stockNameDecrypt = stockName.split('|')
        const productId = stockNameDecrypt[0]
        const total_quantity = stockNameDecrypt[2]
        const quantity = stockNameDecrypt[2]
        const status = 'recieved'

        //show product id detail
        const productResult = await httpClient.get(apiName.products.product + `One/productId=${productId}`)

        //Set product isOrdered to 0
        await httpClient.patch(apiName.products.product, { productId, isOrdered: 0 })

        //do stock recieved
        setisLoad(true)
        const result = await httpClient.post(apiName.stocks.stock, { stockName, qrCode, productId, area_id, total_quantity, quantity, status, createdBy: localStorage.getItem(key.user_id) ?? 1 })
        if (result.data.api_result === OK) {
          const stockId = result.data.result.stockId
          await httpClient.post(apiName.stocks.StocksTracking, { stockId, area_id, quantity, status, createdBy: localStorage.getItem(key.user_id) ?? 1 })
          Swal.fire({
            icon: 'success',
            title: `รับ Stock ${stockName} สำเร็จ`,
            timer: 1000,
            text: `ชนิดสินค้า : ${productResult.data.result.productType} , ชื่อสินค้า : ${productResult.data.result.productName} , สเปค : ${productResult.data.result.spec}`
          }).then(() => resetInput())
        } else {
          // const findByStockName = await httpClient.get(apiName.stock.get + '/findByStockName', { stockName })
          const findByStockName = await httpClient.get(apiName.stocks.findByStockName + '/stockName=' + stockName,)
          if (findByStockName.data.result.stockName === stockName) {
            Swal.fire({
              icon: 'warning',
              title: 'ล้มเหลว',
              text: `สต๊อก ${stockName} ได้รับเข้าระบบไปแล้ว`
            }).then(() => resetInput())
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `รับ Stock ${stockName} ล้มเหลว`
            }).then(() => resetInput())
          }


        }

      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ล้มเหลว',
        text: `รับ qrCode ${qrCode} ล้มเหลว`,
      }).then(() => resetInput())
      console.log(error);
    } finally {
      setisLoad(false)
    }


  }
  const doGetAreas = async () => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.areas.area)
      if (response.data.api_result === OK) {
        setareaList(response.data.result)
      }
    } catch (error) {

    } finally {
      setisLoad(false)
    }
  }
  const resetInput = async () => {
    setarea('')
    setqrCode('')
  }
  const findAreaId = async (_area) => {
    const filterArea = areaList.filter((item) => item.area === _area)
    return filterArea[0]?.area_id
  }

  //render
  const renderStockReceive = () => {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        doRecieveStock()
        refQrCode.current.focus();

      }} className="col-md-12" style={{ textAlign: "center" }}>
        <div className="card row card-warning">

          <div className="card-header ">

          </div>
          <div className="card-body ">
            <div className="form-group col-sm-12">
              <label >สแกนรับสินค้า</label>
              <input ref={refQrCode} value={qrCode} onChange={(e) => setqrCode(e.target.value)} required className="form-control" placeholder="สแกน QR code" />
            </div>
            <div className="form-group col-sm-12">
              <label >สแกนพื้นที่</label>
              <input ref={refArea} value={area} onChange={(e) => {
                setarea(e.target.value)

              }} required className="form-control" placeholder="สแกนพื้นที่" />
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className="content-wrapper resizeable">
      <ContentHeader header="รับสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            {renderStockReceive()}
          </div>
        </div>
      </section>
    </div>
  )
}
