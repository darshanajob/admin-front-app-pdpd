import React, { useEffect, useState, useRef, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../components/Common/TableContainer"
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
  Label,
  InputGroup,
  FormGroup,
  ModalHeader,
  ModalBody,
  Table,
  ModalFooter,
  Modal,
  Badge,
  CardTitle, Alert, Input, FormFeedback
} from "reactstrap"
import * as Yup from "yup"
import { Formik, useFormik, Field, Form } from "formik"

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
import AgentService from "../../peo-eye-services/AgentService"
import moment from "moment/moment"
import AdminService from "../../peo-eye-services/AdminService"
import Swal from "sweetalert2"
import Flatpickr from "react-flatpickr"

const AgentCommissions = ({ dataColors }) => {
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
  const [agents, setAgents] = useState(null);
  const [commissions, setCommissions] = useState(null)
  // date
  const date = new Date()
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let current_date = `${year}-${month}-${day}`
  const [currentDate, setDate] = useState(current_date)


  //meta title
  document.title = "Agents Commissions"

  const [error, setError] = useState(null)

  //get all payments
  useEffect(() => {
    console.log(moment("2021-07-14T00:00:00.000Z").utc().format("YYYY-MM-DD"));
    AgentService.getAllAgents().then(res => {
      console.log(res.data.agent, "agents")
      setAgents(res.data.agent)
      console.log(agents, "agenst")
      /* setPayments(res.data.commissions);
       setStartDate(moment(res.data.startDate).utc().format('YYYY-MM-DD'));
       setEndDate(moment(res.data?.endDate).utc().format('YYYY-MM-DD'));
       setRevenue(res.data.total)*/
      /*setSuccessCount(res.data.successCount)
      setNotApprovedCount(res.data.notApprovedCount)
      setDeclinedCount(res.data.declinedCount)
      setHalfPaidCount(res.data.half)
      setFullPaidCount(res.data.full)
      setNotPaidCount(res.data.notPaid)
      ;*/
    })

  }, [])

  const getData = (data) =>{
    ReportService.agentsIndividualCommissionsCurrent(data).then(res => {
      console.log(res, 'response')
    })
  }
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
                const userData = cellProps.row.original
                handleUserClicks(userData)
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
    console.log(payment, "payment")
    setPayment(payment)
    toggle()
  }
  const SignupSchema = Yup.object().shape({
    agent: Yup.string()
      .required("Please select"),
    fromDate: Yup.string()
      .required("Please select"),
    toDate: Yup.string()
      .required("Please select")
  })
  const submitForm = (e) => {
    e.preventDefault()
    console.log(startDate, "start")
    console.log(endDate, "end")
  }
  return (
    <React.Fragment>
      <Formik
        initialValues={{
          agent: "",
          fromDate: "",
          toDate: ""
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
          let data = {
            startDate:values.fromDate,
            endDate:values.toDate,
            agent:values.agent,
          }
          // same shape as initial values
          console.log(data, 'data obj');
          ReportService.agentsIndividualCommissionsCurrent(data).then(res => {
            Swal.close();
            console.log(res, 'response');
            setCommissions(res.data.students);
            console.log(commissions, 'commis')
          })
        }}
      >
        {({ handleChange, setFieldValue, handleBlur, values, errors, touched }) => (
          <div className="page-content">
            <Container fluid={true}>
              <Breadcrumbs title="Forms" breadcrumbItem="Agents commissions" />
              <Row>
                <Col xl={6}>
                  <Card>
                    <CardBody>
                      {/*  <CardTitle className="mb-4">Register Admin</CardTitle>*/}
                      <Form>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Select Agent</Label>
                              {/*<select
                                  className="form-control"
                                  id="agent"
                                  name="agent"
                                  onChange={handleChange}
                                  onBlur={handleBlur}>
                                  <option>Select</option>
                                  <option>Large select</option>
                                  <option>Small select</option>
                                </select>*/}
                              <Input
                                type="select"
                                id="agent"
                                name="agent"
                                className="form-control"
                                invalid={errors?.agent && touched?.agent ? true : false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                {agents && agents.map((agent) => (
                                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))}
                              </Input>

                              {/*<Field
                                  as="select"
                                  name="agent"
                                  id="agent"
                                  invalid={errors?.password && touched?.password ? true : false}
                                  onChange={handleChange}
                                  onBlur={handleBlur}>
                                  <option value="red">Red</option>
                                  <option value="green">Green</option>
                                  <option value="blue">Blue</option>
                                </Field>*/}
                              {errors?.agent && (
                                <FormFeedback type="invalid">{errors?.agent}</FormFeedback>
                              )}
                            </div>
                            <Row>
                              <Col>
                                <div className="mb-3">
                                  <Label> From</Label>
                                  <Input
                                    className="border text-sm rounded-lg block w-full p-2.5 dark:bg-[#f5f5f5] text-black border border-gray-200  focus:outline-none focus:bg-[#e8e8e8] focus:border-[#e8e8e8] "
                                    id="fromDate"
                                    type="Date"
                                    name="fromDate"
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
                                    invalid={errors?.fromDate && touched?.fromDate ? true : false}
                                    value={values?.fromDate}
                                    max={currentDate}
                                    placeholder="" />
                                  {errors?.fromDate && (
                                    <FormFeedback type="invalid">{errors?.fromDate}</FormFeedback>
                                  )}

                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <Label> To</Label>
                                  <Input
                                    className="border text-sm rounded-lg block w-full p-2.5 dark:bg-[#f5f5f5] text-black border border-gray-200  focus:outline-none focus:bg-[#e8e8e8] focus:border-[#e8e8e8] "
                                    id="toDate"
                                    type="Date"
                                    name="toDate"
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
                                    invalid={errors?.toDate && touched?.toDate ? true : false}
                                    value={values?.toDate}
                                    max={currentDate}
                                    placeholder="" />
                                  {errors?.toDate && (
                                    <FormFeedback type="invalid">{errors?.toDate}</FormFeedback>
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
              </Row>
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                     {/* <CardTitle className="h4">Agents Commissions</CardTitle>*/}
                      {commissions && <TableContainer
                        columns={columns}
                        data={commissions}
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

export default withRouter(AgentCommissions)
