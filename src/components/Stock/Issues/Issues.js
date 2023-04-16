import React, { useEffect, useRef, useState } from 'react'
import { apiName, key, OK } from '../../../constants'
import { httpClient } from '../../../utils/HttpClient'
import ContentHeader from '../../Main/ContentHeader/ContentHeader'
import LoadingScreen from '../../Main/LoadingScreen'
import Select from 'react-select';
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js';

export default function Issues() {
  const [isLoad, setisLoad] = useState(false)

  const [products, setproducts] = useState([])
  const [selectedProduct, setselectedProduct] = useState(null)
  const [stocksByProduct, setstocksByProduct] = useState([])
  const [totalStockQty, settotalStockQty] = useState(0)
  const [users, setusers] = useState([])

  const [qrCode, setqrCode] = useState('')
  const [issueQuantity, setissueQuantity] = useState(0)

  const refQrCode = useRef(null);
  const refIssuesQuantity = useRef(null);

  useEffect(() => {
    doGetUsers()
    doGetProducts()
    refQrCode.current.focus()
  }, [])


  //user
  const doGetUsers = async () => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.users.user)
      if (response.data.api_result === OK) {
        setusers(response.data.result)
      }
    } catch (error) {

    } finally {
      setisLoad(false)
    }
  }
  const findUser = (user) => {
    if (users.length > 0 && user != null) {
      const createdUser = _.find(users, { user_id: user })
      return createdUser.username
    } else {
      return ''
    }

  }

  //Action
  const decryptQrCode = async (_qrCode) => {
    const bytes = CryptoJS.AES.decrypt(qrCode, localStorage.getItem(key.secretKey))
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
  }
  const doGetProducts = async () => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.products.product)
      if (response.data.api_result === OK) {
        const dropDownResult = response.data.result.map((item) => ({ value: item, label: item.productName + '(' + item.description + ')' }))
        await setproducts(dropDownResult)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doGetStockByProducts = async (productId) => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.stocks.findByProductId + '/productId=' + productId)
      if (response.data.api_result === OK) {
        setstocksByProduct(response.data.result)
        settotalStockQty(response.data.totalQty)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doIssueStock = async (stockName, findByStockName) => {
    try {
      //check stock status
      const quantity = findByStockName.data.result.quantity - (issueQuantity == 0 ? 1 : issueQuantity)
      let status = "issued"
      if (quantity > 0) {
        status = "recieved"
      }


      if (quantity < 0) {
        Swal.fire({
          icon: 'error',
          title: `จำนวนงานติดลบ จ่ายสต๊อกไม่ได้`,
        })
        return
      }

      if (findByStockName.data.result.stockName === stockName && ["recieved", "moved"].includes(findByStockName.data.result.status)) {
        Swal.fire({
          title: `ต้องการจ่ายสต๊อก ${stockName} ?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
          if (result.isConfirmed) {
            setisLoad(true)
            //do stock recieved
            const result = await httpClient.patch(apiName.stocks.stock, { stockId: findByStockName.data.result.stockId, quantity, status, updatedBy: localStorage.getItem(key.user_id) ?? 1 })
            if (result.data.api_result === OK) {
              await httpClient.post(apiName.stocks.StocksTracking, { stockId: findByStockName.data.result.stockId, area_id: findByStockName.data.result.area_id, quantity, status, createdBy: localStorage.getItem(key.user_id) ?? 1 })
              doGetStockByProducts(findByStockName.data.result.productId)
              Swal.fire({
                icon: 'success',
                title: `จ่าย Stock ${stockName} สำเร็จ`,
                text: ``
              }).then(() => doReset(''))
            } else {
              Swal.fire({
                icon: 'error',
                title: 'ล้มเหลว',
                text: `จ่าย Stock ${stockName} ล้มเหลว`
              }).then(() => doReset(''))
            }
            setisLoad(false)
          }
        })
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'ล้มเหลว',
          text: `สต๊อก ${stockName} สถานะไม่ถูกต้อง`
        })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const doReset = () => {
    setqrCode('')
    setissueQuantity(0)
  }
  const doFindProducts = (productId) => {
    if (products.length > 0) {
      return (products.filter((item) => item.value.productId === productId))[0].value
    }
  }

  //render
  const renderFindProduct = () => {
    if (products.length > 0) {
      return (
        <div className="col-md-12">
          <div className="card card-dark">
            <div className="card-header"></div>
            <div className="card-body">
              <div className="form-group col-sm-12">
                <label >ค้นหาสินค้า</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable={false}
                  isSearchable={true}
                  options={products}
                  onChange={(data) => {
                    doGetStockByProducts(data.value.productId)
                    setselectedProduct(data.value)
                    refQrCode.current.focus()
                  }}
                />
              </div>
            </div>
            <hr></hr>
            <div className="card-body">
              {renderSelectedProduct()}
              <hr></hr>
              {renderStockByProduct()}
            </div>

          </div>
        </div>
      )
    }

  }
  const renderStockByProduct = () => {
    if (stocksByProduct.length > 0) {
      const columns = [
        {
          header: 'ชื่อสต๊อก',
          accessorKey: 'stockName', //simple accessorKey pointing to flat data
        },
        {
          header: 'ที่อยู่ของสต๊อก',
          accessorKey: 'tbArea', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => cell.getValue().area
        },
        {
          header: 'จำนวนงานทั้งหมด',
          accessorKey: 'total_quantity', //simple accessorKey pointing to flat data
        },
        {
          header: 'จำนวนงานที่มี',
          accessorKey: 'quantity', //simple accessorKey pointing to flat data
        },
        {
          header: 'สร้างโดย',
          accessorKey: 'createdBy', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => findUser(cell.getValue())
        },
        {
          header: 'วันที่สร้าง',
          accessorKey: 'createdAt', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss")
        },
        {
          header: 'แก้ไขโดย',
          accessorKey: 'updatedBy', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => findUser(cell.getValue())
        },
        {
          header: 'วันที่แก้ไขล่าสุด',
          accessorKey: 'updatedAt', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss")
        },
      ]
      return (
        <div className="row" style={{ marginTop: 10 }}>

          <div className="col-md-12">
            <MaterialReactTable
              columns={columns}
              data={stocksByProduct}
              enableColumnOrdering
              enableStickyHeader
              enableStickyFooter
            />
          </div>

        </div>
      )
    }
  }
  const renderSelectedProduct = () => {
    // stocksByProduct.length > 0
    if (selectedProduct) {
      return (
        <div className="row">
          <div className='col-md-3'>
            <label>ชื่อสินค้า : {selectedProduct.productName}</label>
          </div>
          <div className='col-md-3'>
            <label>ชนิดสินค้า : {selectedProduct.productType}</label>
          </div>
          <div className='col-md-6'>
            <label>สเปค : {selectedProduct.spec}</label>
          </div>
          <div className='col-md-3'>
            <label>จำนวนงานในสต๊อก : {totalStockQty ? totalStockQty : 0}</label>
          </div>
          <div className='col-md-3'>
            <label>จำนวนงานที่ต้องแจ้งเตือน : {selectedProduct.alertQuantity}</label>
          </div>
          <div className='col-md-6'>
            <label style={{ color: 'red' }}>{selectedProduct.alertQuantity > totalStockQty ? 'กรุณาสั่งงานเพิ่ม' : ''}</label>
          </div>
          <div className='col-md-6'>
            <label>รายละเอียด : {selectedProduct.detail}</label>
          </div>
          <div className='col-md-6'>
            <label>คำอธิบาย : {selectedProduct.description}</label>
          </div>

        </div>

      )
    }
  }
  const renderStockIsseus = () => {
    return (
      <div className="col-md-12">
        <form className="card card-warning" onSubmit={async (e) => {
          e.preventDefault();
          try {
            setisLoad(true)
            const stockName = await decryptQrCode(qrCode)

            const findByStockName = await httpClient.get(apiName.stocks.findByStockName + '/stockName=' + stockName,)
            if (findByStockName.data.api_result === OK) {
              if (findByStockName.data.result.stockName === stockName) {
                await doGetStockByProducts(findByStockName.data.result.productId)
                console.log(doFindProducts(findByStockName.data.result.productId));
                setselectedProduct(doFindProducts(findByStockName.data.result.productId))
                console.log(products);
                if (findByStockName.data.result.quantity > 1 && issueQuantity == 0) {
                  Swal.fire({
                    icon: 'warning',
                    title: `กรุณาใส่จำนวนที่จ่ายสต๊อก`,
                  }).then(() => refIssuesQuantity.current.focus())
                  return
                }
                doIssueStock(stockName, findByStockName)
              } else {
                Swal.fire({
                  icon: 'error',
                  title: `หาสต๊อกไม่พบ`,
                }).then(() => doReset())
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: `หาสต๊อกไม่ได้`,
              }).then(() => doReset())
            }
          } catch (error) {
            console.log(error);
          } finally {
            setisLoad(false)
          }
        }}>
          <div className="card-header"></div>
          <div className="card-body">
            <div className="form-group col-sm-12">
              <label >จ่ายสต๊อก</label>
              <input value={qrCode} onChange={(e) => setqrCode(e.target.value)
              } required ref={refQrCode} className="form-control" placeholder="สแกน QR code" />
            </div>
            <div className="form-group col-sm-12">
              <label >จำนวนที่จ่ายสต๊อก(สำหรับสต๊อกที่มีจำนวนมากกว่าหนึ่งตัว)</label>
              <input value={issueQuantity} onChange={(e) => setissueQuantity(e.target.value)
              } required ref={refIssuesQuantity} className="form-control" />
            </div>
          </div>
          <div className="card-footer">
            <button type='submit' className="btn btn-default" >จ่ายสต๊อก</button>
            <button type='reset' className="btn btn-default float-right" >ยกเลิก</button>
          </div>
        </form>
      </div >
    )
  }

  return (
    <div className="content-wrapper resizeable">
      <ContentHeader header="จ่ายสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            {renderStockIsseus()}
            {renderFindProduct()}

          </div>
        </div>
      </section>
    </div>
  )
}
