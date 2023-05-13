import React, { useEffect, useMemo, useState } from 'react'
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SummaryStockTracking() {
  const [isLoad, setisLoad] = useState(false)
  const [tableData, settableData] = useState([])
  const [chartData, setchartData] = useState([])

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    doGetReportData()
  }, [startDate, endDate])

  //Action
  const doGetReportData = async () => {
    try {
      if (startDate != null && endDate != null) {
        setisLoad(true)
        const response = await httpClient.get(`${apiName.report.summaryStockTracking}/dateFrom=${moment(startDate).format('YYYYMMDD')}&dateTo=${moment(endDate).format('YYYYMMDD')}`)
        if (response.data.api_result === OK) {
          const pivoted = {};
          for (const item of response.data.result) {
            const { productId, spec, productName, status, quantity } = item;
            if (!pivoted[productName]) {
              pivoted[productName] = { productId, productName , spec };
            }
            pivoted[productName][status] = quantity;
          }
          settableData(Object.values(pivoted))
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false)
    }
  }
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  //Render
  const renderOptions = () => {
    return (
      <div className="col-md-12 ">
        <div className='card card-dark'>
          <div className='card-header'></div>
          <div className='card-body'>
            <div className="form-group col-sm-6">
              <label>เลือกวันที่</label>
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                showMonthDropdown
                inline
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  const renderSumamryStockTracking = useMemo(() => {
    const renderSumamryStockTrackingTable = () => {
      const columns = [
        {
          header: 'ชนิดสินค้า',
          accessorKey: 'productName', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => <a href={`/Report/StockDetail/${row.original.productId}`} target="_blank">{cell.getValue()}</a>
        },
        {
          header: 'สเปค',
          accessorKey: 'spec', //simple accessorKey pointing to flat data
        },
        {
          header: 'จำนวนที่รับ',
          accessorKey: 'recieved', //simple accessorKey pointing to flat data
        },
        {
          header: 'จำนวนที่จ่าย',
          accessorKey: 'issued', //simple accessorKey pointing to flat data
        },
        {
          header: 'จำนวนที่คืน',
          accessorKey: 'return', //simple accessorKey pointing to flat data
        },
        {
          header: 'จำนวนที่ตัดออกจากระบบ',
          accessorKey: 'cutoff', //simple accessorKey pointing to flat data
        },
        {
          header: 'บาลานซ์',
          accessorKey: 'productName', //simple accessorKey pointing to flat data
          Cell: ({ cell, row }) => ((row.original.recieved ?? 0) + (row.original.return ?? 0) - (row.original.issued ?? 0) - (row.original.cutoff ?? 0))
        },
      ]

      if (tableData.length > 0) {
        return (
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enableColumnOrdering
            enableStickyHeader
            enableStickyFooter
          />
        )
      }
    }

    return (
      <>
        <div className="col-md-12">
          <div className="card card-dark">
            <div className="card-header"></div>
            <div className="card-body">
              {renderSumamryStockTrackingTable()}
            </div>
          </div>

        </div>
      </>
    )
  }, [tableData])

  return (
    <div className="content-wrapper resizeable">
      <ContentHeader header="รายงานสรุปกิจกรรมสต๊อก" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            {renderOptions()}
            {renderSumamryStockTracking}

          </div>
        </div>
      </section>
    </div>
  )
}
