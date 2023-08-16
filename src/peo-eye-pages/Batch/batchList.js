import React, { useEffect, useState, useRef, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../components/Common/TableContainer"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Label,
  Input, FormFeedback, ModalHeader, ModalBody, Badge, Table, ModalFooter, Modal
} from "reactstrap"
import * as Yup from "yup"
import { Formik, useFormik, Field, Form } from "formik"

import {
  Name,
  Status,
  StartDate,
  EndDate
} from "./batchCol"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"

import {
  getUsers as onGetUsers,
  deleteUser as onDeleteUser
} from "store/contacts/actions"
import { isEmpty } from "lodash"

//redux
import { useSelector, useDispatch } from "react-redux"
import ReportService from "../../peo-eye-services/ReportService"
import AgentService from "../../peo-eye-services/AgentService"
import moment from "moment/moment"
import AdminService from "../../peo-eye-services/AdminService"
import Swal from "sweetalert2"
import Flatpickr from "react-flatpickr"
import BatchService from "../../peo-eye-services/BatchService"
import Dropzone from "react-dropzone"
import small from "../../assets/images/small/img-2.jpg"

const BatchManagement = ({ dataColors }) => {
  const [payments, setPayments] = useState([])
  const [modal1, setModal1] = useState(false)
  // date
  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let current_date = `${year}-${month}-${day}`
  const [currentDate, setDate] = useState(current_date);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [batchImage, setBatchImage] = useState({});

  //meta title
  document.title = "Batch Management | Peo Eye Admin Panel"

  const [error, setError] = useState(null)

  //get all payments
  useEffect(() => {
    //console.log(moment("2021-07-14T00:00:00.000Z").utc().format("YYYY-MM-DD"));
    retrieveBatches();

  }, [])

  //get all batch images
  useEffect(() => {
    retrieveBatchImage();

  }, [])
  const update = async (batchData) => {
    await BatchService.addNewBatch(batchData).then(agent => {
      console.log(agent , 'response data');
      Swal.close();
      Swal.fire(
        "Successfully Updated!",
        "",
        "success"
      )
      retrieveBatches();
    }).catch(e => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    })
  }
  const options = {
    title: "Call Status",
    is3D: true
  }
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [batches, setBatches] = useState([])
  const [batch, setBatch] = useState(null)
  const toggleViewModal = () => setModal1(!modal1)
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        filterable: true,
        Cell: cellProps => {
          return <Name {...cellProps} />
        }
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        filterable: true,
        Cell: cellProps => {
          return <StartDate {...cellProps} />
        }
      },
      {
        Header: "End Date",
        accessor: "end_date",
        filterable: true,
        Cell: cellProps => {
          return <EndDate {...cellProps} />
        }
      },
      {
        Header: " Current Status",
        accessor: "status",
        filterable: false,
        Cell: cellProps => {
          return <Status {...cellProps} />
        }
      },
      /*{
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: cellProps => {
          return <Status {...cellProps} />
        }
      },*/
      {
        Header: "Change Status",
        accessor: "view",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <Button
              type="button"
              color={cellProps.row.original.status===1 ? 'danger' : 'success'}
              className="btn-sm btn-rounded"
              onClick={() => {
                // loading
                Swal.fire({
                  title: 'Please Wait !',
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  imageUrl: "loader.gif",
                  onOpen: () => {
                    Swal.showLoading()
                  },
                })
                const batchData = cellProps.row.original;
                BatchService.changeStatus(batchData).then(agent => {
                  console.log(agent , 'edited batch');
                  Swal.close();
                  if (agent.status===0){
                    Swal.fire(
                      "Successfully Updated!",
                      "",
                      "success"
                    )
                  }
                  else{
                    Swal.fire(
                      "Successfully Updated!",
                      "",
                      "success"
                    )
                  }
                  retrieveBatches();
                }).catch(e => {
                  Swal.close();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                  })
                })
                console.log(batchData);
              }}
            >
              {cellProps.row.original.status===0 ? 'Activate' : 'Deactivate'}
            </Button>)
        }
      },
      {
        Header: "Edit",
        accessor: "viewb",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => {
                const batchData = cellProps.row.original
                console.log(batchData);
                 setBatch(batchData);
                 toggle()
              }}
            >
              Edit
            </Button>)
        }
      }
    ],
    []
  )

  const toggle = () => {
    setModal(!modal)
  }

  var node = useRef()

  const handleUserClicks = payment => {
    console.log(payment, "payment")
    setPayment(payment)
    toggle()
  }
  const retrieveBatches = () => {
    BatchService.getAllBatches()
      .then((response) => {
        console.log(response.data.data, "batches");
        setBatches(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const retrieveBatchImage = () => {
    BatchService.getBatchImage()
      .then((response) => {
        console.log(response.data.data, "batch image");
        response.data.data.map(file =>
          Object.assign(file, {
            preview:process.env.REACT_APP_BACKEND_ENDPOINT +  file.image_url,
            name:'batchImage'
          })
        );
        console.log(response.data.data, "batch image2");
        setselectedFiles(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required!"),
    start_date: Yup.string()
      .required("Please select"),
    end_date: Yup.string()
      .required("Please select")
  })
  const EditSchema = Yup.object().shape({
    editedName: Yup.string()
      .required("Required!"),
    edited_start_date: Yup.string()
      .required("Please select"),
    edited_end_date: Yup.string()
      .required("Please select")
  });
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  function handleAcceptedFiles(files) {
    console.log(files[0], 'files');
    const fileName = files[0].name;
    const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    console.log(fileNameExt);
    if (fileNameExt === "svg" || fileNameExt === "png" || fileNameExt === "PNG" || fileNameExt === "jpg" || fileNameExt === "SVG" || fileNameExt === "JPG" || fileNameExt === "JPEG" || fileNameExt === "jpeg") {
      files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size)
        })
      );
      setselectedFiles(files);
    }  else {
      Swal.fire({
        icon: 'error',
        title: 'Ooops',
        text: 'Invalid file type.Please use JPG , JPEG, PNG or SVG',
      })
    }
  }

  function submitBatchImage() {
    console.log(selectedFiles[0], 'files');
    const formData = new FormData();
    formData.append("paymentSlip", selectedFiles[0]);
    BatchService.saveBatchImage(formData).then(res => {
      console.log(res, 'response');
      if (res.status===201){
        Swal.fire(
          "Saved Successfully!",
          "",
          "success"
        )
      }

    })
  }
  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={toggle}
      >
        <div className="modal-content">
          <ModalHeader toggle={toggle}>Payment Details</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                editedName: batch?.name,
                edited_start_date:  moment(batch?.start_date).utc().format("YYYY-MM-DD"),
                edited_end_date: moment(batch?.end_date).utc().format("YYYY-MM-DD"),
              }}
              validationSchema={EditSchema}
              onSubmit={async values => {
                // loading
                Swal.fire({
                  title: 'Please Wait !',
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  imageUrl: "loader.gif",
                  onOpen: () => {
                    Swal.showLoading()
                  },
                })
                console.log(values, 'cccccc');
                const data = {
                  name:values.editedName,
                  start_date:values.edited_start_date,
                  end_date:values.edited_end_date,
                  status:batch?.status,
                  id:batch?.id
                }
                console.log(data, 'my data');
                update(data);
                toggle();
                /*await BatchService.addNewBatch(values).then(r => {
                  setError(null)
                  retrieveBatches()
                  Swal.fire(
                    "Batch Created!",
                    "",
                    "success"
                  )
                }).catch(e => {
                  console.log(e.response.data)
                  if (e.response.data.message) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                      footer: error
                    })
                  }
                })*/
              }}
            >
              {({ handleChange, setFieldValue, handleBlur, values, errors, touched }) => (
                <div>
                        <Card>
                          <CardBody>
                            {/*  <CardTitle className="mb-4">Register Admin</CardTitle>*/}
                            <Form>
                              <Row>
                                  <div className="mb-3">
                                    <Label htmlFor="formrow-firstname-Input">Batch Name</Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="editedName"
                                      name="editedName"
                                      placeholder="Enter Name"
                                      onChange={handleChange}
                                      value={values?.editedName}
                                      invalid={errors?.editedName && touched?.editedName ? true : false}
                                      onBlur={handleBlur}
                                    />
                                    {errors?.editedName && touched?.editedName ? (
                                      <FormFeedback type="invalid">{errors?.editedName}</FormFeedback>
                                    ) : null}
                                  </div>
                                  <Row>
                                    <Col>
                                      <div className="mb-3">
                                        <Label> From</Label>
                                        <Input
                                          className="border text-sm rounded-lg block w-full p-2.5 dark:bg-[#f5f5f5] text-black border border-gray-200  focus:outline-none focus:bg-[#e8e8e8] focus:border-[#e8e8e8] "
                                          id="edited_start_date"
                                          type="Date"
                                          name="edited_start_date"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          /* onChange={(e) => {
                                             handleChange(e);
                                             const userDOB = e.target.value;
                                             const userAge = moment().diff(moment(userDOB), "years");
                                             setAge(userAge);
                                             console.log(userAge, 'userage')
                                             setFieldValue('dob', userDOB);
                                             userAge >= 18 ? setIsOlderThan(true) : setIsOlderThan(false);
                                           }}*/
                                          invalid={errors?.edited_start_date && touched?.edited_start_date ? true : false}
                                          value={values?.edited_start_date}
                                          max={currentDate}
                                          placeholder="" />
                                        {errors?.edited_start_date && (
                                          <FormFeedback type="invalid">{errors?.edited_start_date}</FormFeedback>
                                        )}

                                      </div>
                                    </Col>
                                    <Col>
                                      <div className="mb-3">
                                        <Label> To</Label>
                                        <Input
                                          className="border text-sm rounded-lg block w-full p-2.5 dark:bg-[#f5f5f5] text-black border border-gray-200  focus:outline-none focus:bg-[#e8e8e8] focus:border-[#e8e8e8] "
                                          id="edited_end_date"
                                          type="Date"
                                          name="edited_end_date"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          /* onChange={(e) => {
                                             handleChange(e);
                                             const userDOB = e.target.value;
                                             const userAge = moment().diff(moment(userDOB), "years");
                                             setAge(userAge);
                                             console.log(userAge, 'userage')
                                             setFieldValue('dob', userDOB);
                                             userAge >= 18 ? setIsOlderThan(true) : setIsOlderThan(false);
                                           }}*/
                                          invalid={errors?.edited_end_date && touched?.edited_end_date ? true : false}
                                          value={values?.edited_end_date}
                                          max={currentDate}
                                          placeholder="" />
                                        {errors?.edited_end_date && (
                                          <FormFeedback type="invalid">{errors?.edited_end_date}</FormFeedback>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>

                              </Row>
                              <div>
                                <button type="submit" className="btn btn-primary w-md">
                                  Submit
                                </button>
                              </div>
                            </Form>
                          </CardBody>
                        </Card>
                  {/* container-fluid */}
                </div>
              )}
            </Formik>
          </ModalBody>
          {/*<ModalFooter>
            <Button type="button" color="secondary" onClick={toggle}>
              Close
            </Button>
          </ModalFooter>*/}
        </div>
      </Modal>
      <Formik
        initialValues={{
          name: "",
          start_date: "",
          end_date: ""
        }}
        validationSchema={SignupSchema}
        onSubmit={async values => {
          // loading
          Swal.fire({
            title: 'Please Wait !',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            imageUrl: "loader.gif",
            onOpen: () => {
              Swal.showLoading()
            },
          })
          console.log(values, 'cccccc');
          await BatchService.addNewBatch(values).then(r => {
            setError(null)
            retrieveBatches()
            Swal.close();
            Swal.fire(
              "Batch Created!",
              "",
              "success"
            )
          }).catch(e => {
            console.log(e.response.data)
            Swal.close();
            if (e.response.data.message) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
              })
            }
          })
        }}
      >
        {({ handleChange, setFieldValue, handleBlur, values, errors, touched }) => (
          <div className="page-content">
            <Container fluid={true}>
              <Breadcrumbs title="Forms" breadcrumbItem="Batches" />
              <Row>
                <Col xl={6}>
                  <Card>
                    <CardBody>
                      {/*  <CardTitle className="mb-4">Register Admin</CardTitle>*/}
                      <Form>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-firstname-Input">Batch Name</Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Enter Name"
                                onChange={handleChange}
                                value={values?.name}
                                invalid={errors?.name && touched?.name ? true : false}
                                onBlur={handleBlur}
                              />
                              {errors?.name && touched?.name ? (
                                <FormFeedback type="invalid">{errors?.name}</FormFeedback>
                              ) : null}
                            </div>
                            <Row>
                              <Col>
                                <div className="mb-3">
                                  <Label> From</Label>
                                  <Input
                                    className="border text-sm rounded-lg block w-full p-2.5 dark:bg-[#f5f5f5] text-black border border-gray-200  focus:outline-none focus:bg-[#e8e8e8] focus:border-[#e8e8e8] "
                                    id="start_date"
                                    type="Date"
                                    name="start_date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    /* onChange={(e) => {
                                       handleChange(e);
                                       const userDOB = e.target.value;
                                       const userAge = moment().diff(moment(userDOB), "years");
                                       setAge(userAge);
                                       console.log(userAge, 'userage')
                                       setFieldValue('dob', userDOB);
                                       userAge >= 18 ? setIsOlderThan(true) : setIsOlderThan(false);
                                     }}*/
                                    invalid={errors?.start_date && touched?.start_date ? true : false}
                                    value={values?.start_date}
                                    max={currentDate}
                                    placeholder="" />
                                  {errors?.start_date && (
                                    <FormFeedback type="invalid">{errors?.start_date}</FormFeedback>
                                  )}

                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <Label> To</Label>
                                  <Input
                                    className="border text-sm rounded-lg block w-full p-2.5 dark:bg-[#f5f5f5] text-black border border-gray-200  focus:outline-none focus:bg-[#e8e8e8] focus:border-[#e8e8e8] "
                                    id="end_date"
                                    type="Date"
                                    name="end_date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    /* onChange={(e) => {
                                       handleChange(e);
                                       const userDOB = e.target.value;
                                       const userAge = moment().diff(moment(userDOB), "years");
                                       setAge(userAge);
                                       console.log(userAge, 'userage')
                                       setFieldValue('dob', userDOB);
                                       userAge >= 18 ? setIsOlderThan(true) : setIsOlderThan(false);
                                     }}*/
                                    invalid={errors?.end_date && touched?.end_date ? true : false}
                                    value={values?.end_date}
                                    max={currentDate}
                                    placeholder="" />
                                  {errors?.end_date && (
                                    <FormFeedback type="invalid">{errors?.end_date}</FormFeedback>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <div>
                          <button type="submit" className="btn btn-primary w-md">
                            Submit
                          </button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={6}>
                  <Card>
                    <CardBody>
                      <Dropzone
                        onDrop={acceptedFiles => {
                          handleAcceptedFiles(acceptedFiles);
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div className="dropzone">
                            <div
                              className="dz-message needsclick"
                              {...getRootProps()}
                            >
                              <input {...getInputProps()} />
                              <div className="dz-message needsclick">
                                <div className="mb-3">
                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h4>Drop files here or click to upload(JPG , JPEG, PNG or SVG)</h4>
                                {selectedFiles.map((f, i) => {
                                  return (
                                    <div className="position-relative mb-3" key={i + "-file"}>
                                      <img src={f.preview} alt="" className="img-thumbnail" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                        )}
                      </Dropzone>
                      {/*<div
                        className="dropzone-previews mt-3"
                        id="file-previews"
                      >
                        {selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          );
                        })}
                      </div>*/}
                          <Button type="button" color="primary" onClick={submitBatchImage}>
                            Save
                          </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      {/* <CardTitle className="h4">Agents Commissions</CardTitle>*/}
                      {batches && <TableContainer
                        columns={columns}
                        data={batches}
                        isGlobalFilter={true}
                        handleUserClick={handleUserClicks}
                        customPageSize={10}
                        className="custom-header-css"
                      />}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
            {/* container-fluid */}
          </div>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default withRouter(BatchManagement)
