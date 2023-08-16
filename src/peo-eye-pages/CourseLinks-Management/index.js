import React, { useEffect, useState } from "react"
import AdminService from "../../peo-eye-services/AdminService"
import { Formik, Field, Form, ErrorMessage } from "formik"
import Swal from "sweetalert2"


import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  Label,
  Button,
  Input,
  InputGroup, CardSubtitle, Table, FormFeedback, Alert, Modal
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useDispatch } from "react-redux"
import { getCategories as onGetCategories, getEvents as onGetEvents } from "../../store/calendar/actions"
import { Draggable } from "@fullcalendar/interaction"
import { useFormik } from "formik"
import * as Yup from "yup"
import ReactLoading from 'react-loading';
import StudentServices from "peo-eye-services/studentServices"

const CourseLinksManagement = props => {
  //meta title
  document.title = "Course Management | Peo Eye Admin Panel"
  const dispatch = useDispatch()
  const [admins, setAdmins] = useState([])
  const [links, setLinks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true);

  const createSchema = Yup.object().shape({
    message: Yup.string()
      .min(5, "Too Short!")
      .required(" Message is required"),
    date: Yup.string()
      .required("Date is required"),
    time_from: Yup.string()
      .required("Time is required"),
    time_to: Yup.string()
      .required("Time is required"),
    link: Yup.string()
    .required("Link is required").url('Please enter a valid URL' ),
    batch: Yup.string()
      .required("Batch is required"),
  })

  useEffect(() => {
    getAllLinks()
  }, [])

  const [allBatches, setAllBatches] = useState([]);
  const [batchId, setBatchId] = useState();

  //get all batches
  useEffect(() => {
    StudentServices.getAllBatches().then(res => {
      console.log(res, 'DataAgentData');
      setBatchId(res.data.batches[0].id)
      setAllBatches(res.data.batches)
    })
  }, []);

  const getAllLinks = () => {

    AdminService.getAllCourseLinks()
      .then((response) => {
        console.log(response, "data")
        setLinks(response.data.links)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const updateStatus = async (id) => {
    console.log(id, "id");
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

    await AdminService.statusChangeCourseLink(id).then(res => {

      console.log(res, "responseee");
      Swal.close();
      Swal.fire(
        "Successfully Changed!",
        "",
        "success"
      )

      getAllLinks()

    }).catch(e => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    })
  }

  const [modal_standard, setmodal_standard] = useState(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  const onClickDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
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
        AdminService.deleteCourseLink(id).then(res => {
          Swal.close();
          Swal.fire(
            'Deleted!',
            'Link has been deleted.',
            'success'
          )
          setLoading(true)
          getAllLinks()
        })

      }
    })
  }

  const timeSet = (time) => {
    var hh = time.slice(0, 2);
    var m = time.slice(2);
    var dd = " AM";
    var h = hh;
    var newTime;
    if (hh > 12) {
      h = hh - 12;
      dd = " PM"
    } else if (hh == 0) {
      h = 12
    } else if (hh == 12) {
      dd = " PM"
    }
    newTime = h + m + dd;
    return newTime;
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          message: "",
          date: "",
          time_from: "",
          time_to: "",
          type_of_student: "REGISTERED",
          link: "",
          batch: "",
          payment_type: "full"
        }}
        validationSchema={createSchema}
        onSubmit={async values => {
          // same shape as initial values  {authStudent?.link_status === 1  && authStudent?.payment_type_links === "FULL_PAYMENT_VERIFY"?
          console.log(values, 'values.time_from')
          tog_standard()
          // setLoading(true)
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


          const courseLinkData = {
            message: values.message,
            date: values.date,
            time_from: timeSet(values.time_from),
            time_to: timeSet(values.time_to),
            type_of_student: values.type_of_student,
            link_type  : values.type_of_link === undefined ? 'COURSE_LINK': values.type_of_link ,
            type: "Enable",
            link: values.link,
            batch: values.batch,
            payment_type: values.payment_type
          }
          console.log(courseLinkData, "courseLinkData")
          await AdminService.addCourseLink(courseLinkData).then(r => {
            console.log(r, 'resssss')
            setError(null)
            getAllLinks()
            // setLoading(false)
            Swal.close();
            Swal.fire(
              "Course Link Created!",
              "",
              "success"
            )
          }).catch(e => {
            console.log(e.response.data)
            setError('Error!')
          })
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <div className="page-content">
            <Container fluid={true}>
              <Breadcrumbs title="Dashboard" breadcrumbItem="Course Link Management" />

              <Row>
                <Modal
                  isOpen={modal_standard}
                  toggle={() => {
                    tog_standard();
                  }}
                >
                  <Card>
                    <CardBody>
                      {error && (
                        <Alert color="danger" role="alert">
                          {error}
                        </Alert>
                      )}
                      <CardTitle className="mb-4">Add New Course Link</CardTitle>
                      <Form>
                        <div className="mb-3">
                          <Label htmlFor="formrow-firstname-Input">Message</Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="message"
                            name="message"
                            placeholder="Enter Course Message"
                            onChange={handleChange}
                            value={values?.message}
                            invalid={errors?.message && touched?.message ? true : false}
                            onBlur={handleBlur}
                          />
                          {errors?.message && touched?.message ? (
                            <FormFeedback type="invalid">{errors?.message}</FormFeedback>
                          ) : null}
                        </div>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Date</Label>
                              <Input
                                type="date"
                                id="date"
                                name="date"
                                className="form-control"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                invalid={errors?.date && touched?.date ? true : false}
                                value={values?.date}
                                min={new Date().toISOString().split("T")[0]}
                              />
                              {errors?.date && touched?.date ? (
                                <FormFeedback type="invalid">{errors?.date}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-InputCity">From</Label>
                              <Input
                                type="time"
                                id="time_from"
                                name="time_from"
                                className="form-control"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                invalid={errors?.time_from && touched?.time_from ? true : false}
                                value={values?.time_from}
                              />
                              {errors?.time_from && touched?.time_from ? (
                                <FormFeedback type="invalid">{errors?.time_from}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-InputCity">To</Label>
                              <Input
                                type="time"
                                id="time_to"
                                name="time_to"
                                className="form-control"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                invalid={errors?.time_to && touched?.time_to ? true : false}
                                value={values?.time_to}
                              />
                              {errors?.time_to && touched?.time_to ? (
                                <FormFeedback type="invalid">{errors?.time_to}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Type of Student</Label>
                              <Input
                                type="select"
                                id="type_of_student"
                                name="type_of_student"
                                className="form-control"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.type_of_student}
                              >
                                <option key="REGISTERED" value="REGISTERED">REGISTERED</option>
                                <option key="PAYMENT_DONE" value="PAYMENT_DONE">PAYMENT_DONE</option>
                              </Input>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Type of Link</Label>
                              <Input
                                  type="select"
                                  id="type_of_link"
                                  name="type_of_link"
                                  className="form-control"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values?.type_of_link}
                              >
                                <option key="COURSE_LINK" value="COURSE_LINK">COURSE_LINK</option>
                                <option key="ZOOM_LINK" value="ZOOM_LINK">ZOOM_LINK</option>
                                <option key="TELEGRAM_LINK" value="TELEGRAM_LINK">TELEGRAM_LINK</option>
                              </Input>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Batch</Label>
                              <Input
                                type="select"
                                id="batch"
                                name="batch"
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.batch}
                              >
                                <option key="" value="">Select Batch</option>
                                {allBatches.map((batch) => (
                                  <option key={batch?.id} value={batch?.id}>{batch.name}</option>
                                ))}
                              </Input>
                              {errors?.batch && touched?.batch ? (
                                <FormFeedback type="invalid">{errors?.batch}</FormFeedback>
                              ) : null}
                              <div style={{color: "red"}}>
                              {errors?.batch && touched?.batch ? errors?.batch : null}
                              </div>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Payment Type</Label>
                              <Input
                                  type="select"
                                  id="payment_type"
                                  name="payment_type"
                                  className="form-control"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values?.payment_type}
                              >
                                <option key="full" value="full">Full</option>
                                <option key="half" value="half">Half</option>
                              </Input>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Link</Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="link"
                                name="link"
                                placeholder="Enter Course Link"
                                onChange={handleChange}
                                value={values?.link}
                                invalid={errors?.link && touched?.link ? true : false}
                                onBlur={handleBlur}
                              />
                              {errors?.link && touched?.link ? (
                                <FormFeedback type="invalid">{errors?.link}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <div>
                          <button type="submit" className="btn btn-primary w-md">
                            Save
                          </button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Modal>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <br />
                    {loading ?
                      <>
                        <center>
                          <ReactLoading type='bubbles' color='#000' height={'5%'} width={'5%'} />
                        </center>
                      </> :
                      <>
                      <div style={{ paddingLeft: '87%' }}>
                        <Row>
                          <Col>
                            <Button color="dark"
                              onClick={() => tog_standard()}>Create New Link</Button>
                          </Col>
                        </Row>
                      </div>
                        <CardBody>
                          <div className="table-responsive">
                            <Table className="table table-bordered mb-0">
                              <thead>
                                <tr>
                                  <th>Message</th>
                                  <th>Date</th>
                                  <th>From</th>
                                  <th>To</th>
                                  <th>Link Type</th>
                                  <th>Payment Type</th>
                                  <th>Type Of Student</th>
                                  <th>Type</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {links && links.map((link, index) => (
                                  <tr key={index}>
                                    <td>{link.message}</td>
                                    <td>{link?.date}</td>
                                    <td>{link?.time_from}</td>
                                    <td>{link?.time_to}</td>
                                    <td>{link?.link_type}</td>
                                    <td>{link?.paymentType}</td>
                                    <td>{link?.type_of_student}</td>
                                    <td>
                                      {link.type === 'Enable'
                                        ? <Button
                                          color="danger"
                                          className="btn-rounded"
                                          onClick={() => updateStatus(link?.id)}>
                                          Disable
                                        </Button>
                                        : <Button
                                          color="success"
                                          className="btn-rounded"
                                          onClick={() => updateStatus(link?.id)}>
                                          Enable
                                        </Button>
                                      }
                                    </td>
                                    <td>
                                      <Button
                                        color="danger"
                                        outline
                                        onClick={() => {
                                          onClickDelete(link?.id);
                                        }}
                                      >
                                        <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </>
                    }

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

export default CourseLinksManagement
