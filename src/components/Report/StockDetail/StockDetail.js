import React, { useEffect, useState } from "react";
import ContentHeader from "../../Main/ContentHeader/ContentHeader";
import LoadingScreen from "../../Main/LoadingScreen";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import { apiName, apiUrl, key, OK } from "../../../constants";
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import Select from 'react-select';
import { useParams } from "react-router-dom";

export default function StockDetail() {
  const [isLoad, setisLoad] = useState(false)
  const [showActive, setshowActive] = useState(true)

  const [products, setproducts] = useState([])
  const [users, setusers] = useState([])
  const [stocksByProduct, setstocksByProduct] = useState([])

  const [selectedItem, setselectedItem] = useState(null)

  const params = useParams();

  useEffect(() => {
    doGetUsers()
    doGetProducts()
  }, [])

  //Action
  const doGetProducts = async () => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.products.product)
      if (response.data.api_result === OK) {
        const dropDownResult = response.data.result.map((item) => ({ value: item, label: item.productName + '(' + item.description + ') {' + item.spec + '}' }))

        //if have product name
        const { productId } = params
        if (productId) {
          doGetStockByProducts(parseInt(productId))
          //find productId
          const productData = dropDownResult.filter(item => item.value.productId === parseInt(productId))
          if (productData.length > 0) {
            console.log(productData);
            setselectedItem(productData)
          }
          //
        }
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
      const response = await httpClient.get(apiName.stocks.findAllByProductId + '/productId=' + productId)
      if (response.data.api_result === OK) {
        setstocksByProduct(response.data.result)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const handlePrint = (data) => {
    const _data = _.map(data, 'original');
    const _data_ = _.map(_data, 'stockId');
    window.open('/stock/RePrintStock/' + JSON.stringify(_data_), '_blank');
  }
  const doPatchStockStatus = (stockId, stockName, status, statusName, area_id, quantity, productId) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเปลี่ยนสถานะ ${stockName} เป็น "${statusName}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setisLoad(true)
          const result = await httpClient.patch(apiName.stocks.stock, { stockId, status, updatedBy: localStorage.getItem(key.user_id) ?? 1 })
          await httpClient.post(apiName.stocks.StocksTracking, { stockId, area_id, quantity, status, createdBy: localStorage.getItem(key.user_id) ?? 1 })

          setisLoad(false)
          if (result.data.api_result === OK) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เปลี่ยนสถานะ ${stockName} เป็น ${statusName} สำเร็จ`
            }).then(() => doGetStockByProducts(productId));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เปลี่ยนสถานะ ${stockName} เป็น ${statusName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

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
      if (createdUser.username) {
        return createdUser.username
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  //render
  const renderFindProduct = () => {
    if (products.length > 0) {
      return (
        <div className="form-group">
          <label >ค้นหาสินค้า</label>
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            className="basic-single"
            classNamePrefix="select"
            isClearable={false}
            isSearchable={true}
            options={products}
            defaultValue={selectedItem}
            onChange={(data) => {

              doGetStockByProducts(data.value.productId)
            }}
          />
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
          Cell: ({ cell, row }) => <a href={`/Report/StockTracking/${row.original.stockId}`} target="_blank" rel="noreferrer">{cell.getValue()}</a>
        },
        {
          header: 'สถานะ',
          accessorKey: 'status', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => <><select
            class="form-control"
            value={cell.getValue()}
            onChange={(e) => {
              doPatchStockStatus(row.original.stockId, row.original.stockName, e.target.value, e.target.options[e.target.selectedIndex].label, row.original.tbArea.area_id, row.original.quantity, row.original.productId)
            }}
          >
            <option value="issued">จ่ายออก</option>
            {/* <option value="moved">ย้าย</option> */}
            <option value="recieved">รับเข้า</option>
            <option value="cutoff">ตัดออกจากระบบ</option>
          </select>
          </>
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
              enableRowSelection
              renderTopToolbarCustomActions={({ table }) => {
                let selectdItem = _.map(table.getSelectedRowModel().rows, 'original')
                return (
                  <div >
                    <button
                      disabled={
                        selectdItem.length > 0 ? false : true
                      }
                      className="btn btn-warning"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePrint(table.getSelectedRowModel().rows)
                      }}
                    >
                      <i className="fas fa-print" style={{ marginRight: 10 }} />
                      พิมพ์ QR CODE สต๊อก
                    </button>
                  </div>
                )
              }}
            />
          </div>

        </div>
      )
    }
  }
  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="รายงาน รายละเอียดสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header ">

                </div>
                <div className="card-body">
                  {renderFindProduct()}
                </div>
                <div className="card-body">
                  {renderStockByProduct()}
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
