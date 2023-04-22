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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as iconsModule from '@fortawesome/free-solid-svg-icons'

export default function Product() {
  const [isLoad, setisLoad] = useState(false)
  const [isCreate, setisCreate] = useState(true)
  const [showActive, setshowActive] = useState(true)

  const [products_, setproducts_] = useState([])
  const [products, setproducts] = useState([])
  const [users, setusers] = useState([])

  const [modalIsOpen, setmodalIsOpen] = useState(false)
  const [sugressionsProductTypeList, setsugressionsProductTypeList] = useState([])

  const [productId, setproductId] = useState('')
  const [productName, setproductName] = useState('')
  const [productType, setproductType] = useState('')
  const [spec, setspec] = useState('')
  const [detail, setdetail] = useState('')
  const [description, setdescription] = useState('')
  const [alertQuantity, setalertQuantity] = useState(0)
  const [default_total_quantity, setdefault_total_quantity] = useState(1)
  const [sample_image, setsample_image] = useState(null)

  useEffect(() => {
    doGetUsers()
    doGetProducts()
  }, [])

  const columns = [
    {
      header: 'จัดการ',
      accessorKey: 'productId',
      Cell: ({ cell, row }) => (
        <>
          <button style={{ marginRight: 5 }} className="btn btn-warning" onClick={async (e) => {
            e.preventDefault()
            setisCreate(false)
            setisLoad(true)
            setproductId(cell.getValue())
            const productResult = await httpClient.get(apiName.products.product + `One/productId=${cell.getValue()}`)
            setStateForEdit(productResult.data.result)
            setisLoad(false)
            openModal()
          }
          }>
            <FontAwesomeIcon icon={iconsModule.faEdit} />
          </button>
          <button style={{ marginRight: 5 }} className="btn btn-dark" onClick={(e) => {
            e.preventDefault()
            window.open('/Master/Products/PrintProduct/' + cell.getValue(), '_blank');
          }
          }>
            <FontAwesomeIcon icon={iconsModule.faPrint} />
          </button>

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
    {
      header: 'จำนวนที่ต้องแจ้งเตือน',
      accessorKey: 'alertQuantity', //simple accessorKey pointing to flat data
    },
    {
      header: 'จำนวนสินค้าต่อเลขสต๊อก',
      accessorKey: 'default_total_quantity', //simple accessorKey pointing to flat data
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
    {
      header: 'สถานะ',
      accessorKey: 'isActive',
      Cell: ({ cell, row }) => (
        <>
          <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
            <input onClick={() => doSetActive(row.original.productId, row.original.productName, !cell.getValue())} type="checkbox" className="custom-control-input" id={`customSwitch${row.original.productId}`} checked={cell.getValue()} />
            <label class="custom-control-label" for={`customSwitch${row.original.productId}`}>{cell.getValue() ? 'เปิด' : 'ปิด'}</label>
          </div>

        </>
      )
    },

  ]
  const setStateForEdit = (productResult) => {
    setproductName(productResult.productName)
    setproductType(productResult.productType)
    setspec(productResult.spec)
    setdetail(productResult.detail)
    setdescription(productResult.description)
    setalertQuantity(productResult.alertQuantity)
    setdefault_total_quantity(productResult.default_total_quantity)
    setsample_image(null)
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
      return createdUser.username
    } else {
      return ''
    }

  }

  //Modal
  const openModal = () => {
    setmodalIsOpen(true)
    getSugressionsProductTypeList()
  }
  const closeModal = () => {
    setmodalIsOpen(false)
    setproductName('')
    setproductType('')
    setspec('')
    setdetail('')
    setdescription('')
    setalertQuantity(0)
    setdefault_total_quantity(1)
    setsample_image(null)
  }

  //Product
  const doGetProducts = async () => {
    try {
      setisLoad(true)
      const response = await httpClient.get(apiName.products.product)
      if (response.data.api_result === OK) {
        await setproducts_(response.data.result)
        setProductsByActive(response.data.result, showActive)
      }
    } catch (error) {

    } finally {
      setisLoad(false)
    }
  }
  const doCreate = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการเพิ่มสินค้า ${productName} `,
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
          const result = await httpClient.post(apiName.products.product, { productName, productType, spec, detail, description, alertQuantity, default_total_quantity, createdBy: localStorage.getItem(key.user_id) ?? 1 })
          doPatchSampleImage(result.data.result.productId)
          setisLoad(false)
          if (result.data.api_result === OK) {
            doGetProducts()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `เพิ่มสินค้า ${productName} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `เพิ่มสินค้า ${productName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }
  const doUpdate = () => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการแก้ไข ${productName} `,
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
          const result = await httpClient.patch(apiName.products.product, { productId, productName, productType, spec, detail, description, alertQuantity, default_total_quantity, updatedBy: localStorage.getItem(key.user_id) ?? 1 })
          doPatchSampleImage(productId)
          setisLoad(false)
          if (result.data.api_result == OK) {
            doGetProducts()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `แก้ไขสินค้า ${productName} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `แก้ไขสินค้า ${productName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }
  const doSetActive = (_productId, _productName, isActive) => {
    Swal.fire({
      title: 'โปรดยืนยัน',
      text: `ต้องการ${isActive ? 'เปิด' : 'ปิด'}การใช้งาน ${_productName} `,
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
          const result = await httpClient.patch(apiName.products.product, { productId: _productId, isActive, updatedBy: localStorage.getItem(key.user_id) ?? 1 })
          setisLoad(false)
          if (result.data.api_result == OK) {
            doGetProducts()
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: `${isActive ? 'เปิด' : 'ปิด'}การใช้งาน ${_productName} สำเร็จ`
            }).then(() => closeModal());
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ล้มเหลว',
              text: `${isActive ? 'เปิด' : 'ปิด'}การใช้งาน ${_productName} ล้มเหลว`
            })
          }
        } catch (error) {
          console.log(error);
          setisLoad(false)
        }

      }
    })
  }
  const setProductsByActive = (data, active) => {
    setproducts(data.filter(item => item.isActive === active))
    // setproducts(data)
  }

  //sample Image
  const doPatchSampleImage = async (_productId) => {
    if (sample_image){
      const imageConversion = require("image-conversion")
    let formData = new FormData();
    await imageConversion.compressAccurately(sample_image, {
      size: 500,    //The compressed image size is 100kb
      accuracy: 1,
      scale: 1,
    }).then(async img => {
      await formData.append("productId", _productId);
      await formData.append("image", img);

      await httpClient.patch(apiName.products.image, formData)
    })
    }
    
  }

  //Render
  const getSugressionsProductTypeList = async () => {
    const result = await httpClient.get(apiName.products.sugressionProductType)
    console.log(result);
    result.data.api_result === OK ? setsugressionsProductTypeList(result.data.result) : setsugressionsProductTypeList([])
  }
  const renderModalProduct = () => {
    const renderSugressionsProductType = () => {
      return sugressionsProductTypeList.map((item) => <option value={item.productType} />);
    };

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
              <h3 class="card-title">{isCreate ? 'เพิ่มสินค้าใหม่' : 'แก้ไขสินค้า'}</h3>
              <div class="card-tools">
                <button type="button" class="btn btn-tool" onClick={(e) => {
                  closeModal();
                }}><i className="fas fa-times" />

                </button>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              isCreate ? doCreate() : doUpdate()
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
                  <label >ชื่อสินค้า</label>
                  <input value={productName} onChange={(e) => setproductName(e.target.value)} required className="form-control" placeholder="กรอกชื่อสินค้า" />
                </div>
                <div className="form-group col-sm-12">
                  <datalist id="sugressionProductType">{renderSugressionsProductType()}</datalist>
                  <label >ชนิดสินค้า</label>
                  <input list="sugressionProductType" value={productType} onChange={(e) => setproductType(e.target.value)} className="form-control" placeholder="กรอกชนิดสินค้า" />
                </div>
                <div className="form-group col-sm-12">
                  <label >สเปคสินค้า</label>
                  <textarea value={spec} onChange={(e) => setspec(e.target.value)} rows={1} className="form-control" placeholder="กรอกสเปคสินค้า" />
                </div>
                <div className="form-group col-sm-12">
                  <label >รายละเอียดสินค้า</label>
                  <textarea value={detail} onChange={(e) => setdetail(e.target.value)} rows={2} className="form-control" placeholder="กรอกรายละเอียดสินค้า" />
                </div>
                <div className="form-group col-sm-12">
                  <label >คำอธิบายสินค้า</label>
                  <textarea value={description} onChange={(e) => setdescription(e.target.value)} rows={3} className="form-control" placeholder="กรอกคำอธิบายสินค้า" />
                </div>
                <div className="form-group col-sm-12">
                  <label >แจ้งเตือนจำนวนสินค้าเมื่อถึงจำนวนที่กำหนด</label>
                  <input value={alertQuantity} type="number" onChange={(e) => setalertQuantity(e.target.value)} className="form-control" />
                </div>
                <div className="form-group col-sm-12">
                  <label >จำนวนสินค้าต่อเลขสต๊อก</label>
                  <input value={default_total_quantity} type="number" onChange={(e) => setdefault_total_quantity(e.target.value)} className="form-control" />
                </div>
                <div className="form-group col-sm-12">
                  <label >รูปภาพตัวอย่างสินค้า</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input type="file" accept='image/*' className="custom-file-input" id="inputSampleImage" onChange={(e) => {
                        console.log(e.target.files[0]);
                        setsample_image(e.target.files[0])
                        }} />
                      <label className="custom-file-label" htmlFor="inputSampleImage">{sample_image ? sample_image.name : 'เลือกรูป...'}</label>
                    </div>
                  </div>
                </div>
                <div className="form-group col-sm-12" style={{ textAlign: 'center' }}>
                  <img style={{ width: '20em', objectFit: 'cover' , }} src={`${apiUrl}${apiName.authen.image}/productId=${productId}`} />
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
  const renderProducts = () => {
    if (products.length > 0) {

      return <MaterialReactTable
        columns={columns}
        data={products}
        enableColumnOrdering
        enableStickyHeader
        enableStickyFooter
      />
    }
  }
  const renderActive = () => {
    return (
      <>

        <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
          <label style={{ marginRight: 50 }}>แสดงสินค้าที่เปิดการใช้งาน </label>
          <input onClick={() => {
            setshowActive(!showActive)
            setProductsByActive(products_, !showActive)
          }} type="checkbox" className="custom-control-input" id={`customSwitchActive`} checked={showActive} />
          <label class="custom-control-label" for={`customSwitchActive`}>{showActive ? 'เปิด' : 'ปิด'}</label>
        </div>
      </>
    )
  }

  return (
    <div className="content-wrapper resizeable bg-main2">
      <ContentHeader header="จัดการสินค้า" />
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
                    <FontAwesomeIcon style={{ marginRight: 5 }} icon={iconsModule.faBox} />
                    เพิ่มสินค้าใหม่
                  </button>
                </div>
                <div className="card-body">
                  {renderActive()}
                  {renderModalProduct()}
                  {renderProducts()}

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
