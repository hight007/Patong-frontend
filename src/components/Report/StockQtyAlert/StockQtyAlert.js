import React, { useEffect, useState } from 'react'
import ContentHeader from '../../Main/ContentHeader/ContentHeader'
import LoadingScreen from '../../Main/LoadingScreen'
import Chart from "react-apexcharts";
import { apiName, key, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';
import Swal from 'sweetalert2';


export default function StockQtyAlert() {
  const [isLoad, setisLoad] = useState(false)

  const [productTypeDropDown, setproductTypeDropDown] = useState([])
  const [productType, setproductType] = useState(0)

  const [stockAlertQty, setstockAlertQty] = useState([])

  const [chartLabel, setchartLabel] = useState([])
  const [chartData, setchartData] = useState([])
  const [chartTarget, setchartTarget] = useState([])

  useEffect(() => {
    getSugressionsProductTypeList()
    getStockByProduct(0)
  }, [])

  //Action
  const getSugressionsProductTypeList = async () => {
    const response = await httpClient.get(apiName.products.sugressionProductType)
    const defaultDropDown = [{ value: 0, label: 'ทั้งหมด' }]
    const dropDownResult = [...defaultDropDown, ...response.data.result.map((item) => ({ value: item.productType, label: item.productType }))]
    response.data.api_result === OK ? setproductTypeDropDown(dropDownResult) : setproductTypeDropDown([])
  }
  const getStockByProduct = async (productType) => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.report.productAndStockQty + '/productType=' + productType)
      if (response.data.api_result === OK) {
        console.log(response.data.result);
        let stockAlertQtyData = []
        response.data.result.forEach(item => {
          console.log(item.isOrdered);
          stockAlertQtyData.push({ ...item, isAlert: item.isOrdered ? 0 : item.alertQuantity >= item.total_quantity ? 1 : 0})
        });

        setstockAlertQty(stockAlertQtyData)

        console.log(response.data.result.map((item) => item.total_quantity));
        setchartLabel(response.data.result.map((item) => item.productName))
        setchartData(response.data.result.map((item) => item.total_quantity))
        setchartTarget(response.data.result.map((item) => item.alertQuantity))
      }
    } catch (error) {

    } finally {
      setisLoad(false)
    }
  }
  const doSetIsOrdered = async (productId, productName , isOrdered) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `สั่งสินค้าไปแล้ว ต้องการ${isOrdered === 0 ? 'เปิด' : 'ปิด'}แจ้งเตือน ${productName} ?`,
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
          const result = await httpClient.patch(apiName.products.product, { productId, isOrdered  , updatedBy: localStorage.getItem(key.user_id) ?? 1 })
          setisLoad(false)
          if (result.data.api_result == OK) {
            getStockByProduct(productType)
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `ปิดแจ้งเตือน ${productName} สำเร็จ`
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `ปิดแจ้งเตือน ${productName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  //render
  const renderFliter = () => {
    return (
      <div className="form-group col-sm-12">
        <label >เลือกชนิดสินค้า</label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isClearable={false}
          isSearchable={true}
          options={productTypeDropDown}
          onChange={(data) => {
            console.log(data);
            setproductType(data.value)
            getStockByProduct(data.value)
          }}
        />
      </div>
    )
  }
  const renderStockByProductTable = () => {
    return (
      <MaterialReactTable
        columns={columns}
        data={stockAlertQty}
        enableColumnOrdering
        enableStickyHeader
        enableStickyFooter
      />
    )
  }
  const renderStockAlertQty = () => {
    return (
      <div className=" col-sm-12">
        <div className="card card-dark">
          <div className="card-header"></div>
          <div className="card-body">
            {renderFliter()}
          </div>
          <div className="card-body">
            {renderStockByProductChart()}
          </div>
          <div className="card-body">
            {renderStockByProductTable()}
          </div>
          <div className="card-footer"></div>
        </div>
      </div>
    )
  }
  const renderStockByProductChart = () => {
    return (
      <div className="mixed-chart">
        <Chart
          options={{
            chart: {
              id: "basic-bar2",
              type: 'line',
            },
            stroke: {
              width: [0, 4]
            },
            xaxis: {
              categories: chartLabel
            },
            colors: ['#008FFB','#FF0000']
          }}
          series={[
            {
              name: "quantity",
              data: chartData,
              type: 'column',
            },
            {
              name: "target",
              data: chartTarget,
              type: 'line',
              
            }
          ]}
          type="bar"
        // width="800"
        height="500"
        />
      </div>
    )
  }

  //column
  const columns = [
    {
      header : 'แจ้งเตือน',
      accessorKey : 'isAlert',
      Cell: ({ cell, row }) => (
        <>
          <button onClick={() => {
            doSetIsOrdered(row.original.productId, row.original.productName, cell.getValue() === 0 ?  0 : 1)
          }} className={cell.getValue() === 0 ? 'btn btn-danger' : 'btn btn-success'}>{cell.getValue() === 0 ? <FontAwesomeIcon icon={iconsModule.faBellSlash} /> : <FontAwesomeIcon icon={iconsModule.faBell} />}</button>
        </>
      )
    },
    {
      header: 'ชนิดสินค้า',
      accessorKey: 'productType', //simple accessorKey pointing to flat data
    },
    {
      header: 'ชื่อสินค้า',
      accessorKey: 'productName', //simple accessorKey pointing to flat data
    },
    {
      header: 'จำนวนสต๊อก',
      accessorKey: 'total_quantity', //simple accessorKey pointing to flat data
      Cell: ({ cell, row }) => row.original.alertQuantity >= cell.getValue() && !row.original.isOrdered ? <b style={{ color: 'red' }}>{cell.getValue()}</b> : cell.getValue()
    },
    {
      header: 'จำนวนสินค้าต่อเลขสต๊อก',
      accessorKey: 'default_total_quantity', //simple accessorKey pointing to flat data
    },
    {
      header: 'จำนวนที่ต้องแจ้งเตือน',
      accessorKey: 'alertQuantity', //simple accessorKey pointing to flat data
    },
    {
      header: 'สเปค',
      accessorKey: 'spec', //simple accessorKey pointing to flat data
    },
    {
      header: 'รายละเอียด',
      accessorKey: 'detail', //simple accessorKey pointing to flat data
    },
    {
      header: 'คำอธิบาย',
      accessorKey: 'description', //simple accessorKey pointing to flat data
    },

  ]


  return (
    <div className="content-wrapper resizeable">
      <ContentHeader header="รายงานสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            {renderStockAlertQty()}

          </div>
        </div>
      </section>
    </div>
  )
}
