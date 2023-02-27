import React, { useEffect, useState } from "react";
import ContentHeader from "../../Main/ContentHeader/ContentHeader";
import Modal from 'react-modal';
import LoadingScreen from "../../Main/LoadingScreen";
import Swal from "sweetalert2";
import { httpClient } from "../../../utils/HttpClient";
import { apiName, key, OK } from "../../../constants";
import MaterialReactTable from 'material-react-table';
import moment from "moment";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'

export default function Area() {

  const [isLoad, setisLoad] = useState(false)
  const [isCreate, setisCreate] = useState(true)

  const [areas, setareas] = useState([])
  const [users, setusers] = useState([])

  const [modalIsOpen, setmodalIsOpen] = useState(false)

  const [area_id, setarea_id] = useState('')
  const [area, setarea] = useState('')
  const [zone, setzone] = useState('')
  const [description, setdescription] = useState('')

  useEffect(() => {
    doGetUsers()
    doGetAreas()
  }, [])

  const columns = [
    {
      header: 'จัดการ',
      accessorKey: 'area_id',
      Cell: ({ cell, row }) => (
        <>
          <button style={{ marginRight: 5 }} className="btn btn-danger" onClick={(e) => {
            e.preventDefault()
            doRemoveArea(cell.getValue(), row.original.area)
          }
          }>
            <FontAwesomeIcon icon={iconsModule.faTrashAlt} />
          </button>
          <button className="btn btn-warning" onClick={async (e) => {
            e.preventDefault()
            setarea_id(cell.getValue())
            setisCreate(false)
            setisLoad(true)
            const targetArea = await httpClient.get(apiName.areas.area + `One/area_id=${cell.getValue() }`)
            setStateForEdit(targetArea.data.result)
            setisLoad(false)
            openModal()
          }
          }>
            <FontAwesomeIcon icon={iconsModule.faEdit} />
          </button>

        </>
      )
    },
    {
      header: 'พื้นที่',
      accessorKey: 'area', //simple accessorKey pointing to flat data
    },
    {
      header: 'โซน',
      accessorKey: 'zone', //simple accessorKey pointing to flat data
    },
    {
      header: 'รายละเอียดพื้นที่',
      accessorKey: 'description', //simple accessorKey pointing to flat data
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

  const setStateForEdit = (targetArea) => {
    setarea(targetArea.area)
    setzone(targetArea.zone)
    setdescription(targetArea.description)
  }

  const closeModal = () => {
    setmodalIsOpen(false)
    setarea('')
    setzone('')
    setdescription('')
  }

  const openModal = () => {
    setmodalIsOpen(true)
  }

  const doGetAreas = async () => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.areas.area)
      if (response.data.api_result === OK) {
        setareas(response.data.result)
      }
    } catch (error) {

    } finally {
      setisLoad(false)
    }
  }

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

  const doCreateArea = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเพิ่มพื้นที่ ${area} `,
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
          const result = await httpClient.post(apiName.areas.area, { area, zone, description, createdBy: localStorage.getItem(key.user_id) ?? 1 })
          setisLoad(false)
          if (result.data.api_result == OK) {
            doGetAreas()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มพื้นที่ ${area} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เพิ่มพื้นที่ ${area} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  const doUpdateArea = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการแก้ไข ${area} `,
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
          const result = await httpClient.patch(apiName.areas.area, { area_id, area, zone, description, updatedBy: localStorage.getItem(key.user_id) ?? 1 })
          setisLoad(false)
          if (result.data.api_result == OK) {
            doGetAreas()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `แก้ไขพื้นที่ ${area} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `แก้ไขพื้นที่ ${area} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  const doRemoveArea = (area_id, _area) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการลบ ${_area} `,
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
          const result = await httpClient.delete(apiName.areas.area, { data : {area_id} })
          setisLoad(false)
          if (result.data.api_result == OK) {
            doGetAreas()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `ลบพื้นที่ ${_area} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `ลบพื้นที่ ${_area} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  const renderModalArea = () => {
    return <Modal
      isOpen={modalIsOpen}
      style={{
        content: {
          transform: 'translate(0%, 0%)',
          overlfow: 'scroll' // <-- This tells the modal to scrol
        },
      }}
      className="content-wrapper resizeable"
    >
      <div className="row" style={{ margin: '5%', marginTop: '15%', padding: '0%', backgroundColor: 'rgba(0,0,0,0)', overflow: 'auto' }}>
        <div className="col-sm-12" >

          <div className="card card-dark bg-main2">
            <div className="card-header">
              <h3 class="card-title">{isCreate ? 'เพิ่มพื้นที่ใหม่' : 'แก้ไขพื้นที่'}</h3>
              <div class="card-tools">
                <button type="button" class="btn btn-tool" onClick={(e) => {
                  closeModal();
                }}><i className="fas fa-times" />

                </button>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              isCreate ? doCreateArea() : doUpdateArea()
            }}>
              <div className="card-body row">
                <div className="col-sm-12" style={{ textAlign: 'center' }}>
                  <img
                    src="/img/Patong_bg.jpg"
                    alt="spectrumPro Logo"

                    style={{ opacity: "1", width: "15%", borderRadius: '50%', padding: 5, backgroundColor: 'black' }}
                  />
                  <hr />
                </div>
                <div className="form-group col-sm-12">
                  <label >ชื่อพื้นที่</label>
                  <input value={area} onChange={(e) => setarea(e.target.value)} required className="form-control" placeholder="กรอกชื่อพื้นที่" />
                </div>
                <div className="form-group col-sm-12">
                  <label >ชื่อโซน</label>
                  <input value={zone} onChange={(e) => setzone(e.target.value)} className="form-control" placeholder="กรอกชื่อโซน" />
                </div>
                <div className="form-group col-sm-12">
                  <label >รายละเอียดพื้นที่</label>
                  <textarea value={description} onChange={(e) => setdescription(e.target.value)} rows={4} className="form-control" placeholder="กรอกรายละเอียดพื้นที่" />
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-dark">ตกลง</button>
                <button type="reset" onClick={() => closeModal()} className="btn btn-default float-right">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  }

  const renderAreas = () => {
    if (areas.length > 0) {
      
      return <MaterialReactTable
        columns={columns}
        data={areas}
        enableColumnOrdering
        enableRowSelection
        enableStickyHeader
        enableStickyFooter
        renderTopToolbarCustomActions={({ table }) => {
          let selectdItem = _.map(table.getSelectedRowModel().rows, 'original')
          return (
            <div >
              <button
                disabled={
                  // (!table.getIsSomeRowsSelected() || selectdItem.length > 7) && (!table.getIsAllRowsSelected())
                  selectdItem.length > 0 ? false : true
                }
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault()
                  handlePrint(table.getSelectedRowModel().rows)
                }}
              >
                <i className="fas fa-print" style={{ marginRight: 10 }} />
                พิมพ์ QR CODE พื้นที่
              </button>
            </div>
          )
        }}
      />
    }
  }

  const handlePrint = (data) => {
    const _data = _.map(data, 'original');
    const _data_ = _.map(_data, 'area_id');
    window.open('/Master/Area/PrintArea/' + JSON.stringify(_data_), '_blank');
  }


  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="จัดการพื้นที่" />
      <section className="content ">
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            <div className="col-md-12" style={{ textAlign: "center" }}>
              <div className="card card-dark">
                <div className="card-header ">
                  <button className="btn btn-dark" onClick={() => {
                    setisCreate(true)
                    openModal()
                  }}>
                    <FontAwesomeIcon style={{ marginRight: 5 }} icon={iconsModule.faStoreAlt} />
                    เพื่มพื้นที่ใหม่
                  </button>
                </div>
                <div className="card-body">
                  {renderModalArea()}
                  {renderAreas()}

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

