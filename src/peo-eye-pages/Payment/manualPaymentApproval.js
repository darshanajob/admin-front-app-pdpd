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
import {
  ReferenceNumber,
  Amount,
  PaymentDate,
  Status,
  PaymentMethod,
  PaymentSlip, PaymentType, Student
} from "../Reports/reportCol"

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
import Flatpickr from "react-flatpickr"
import moment from "moment/moment"
import paymentService from "../../peo-eye-services/PaymentService"

const manualPaymentApproval = ({ dataColors }) => {
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
  const [maxDate, setMaxDate] = useState("");
  const [payment, setPayment] = useState(null);
  const [revenue, setRevenue] = useState(null);


  //meta title
  document.title = "Manual Payments"
  //get all payments
  useEffect(() => {
    paymentService.getAllPayment().then(res => {
      console.log(res.data.studentpayment, "from sercice");
      setPayments(res.data.studentpayment)
    /*  setAgents(res.data.studentpayment)
      console.log(agents, "from file")*/
    })

    ReportService.getAllPayments().then(res => {
      console.log(res.data)
      setSuccessCount(res.data.successCount)
      setNotApprovedCount(res.data.notApprovedCount)
      setDeclinedCount(res.data.declinedCount)
      setHalfPaidCount(res.data.half)
      setFullPaidCount(res.data.full)
      setNotPaidCount(res.data.notPaid)
      setStartDate(moment(res.data.startDate).utc().format('YYYY-MM-DD'));
      setEndDate(moment(res.data?.endDate).utc().format('YYYY-MM-DD'));
      setRevenue(res.data.total);
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
        Header: "Reference Number",
        accessor: "referenceNo",
        filterable: true,
        Cell: cellProps => {
          return <ReferenceNumber {...cellProps} />
        }
      },
      {
        Header: "Student ID",
        accessor: "studentId",
        filterable: true,
        Cell: cellProps => {
          return <ReferenceNumber {...cellProps} />
        }
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              {" "}
              <Status {...cellProps} />{" "}
            </>
          )
        }
      },
      /*{
        Header: "Amount",
        accessor: "amount",
        filterable: true,
        Cell: cellProps => {
          return <Amount {...cellProps} />
        }
      },*/
      {
        Header: "Date",
        accessor: "created_at\n",
        filterable: true,
        Cell: cellProps => {
          return <PaymentDate {...cellProps} />
        }
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        filterable: true,
        Cell: cellProps => {
          return <PaymentMethod {...cellProps} />
        }
      },
      {
        Header: "Payment Type",
        accessor: "paymentType",
        filterable: true,
        Cell: cellProps => {
          return <PaymentType {...cellProps} />
        }
      },
      {
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
                const userData = cellProps.row.original;
                handleUserClicks(userData);
              }}
            >
              View Details
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
    console.log(payment, 'payment');
    setPayment(payment);
    toggle()
  }

  const submitForm = (e) => {
    e.preventDefault()
    console.log(startDate, "start")
    console.log(endDate, "end")
  }
  const approvePayment = (data, type) => {
    console.log(data, 'data');
    console.log(type, 'type');
    console.log('approve');
  }

  const declinePayment = data => {
    console.log(data, 'data');
    console.log('declined')
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
              <span className="text-primary m-2">{payment?.paymentType}</span>
            </p>
            <p className="mb-2">
              Payment Status: <Badge
              className={"font-size-12 m-2 badge-soft-" +
              (payment?.status === "SUCCESS" ? "success" : "danger" && payment?.status === "NOT_APPROVED" ? "warning" : "danger")}
            >
              {payment?.status}
            </Badge>
            </p>
            <p className="mb-2">
              Payment slip:
              <img className="img-thumbnail" src={process.env.REACT_APP_BACKEND_ENDPOINT + payment?.paymentSlip}
                   alt="image not found" />
            </p>
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col><Button type="button" color="danger" onClick={approvePayment(payment?.id, 2)}>
                Decline
              </Button></Col>

              <Col><Button type="button" color="success" onClick={approvePayment(payment?.id, 1)}>
                Approve
              </Button></Col>

            </Row>
          </ModalFooter>
        </div>
      </Modal>
      {/* End modal*/}
      {/*Start form*/}
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="Reports" breadcrumbItem="Payment Status Report" />
                <Card>
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
                </Card>
          </Container>
        </div>

    </React.Fragment>
  )
}

export default withRouter(manualPaymentApproval)
