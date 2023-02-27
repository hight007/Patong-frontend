import React, { useState, useEffect, useRef } from 'react'
import ContentHeader from '../../Main/ContentHeader/ContentHeader'
import LoadingScreen from '../../Main/LoadingScreen'
import CryptoJS from 'crypto-js';
import { key } from '../../../constants';

export default function Receive() {
  const [isLoad, setisLoad] = useState(false)
  const [area, setarea] = useState('')
  const [qrCode, setqrCode] = useState('')

  const refQrCode = useRef(null);
  const refArea = useRef(null);

  useEffect(() => {
    refQrCode.current.focus();
  }, [])



  const decryptQrCode = async () => {
    const bytes = CryptoJS.AES.decrypt(qrCode, localStorage.getItem(key.secretKey))
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
  }

  const doRecieveStock = async () => {
    
    alert(await decryptQrCode())
    resetInput()
  }

  const resetInput = async () => {
    setarea('')
    setqrCode('')
  }

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
              <input ref={refArea} value={area} onChange={(e) => setarea(e.target.value)} required className="form-control" placeholder="สแกนพื้นที่" />
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
