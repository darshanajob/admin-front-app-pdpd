import React, { useEffect, useState, useRef, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../../components/Common/TableContainer"
import IconMaterialdesign from "pages/Icons/IconMaterialdesign"
import { Chart } from "react-google-charts"

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  UncontrolledTooltip,
  Form,
  Label,
  InputGroup,
  FormGroup,
  ModalHeader,
  ModalBody,
  Table,
  ModalFooter,
  Modal,
  Badge,
  CardTitle
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"

import {
  ReferenceNumber,
  Amount,
  PaymentDate,
  Status,
  PaymentMethod,
  PaymentSlip, PaymentType, Student
} from "../reportCol"

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
import ReportService from "../../../peo-eye-services/ReportService"
import DatePicker from "react-datepicker"
import PieChart from "../../../pages/AllCharts/apex/PieChart"
import Pie from "../../../pages/AllCharts/echart/piechart"
import CommissionPieChart from "./commissionPieChart"
import EcommerceOrdersModal from "../../../pages/Ecommerce/EcommerceOrders/EcommerceOrdersModal"
import PaymentDetailModal from "./commissionDetailsModal"
import Flatpickr from "react-flatpickr"
import img7 from "../../../assets/images/product/img-7.png"
import img4 from "../../../assets/images/product/img-4.png"
import ApexRadial from "../../../pages/Dashboard/ApexRadial"
import moment from "moment/moment"
import ReactLoading from 'react-loading';
import Swal from "sweetalert2"

const commissionReport = ({ dataColors }) => {
  const [payments, setPayments] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [successCount, setSuccessCount] = useState(0)
  const [declinedCount, setDeclinedCount] = useState(0)
  const [notApprovedCount, setNotApprovedCount] = useState(0)
  const [halfPaidCount, setHalfPaidCount] = useState(0)
  const [fullPaidCount, setFullPaidCount] = useState(0)
  const [notPaidCount, setNotPaidCount] = useState(0)
  const [modal1, setModal1] = useState(false)
  const [maxDate, setMaxDate] = useState("")
  const [payment, setPayment] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [datePickerStartDate, setDatePickerStart] = useState(null)
  const [datePickerEndDate, setDatePickerEnd] = useState(null)
  const [loading, setLoading] = useState(true);


  //meta title
  document.title = "Commission Report"
  //get all payments
  useEffect(() => {
    console.log(moment("2021-07-14T00:00:00.000Z").utc().format("YYYY-MM-DD"))
    /* var today = new Date()
     var dd = String(today.getDate()).padStart(2, "0")
     var mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
     var yyyy = today.getFullYear()

     const current_date = yyyy + "-" + mm + "-" + dd
     console.log(current_date, "hjh")

     //setStartDate(current_date);
     //setEndDate(current_date)
     setMaxDate(current_date)*/

    /*  function getFirstDayOfNextMonth() {
        const date = new Date()

        return new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }

  // 👇️ Mon Nov 01 ...
      console.log(getFirstDayOfNextMonth(), ",,,,,")*/

    ReportService.getAllCurrentMonthCommissions().then(res => {
      console.log(res.data)
      setPayments(res.data.commissions)
      setStartDate(moment(res.data.startDate).utc().format("YYYY-MM-DD"))
      setEndDate(moment(res.data?.endDate).utc().format("YYYY-MM-DD"))
      setRevenue(res.data.total)
      setLoading(false)
      /*setSuccessCount(res.data.successCount)
      setNotApprovedCount(res.data.notApprovedCount)
      setDeclinedCount(res.data.declinedCount)
      setHalfPaidCount(res.data.half)
      setFullPaidCount(res.data.full)
      setNotPaidCount(res.data.notPaid)
      ;*/
    })
  }, [])

  const options = {
    title: "Call Status",
    is3D: true
  }
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  let props = {
    dataColors: "[\"--bs-primary\",\"--bs-warning\", \"--bs-danger\",\"--bs-info\", \"--bs-success\"]",
    successCount: successCount,
    notApprovedCount: notApprovedCount,
    declinedCount: declinedCount,
    fullPaidCount: fullPaidCount,
    halfPaidCount: halfPaidCount,
    notPaidCount: notPaidCount
  }
  const toggleViewModal = () => setModal1(!modal1)
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "created_at",
        filterable: true,
        Cell: cellProps => {
          return <PaymentDate {...cellProps} />
        }
      },
      {
        Header: "Commission Amount",
        accessor: "commission_amount",
        filterable: true,
        Cell: cellProps => {
          return <Amount {...cellProps} />
        }
      },
      {
        Header: "Agent Name",
        accessor: "agent.name",
        filterable: true,
        Cell: cellProps => {
          return <ReferenceNumber {...cellProps} />
        }
      },
      {
        Header: "Agent Type",
        accessor: "agent.agent_type",
        filterable: true,
        Cell: cellProps => {
          return <PaymentMethod {...cellProps} />
        }
      },

      {
        Header: "Payment Method",
        accessor: "payment_method",
        filterable: true,
        Cell: cellProps => {
          return <PaymentMethod {...cellProps} />
        }
      },
      {
        Header: "Payment Type",
        accessor: "payment_type",
        filterable: true,
        Cell: cellProps => {
          return <PaymentType {...cellProps} />
        }
      },
      /*{
        Header: "View Details",
        accessor: "view",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => {
                const userData = cellProps.row.original
                handleUserClicks(userData)
              }}
            >
              View Details
            </Button>)
        }
      }*/
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

  const submitForm = (e) => {
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
    e.preventDefault()
    console.log(datePickerStartDate, "start")
    console.log(datePickerEndDate, "end");
    let data = {
      startDate: datePickerStartDate,
      endDate: datePickerEndDate
    }
    console.log(data, 'data obj');
    ReportService.getAllDateRangeCommissions(data).then(res => {
      Swal.close();
      console.log(res.data, 'filtered data')
      setPayments(res.data.commissions)
      setStartDate(moment(res.data.startDate).utc().format("YYYY-MM-DD"))
      setEndDate(moment(res.data?.endDate).utc().format("YYYY-MM-DD"))
      setRevenue(res.data.total)
      /*setSuccessCount(res.data.successCount)
      setNotApprovedCount(res.data.notApprovedCount)
      setDeclinedCount(res.data.declinedCount)
      setHalfPaidCount(res.data.half)
      setFullPaidCount(res.data.full)
      setNotPaidCount(res.data.notPaid)
      ;*/
    })
  }
  return (
    <React.Fragment>
      {/* <PaymentDetailModal isOpen={modal1} toggle={toggleViewModal} />*/}

      {/*Start modal*/}
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
            <p className="mb-2">
              Reference No: <span className="text-primary m-2">#{payment?.referenceNo}</span>
            </p>
            <p className="mb-2">
              Date: <span className="text-primary m-2">{payment?.date}</span>
            </p>
            <p className="mb-2">
              Payment Method:
              <span className="text-primary m-2">{payment?.paymentMethod}</span>
            </p>
            <p className="mb-2">
              Payment Type:
              <span className="text-primary m-2">{payment?.student?.paymentType}</span>
            </p>
            <p className="mb-2">
              Payment Status: <Badge
                className={"font-size-12 m-2 badge-soft-" +
                  (payment?.status === "SUCCESS" ? "success" : "danger" && payment?.status === "NOT_APPROVED" ? "warning" : "danger")}
              >
                {payment?.status}
              </Badge>
            </p>

            {/* <p className="mb-2">
              Student  Name: <span className="text-primary">{payment?.student?.fullName}</span>
            </p>
            <p className="mb-2">
              Student  Id: <span className="text-primary">{payment?.student?.studentId}</span>
            </p>*/}

            <div className="table-responsive">
              <Table className="table align-middle table-nowrap">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-right"> Students Name: </h6>
                    </td>
                    <td>
                      {payment?.student?.fullName}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-right"> Student Id:</h6>
                    </td>
                    <td>
                      {payment?.student?.studentId}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-right">Students Mobile No:</h6>
                    </td>
                    <td>
                      {payment?.student?.mobileNo}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="secondary" onClick={toggle}>
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
      {/* End modal*/}
      {/*Start form*/}
      <Form>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="Reports" breadcrumbItem="Commissions Report" />
            <Row>
              <Card>
                <CardBody>
                  {/*Start Date*/}
                  {/*<Row className="mb-3">
                      <label
                        htmlFor="example-date-input"
                        className="col-md-2 col-form-label"
                      >
                        Start Date
                      </label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="date"
                          defaultValue={startDate}
                          id="example-date-input"
                          onChange={(e) => setStartDate(e.target.value)}
                          max={maxDate}
                        />
                      </div>
                    </Row>*/}

                  {/*<Row className="mb-3">
                      <label
                        htmlFor="example-date-input"
                        className="col-md-2 col-form-label"
                      >
                        End Date
                      </label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="date"
                          defaultValue={endDate}
                          id="example-date-input"
                          onChange={(e) => setEndDate(e.target.value)}
                          max={maxDate}
                        />
                      </div>
                    </Row>*/}
                  <FormGroup className="mb-4">
                    <Label> Select Date Range</Label>
                    <InputGroup>
                      <Flatpickr
                        className="form-control d-block"
                        placeholder="dd M,yyyy"
                        options={{
                          mode: "range",
                          dateFormat: "Y-m-d",
                          maxDate: "today"
                        }}
                        onClose={(selectedDates, dateStr, instance) => {
                          var dateStart = instance.formatDate(selectedDates[0], "Y-m-d")
                          var dateEnd = instance.formatDate(selectedDates[1], "Y-m-d")
                          console.log(dateStart, "dateStart")
                          console.log(dateEnd, "dateEnd")
                          setDatePickerStart(dateStart)
                          setDatePickerEnd(dateEnd)
                          console.log(datePickerStartDate, "datePickerStartDate")
                          console.log(datePickerEndDate, "datePickerEndDate")
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div>
                    <button type="submit" className="btn btn-primary w-lg" onClick={event => {
                      submitForm(event)
                    }}>
                      Submit
                    </button>
                  </div>
                </CardBody>
              </Card>
              <Col xl={6}>
                <Row>
                  <Card>
                    {loading ?
                      <>
                        <center>
                          <ReactLoading type='bubbles' color='#000' height={'5%'} width={'5%'} />
                        </center>
                      </> :
                      <>
                        <CardBody>
                          <CardTitle className="mb-4">Monthly Commissions</CardTitle>
                          <Row>
                            <Col sm="6">
                              <p className="text-muted">{startDate} <span className="text-primary m-2"> to </span> {endDate}
                              </p>
                              <h3>Rs {revenue}</h3>
                              {/* <h5>{revenue.toLocaleString(undefined, {maximumFractionDigits:2})}</h5>*/}
                            </Col>
                          </Row>
                        </CardBody>
                      </>}

                  </Card>
                </Row>
                {/*<Row>
                  <Card>
                    <CardBody>
                      Start Date
                      <Row className="mb-3">
                      <label
                        htmlFor="example-date-input"
                        className="col-md-2 col-form-label"
                      >
                        Start Date
                      </label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="date"
                          defaultValue={startDate}
                          id="example-date-input"
                          onChange={(e) => setStartDate(e.target.value)}
                          max={maxDate}
                        />
                      </div>
                    </Row>

                      <Row className="mb-3">
                      <label
                        htmlFor="example-date-input"
                        className="col-md-2 col-form-label"
                      >
                        End Date
                      </label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="date"
                          defaultValue={endDate}
                          id="example-date-input"
                          onChange={(e) => setEndDate(e.target.value)}
                          max={maxDate}
                        />
                      </div>
                    </Row>
                      <FormGroup className="mb-4">
                        <Label> Select Date Range</Label>
                        <InputGroup>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M,yyyy"
                            options={{
                              mode: "range",
                              dateFormat: "Y-m-d",
                              maxDate: "today",
                              defaultDate: [startDate, endDate]
                            }}
                            onClose={(selectedDates, dateStr, instance) => {
                              var dateStart = instance.formatDate(selectedDates[0], "d/m/Y")
                              var dateEnd = instance.formatDate(selectedDates[1], "d/m/Y")
                              console.log(selectedDates, "date")
                              console.log(dateStr, "dateStr")
                              console.log(instance, "instance")
                              console.log(dateStart)
                              console.log(dateEnd)
                            }}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div>
                        <button type="submit" className="btn btn-primary w-lg" onClick={event => {
                          submitForm(event)
                        }}>
                          Submit
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </Row>*/}
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card>
                  {loading ?
                    <>
                      <center>
                        <ReactLoading type='bubbles' color='#000' height={'5%'} width={'5%'} />
                      </center>
                    </> :
                    <>
                      <CardBody>
                        <TableContainer
                          columns={columns}
                          data={payments}
                          isGlobalFilter={true}
                          handleUserClick={handleUserClicks}
                          customPageSize={20}
                          className="custom-header-css"
                        />
                      </CardBody>
                    </>}

                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </Form>

    </React.Fragment>
  )
}

export default withRouter(commissionReport)
