import React, { useEffect, useState } from "react";
import ContentHeader from "../../Main/ContentHeader/ContentHeader";
import Modal from 'react-modal';
import LoadingScreen from "../../Main/LoadingScreen";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import { apiName, apiUrl, key, OK } from "../../../constants";
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import { useParams } from "react-router-dom";

export default function StockTracking() {
  const params = useParams();

  const [isLoad, setisLoad] = useState(false)

  const [users, setusers] = useState([])

  const [stockTracking, setstockTracking] = useState([])

  useEffect(() => {
    doGetUsers()
    getStockTracking()
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
      if (createdUser.username) {
        return createdUser.username
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  //Action
  const getStockTracking = async () => {
    try {
      setisLoad(true)
      const { stockId } = params
      const response = await httpClient.get(apiName.stocks.StocksTracking + '/stockId=' + stockId)
      if (response.data.api_result === OK) {
        setstockTracking(response.data.result)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }

  //Render
  const renderStockTracking = () => {
    if (stockTracking.length > 0) {
      const columns = [
        {
          header: 'ชื่อสต๊อก',
          accessorKey: 'tbStock', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => cell.getValue() ? cell.getValue().stockName : ''
        },
        {
          header: 'สถานะ',
          accessorKey: 'status', //simple accessorKey pointing to flat data
        },
        {
          header: 'ที่อยู่ของสต๊อก',
          accessorKey: 'tbArea', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => cell.getValue() ? cell.getValue().area : ''
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
              data={stockTracking}
              enableColumnOrdering
              enableStickyHeader
              enableStickyFooter
            />
          </div>

        </div>
      )
    }
  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="รายงาน การติดตาม(Tracking)สต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header ">

                </div>
                <div className="card-body">
                  {renderStockTracking()}
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
