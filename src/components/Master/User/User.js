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

export default function User() {

  const [isLoad, setisLoad] = useState(false)

  const [users, setusers] = useState([])

  const [modalIsOpen, setmodalIsOpen] = useState(false)
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const [confirmpassword, setconfirmpassword] = useState('')
  const [user_level, setuser_level] = useState('normal')

  const columns = [
    {
      header: 'จัดการ',
      accessorKey: 'user_id',
      Cell: ({ cell, row }) => (
        row.original.user_level  != 'admin' ? <button className="btn btn-danger" onClick={(e) => {
          e.preventDefault()
          doRemoveUser(cell.getValue(), row.original.username)
        } 
        }>
          <FontAwesomeIcon icon={iconsModule.faTrashAlt} />
        </button> : <></>
      )
    },
    {
      header: 'ชื่อผู้ใช้งาน',
      accessorKey: 'username', //simple accessorKey pointing to flat data
    },
    {
      header: 'ระดับผู้ใช้งาน',
      accessorKey: 'user_level', //simple accessorKey pointing to flat data
      Cell: ({ cell, row }) => <><select
        disabled={row.original.user_level == 'admin' ? true : false}
        class="form-control"
        value={cell.getValue()}
        onChange={(e) => {
          updateUserLevel(row.original.user_id, row.original.username, e.target.value)
        }}
      >
        <option value="normal">ธรรมดา</option>
        <option value="power">ขั้นสูง</option>
        {cell.getValue() == 'admin' ? <option disabled value="admin">แอดมิน</option> : <></>}
      </select>
      </>
    },
    {
      header: 'เพิ่มสมาชิคโดย',
      accessorKey: 'createdBy', //simple accessorKey pointing to flat data
      Cell: ({ cell, row }) => findUser(cell.getValue())
    },
    {
      header: 'ลงชื่อเข้าใช้ล่าสุด',
      accessorKey: 'lastLogOn', //simple accessorKey pointing to flat data
      Cell: ({ cell, row }) => cell.getValue() ? moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss") : 'ยังไม่ได้ลงชื่อเข้าใช้งาน'
    },
    {
      header: 'วันที่สมัครสมาชิค',
      accessorKey: 'createdAt', //simple accessorKey pointing to flat data
      Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss")
    },
    {
      header: 'วันที่แก้ไขล่าสุด',
      accessorKey: 'updatedAt', //simple accessorKey pointing to flat data
      Cell: ({ cell, row }) => moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss")
    },
  ]



  useEffect(() => {
    doGetUsers()
  }, [])


  const closeModal = () => {
    setmodalIsOpen(false)
    setusername('')
    setpassword('')
    setconfirmpassword('')
    setuser_level('normal')
  }

  const openModal = () => {
    setmodalIsOpen(true)
  }

  const renderModalCreateUser = () => {
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
              <h3 class="card-title">เพิ่มผู้ใช้งานใหม่</h3>
              <div class="card-tools">
                <button type="button" class="btn btn-tool" onClick={(e) => {
                  closeModal();
                }}><i className="fas fa-times" />

                </button>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              doCreateUser()
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
                  <label >ชื่อผู้ใช้งาน</label>
                  <input value={username} onChange={(e) => setusername(e.target.value)} required minLength={6} className="form-control" placeholder="กรอกชื่อผู้ใช้งาน" />
                </div>
                <div className="form-group col-sm-12">
                  <label >รหัสผ่าน</label>
                  <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" required minLength={6} className="form-control" placeholder="ใส่รหัสผ่าน" />
                </div>
                <div className="form-group col-sm-12">
                  <label >ยืนยันรหัสผ่าน</label>
                  <input value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} type="password" required minLength={6} className="form-control" placeholder="ยืนยันรหัสผ่าน" />
                </div>
                <div className="form-group col-sm-12">
                  <label >ระดับผู้ใช้งาน</label>
                  <select value={user_level} onChange={(e) => setuser_level(e.target.value)} required class="form-control">
                    <option value="normal">ธรรมดา</option>
                    <option value="power">ขั้นสูง</option>
                  </select>
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

  const doCreateUser = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเพิ่มผู้ใช้งาน ${username} ในระดับ ${user_level == 'normal' ? 'ธรรมดา' : 'ขั้นสูง'}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (password != confirmpassword) {
          Swal.fire({
            icon: 'error',
            title: 'ล้มเหลว',
            text: `ยืนยันรหัสผ่านไม่ถูกต้อง`
          })
          return
        }
        try {
          setisLoad(true)
          const result = await httpClient.post(apiName.users.user, { username, password, user_level, createdBy: localStorage.getItem(key.user_id) ?? 1 })
          setisLoad(false)
          if (result.data.api_result == OK) {
            doGetUsers()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มผู้ใช้งาน ${username} ในระดับ ${user_level == 'normal' ? 'ธรรมดา' : 'ขั้นสูง'} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เพิ่มผู้ใช้งาน ${username} ในระดับ ${user_level == 'normal' ? 'ธรรมดา' : 'ขั้นสูง'} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
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

  const renderUsers = () => {
    if (users.length > 0) {
      return <MaterialReactTable
        columns={columns}
        data={users}
        enableColumnOrdering
      />
    }
  }

  const findUser = (createdBy) => {
    if (users.length > 0) {
      const createdUser = _.find(users, { user_id: createdBy })
      return createdUser.username
    } else {
      return ''
    }

  }

  const updateUserLevel = async (user_id, username, new_user_level) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเปลี่ยน ${username} เป็นระดับ ${new_user_level == 'normal' ? 'ธรรมดา' : 'ขั้นสูง'}`,
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
          const result = await httpClient.patch(apiName.users.user, { user_id, username, user_level: new_user_level })
          setisLoad(false)
          if (result.data.api_result === OK) {
            doGetUsers()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เปลี่ยนผู้ใช้งาน ${username} เป็นระดับ ${new_user_level == 'normal' ? 'ธรรมดา' : 'ขั้นสูง'} สำเร็จ`
            }).then(() => doGetUsers());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เปลี่ยนผู้ใช้งาน ${username} เป็นระดับ ${new_user_level == 'normal' ? 'ธรรมดา' : 'ขั้นสูง'} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  const doRemoveUser = (user_id, username) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการลบผู้ใช้งาน ${username}?`,
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
          const result = await httpClient.delete(apiName.users.user, { data: { user_id } })
          setisLoad(false)
          if (result.data.api_result === OK) {
            doGetUsers()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `ลบผู้ใช้งาน ${username} สำเร็จ`
            }).then(() => doGetUsers());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `ลบผู้ใช้งาน ${username} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="จัดการผู้ใช้งาน" />
      <section className="content ">
        {renderModalCreateUser()}
        <div className="container-fluid">
          <LoadingScreen isLoad={isLoad} />
          <div className="row" style={{ minHeight: '100%' }}>
            <div className="col-md-12" style={{ textAlign: "center" }}>
              <div className="card card-dark">
                <div className="card-header ">
                  <button className="btn btn-dark" onClick={() => { openModal() }}>
                    <FontAwesomeIcon style={{ marginRight: 5 }} icon={iconsModule.faUserPlus} />
                    เพื่มผู้ใช้งานใหม่
                  </button>
                </div>
                <div className="card-body">
                  {renderUsers()}
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
