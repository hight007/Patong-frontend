import React, { useEffect, useState } from 'react'
import ContentHeader from '../../Main/ContentHeader/ContentHeader'
import LoadingScreen from '../../Main/LoadingScreen'
import Chart from "react-apexcharts";
import { apiName, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';

export default function Stock() {
  const [isLoad, setisLoad] = useState(false)

  const [stockByProduct, setstockByProduct] = useState([])
  const [productTypeDropDown, setproductTypeDropDown] = useState([])

  const [chartLabel, setchartLabel] = useState([])
  const [chartData, setchartData] = useState([])

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
      const response = await httpClient.get(apiName.report.stockByProduct + '/productType=' + productType)
      if (response.data.api_result === OK) {
        console.log(response.data.result);
        setstockByProduct(response.data.result.map((item) => ({
          quantity: item.remain_quantity,
          productName: item.tbProduct.productName,
          productType: item.tbProduct.productType,
          alertQuantity: item.tbProduct.alertQuantity,
          default_total_quantity: item.tbProduct.default_total_quantity,
          description: item.tbProduct.description,
          spec: item.tbProduct.spec,
          detail: item.tbProduct.detail,
          isOrdered: item.tbProduct.isOrdered,
        })))
        setchartLabel(response.data.result.map((item) => item.tbProduct.productName))
        setchartData(response.data.result.map((item) => item.remain_quantity))
      }
    } catch (error) {

    } finally {
      setisLoad(false)
    }
  }

  //render
  const renderStockByProduct = () => {
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
              getStockByProduct(data.value)
            }}
          />
        </div>
      )
    }
    const renderStockByProductChart = () => {
      return (
        <div className="mixed-chart">
          <Chart
            options={{
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: chartLabel
              }
            }}
            series={[
              {
                name: "series-1",
                data: chartData
              }
            ]}
            type="bar"
          height="500"
          />
        </div>
      )
    }
    const renderStockByProductTable = () => {
      return (
        <MaterialReactTable
          columns={columns}
          data={stockByProduct}
          enableColumnOrdering
          enableStickyHeader
          enableStickyFooter
        />
      )
    }

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
  const columns = [
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
      accessorKey: 'quantity', //simple accessorKey pointing to flat data
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
      <ContentHeader header="รานงานสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            {renderStockByProduct()}

          </div>
        </div>
      </section>
    </div>
  )
}
