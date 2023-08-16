import React, { useEffect, useState } from "react"
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
  InputGroup, CardSubtitle, Table, FormFeedback, Alert
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import * as Yup from "yup"
import AdminService from "../../peo-eye-services/AdminService"
import Swal from "sweetalert2"
import { Formik, Field, Form, ErrorMessage } from "formik"
import AgentService, { addNewAgent } from "../../peo-eye-services/AgentService"
import { useHistory } from "react-router-dom";

const AgentManagement = props => {

  //meta title
  document.title = "Agent Management | Skote - React Admin & Dashboard Template"
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [agent, setAgent] = useState(null);
  const [empNo, setEmpNo] = useState(null);
  const [linkType, setLinkType] = useState('');
  const history = useHistory();
  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(5, "Too Short!")
      .max(50, "Too Long!")
      .required(" Name is required"),
    address: Yup.string()
      .min(5, "Too Short!")
      .max(50, "Too Long!")
      .required("Address is required"),
    email: Yup.string()
      .email("Must be a valid Email")
      .max(255)
      .required("Email is required"),
    mobileNo: Yup.string()
      .max(9, "Invalid  mobile number!")
      .min(9, "Invalid  mobile number!")
      .required("Mobile number is required"),
    nic: Yup.string()
      .required("NIC is required"),
    password: Yup.string()
      .min(6, "Too Short!")
      .required("Password is required"),
    password_confirmation: Yup.string()
      .min(6, "Too Short!")
      .when("password", {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Both password need to be the same"
      )
    }).required("Password confirmation is required")

  })
    useEffect(() => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const link = Object.fromEntries(urlSearchParams.entries());
      console.log(link, 'vhjvhjvhjvhj');
      const token = link.verify_link
      if (link.verify_link){
        setLinkType(link.type);
        const obj = {
          link:link.verify_link.toString(),
          type:link.type
        }
        console.log(obj, 'bvvvvvvvv')
        console.log('found');
        AgentService.verifyAdmin(obj)
          .then(function(response) {
            console.log(response);
            response.agent ? setEmpNo(response.agent.id) : setEmpNo(response.admin.id);
            console.log(setEmpNo, 'setEmpNo');
          })
          .catch((e) => {
            console.log(e);
            if (e.response.data.message ==='The payload is invalid.'){
              history.push("/pages-404");
            }
          })
      }
      else{
        history.push("/pages-404");
      }
    }, []);

    const retrieveCategories = () => {
      AgentService.register()
        .then(function(response) {
          console.log(response)
        })
        .then(function(parsedData) {
          console.log(parsedData, 'bcjdsbk')
          // data here
        })
        .catch((e) => {
          console.log(e)
        })
    }
  return (
    <React.Fragment>
      <Formik
        initialValues={{
          fullName: "",
          address: "",
          email: "",
          mobileNo: "",
          nic: "",
          password: "",
          password_confirmation: ""
        }}
        validationSchema={SignupSchema}
        onSubmit={async values => {
          // same shape as initial values
          console.log(values)
          const adminData = {
            name: values.fullName,
            nic: values.nic,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
            address: values.address,
            mobileNo: values.mobileNo,
            age: 23,
            requesttype: 2,
            empId: empNo,
            type:linkType
          }
          console.log(adminData, "adminData")
          await AgentService.addNewAgent(adminData).then(r => {
            console.log(r, 'rrsponxse')
            setError(null)
            Swal.fire({
              title: "Registration Successful!",
              icon: "success",
              allowOutsideClick: false,
              html:"Your account will be activated shortly!"
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                history.push("/login");
              }})
          }).catch(e => {
            console.log(e.response.data)
            if (e.response.data.message) {
              if (e.response.data.errors.nic) {
                console.log(e.response.data.errors.nic[0])
                setError(e.response.data.errors.nic[0])
              } else if (e.response.data.errors.email) {
                console.log(e.response.data.errors.email[0])
                setError(e.response.data.errors.email[0])
              }
            }
          })
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <div className="page-content agent-registration">
            <Container fluid={true}>
              <br></br>
              <div style={{ paddingLeft: "1400px" }}>
                {/*<Button color="secondary" className="btn btn-secondary waves-effect waves-light" href="/agentlist">
                  View Agent List
                </Button>*/}
              </div>
              <Row>
                <Col className="agent-registration-inner" xl={10}>
                  <Card>
                    <CardBody>
                      {error && (
                        <Alert color="danger" role="alert">
                          {error}
                        </Alert>
                      )}
                      <CardTitle className="mb-4">Register Agent</CardTitle>
                      <Form>
                        <div className="mb-3">
                          <Label htmlFor="formrow-firstname-Input">Full Name</Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter Your Full Name"
                            onChange={handleChange}
                            value={values?.fullName}
                            invalid={errors?.fullName && touched?.fullName ? true : false}
                            onBlur={handleBlur}
                          />
                          {errors?.fullName && touched?.fullName ? (
                            <FormFeedback type="invalid">{errors?.fullName}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="formrow-firstname-Input">Address</Label>
                          <Input
                            type="text"
                            id="address"
                            name="address"
                            className="form-control"
                            onBlur={handleBlur}
                            placeholder="Enter Your Address"
                            onChange={handleChange}
                            invalid={errors?.address && touched?.address ? true : false}
                            value={values?.address}
                          />
                          {errors?.address && touched?.address ? (
                            <FormFeedback type="invalid">{errors?.address}</FormFeedback>
                          ) : null}
                        </div>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Email</Label>
                              <Input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                onBlur={handleBlur}
                                placeholder="Enter Your Email"
                                onChange={handleChange}
                                invalid={errors?.email && touched?.email ? true : false}
                                value={values?.email}
                              />
                              {errors?.email && touched?.email ? (
                                <FormFeedback type="invalid">{errors?.email}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-password-Input">Mobile Number</Label>
                              <Input
                                type="number"
                                id="mobileNo"
                                name="mobileNo"
                                className="form-control"
                                onBlur={handleBlur}
                                placeholder="Enter Your Mobile Number"
                                onChange={handleChange}
                                invalid={errors?.mobileNo && touched?.mobileNo ? true : false}
                                value={values?.mobileNo}
                              />
                              {errors?.mobileNo && touched?.mobileNo ? (
                                <FormFeedback type="invalid">{errors?.mobileNo}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-InputCity">NIC</Label>
                              <Input
                                type="text"
                                id="nic"
                                name="nic"
                                className="form-control"
                                onBlur={handleBlur}
                                placeholder="Enter Your NIC"
                                onChange={handleChange}
                                invalid={errors?.nic && touched?.nic ? true : false}
                                value={values?.nic}
                              />
                              {errors?.nic && touched?.nic ? (
                                <FormFeedback type="invalid">{errors?.nic}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-InputZip">Password</Label>
                              <Input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                onBlur={handleBlur}
                                placeholder="Enter Your password"
                                onChange={handleChange}
                                invalid={errors?.password && touched?.password ? true : false}
                                value={values?.password}
                              />
                              {errors?.password && touched?.password ? (
                                <FormFeedback type="invalid">{errors?.password}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label htmlFor="formrow-InputZip">Confirm Password</Label>
                              <Input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                className="form-control"
                                onBlur={handleBlur}
                                placeholder="Enter Your password"
                                onChange={handleChange}
                                invalid={errors?.password_confirmation && touched?.password_confirmation ? true : false}
                                value={values?.password_confirmation}
                              />
                              {errors?.password_confirmation && touched?.password_confirmation ? (
                                <FormFeedback type="invalid">{errors?.password_confirmation}</FormFeedback>
                              ) : null}
                            </div>
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

            </Container>
            {/* container-fluid */}
          </div>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default AgentManagement
