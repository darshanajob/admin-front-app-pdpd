import React, { useState } from "react"
import { useHistory } from "react-router-dom"
// Redux
import { Link } from "react-router-dom"

import { Row, Col, CardBody, Card, Container, Form, Input, Label, FormFeedback } from "reactstrap"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

// import images
import profile from "../../assets/images/profile-img.png"
import logo from "../../assets/images/logo.svg"
import lightlogo from "../../assets/images/logo-light.svg"
import peoEyeLogo from "../../assets/images/peoEyeImages/logo1.png"

//service
import loginService from "../../peo-eye-services/LoginService"
import AdminService from "../../peo-eye-services/AdminService"
import Swal from "sweetalert2"

const Login = () => {
  const [show, setShow] = useState(false)
  const history = useHistory()
  //meta title
  document.title = "Login | Peo Eye Admin Panel"

  // Form validation 
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      nic: "",
      password: ""
    },
    validationSchema: Yup.object({
      nic: Yup.string().required("Please Enter Your nic"),
      password: Yup.string().required("Please Enter Your Password")
    }),
    onSubmit: async (values) => {
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
      const login = {
        nic: values.nic,
        password: values.password
      }
      console.log(login, "login")
      const data = await loginService.login(login)
      console.log(data, "datafromservice11")
      if (data.status === 200) {
        let user = data.data.message.user

        if (user.roles[0].name !== "student") {
          await localStorage.setItem("auth-token", data.data.message.token)
          await localStorage.setItem("agentdets", JSON.stringify(data.data.message.agent))
          let user = data.data.message.user
          await localStorage.setItem("authUser", JSON.stringify(user))
          await AdminService.getAllLinks()
            .then((response) => {
              //setLinks(response.data)
              console.log(response, "data")
              localStorage.setItem("links", JSON.stringify(response.admin))
            })
            .catch((e) => {
              console.log(e)
            })
          Swal.close();
          Swal.fire(
            "Login Successfully!",
            "",
            "success"
          )
          if (user.roles[0].name === "super-admin") {
            history.push("/payment-report")
          } else if (user.roles[0].name === "normal-admins") {
            history.push("/call-status-report")
          } else {
            history.push("/personal_commissions")
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You have to no permission to login!"
          })
        }
      } else {
        let error = data.response.data.message

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: error
        })
      }
    }
  })
  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                {/*<div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>*/}
                <CardBody className="pt-0">
                  <div className="auth-logo">
                    <Link to="/" className="auth-logo-light">
                      <div className="mt-4">
                        <span className="avatar-title bg-white">
                          <img
                            src={peoEyeLogo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                    <Link to="/" className="auth-logo-dark">
                      <div className="mt-4">
                        <span className="avatar-title bg-white">
                          <img
                            src={peoEyeLogo}
                            alt=""
                            height="100"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">NIC</Label>
                        <Input
                          name="nic"
                          className="form-control"
                          placeholder="Enter nic"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.nic || ""}
                          invalid={
                            validation.touched.nic && validation.errors.nic ? true : false
                          }
                        />
                        {validation.touched.nic && validation.errors.nic ? (
                          <FormFeedback type="invalid">{validation.errors.nic}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={show ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          <button onClick={() => setShow(!show)} className="btn btn-light " type="button"
                            id="password-addon">
                            <i className="mdi mdi-eye-outline"></i></button>
                        </div>
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn  btn-block "
                          type="submit"
                          style={{ "backgroundColor": "#FFC000" }}
                        >
                          Log In
                        </button>
                      </div>

                      {/*<div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              className="social-list-item bg-primary text-white border-primary"
                            >
                              <i className="mdi mdi-facebook" />
                            </Link>
                          </li>{" "}
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              className="social-list-item bg-info text-white border-info"
                            >
                              <i className="mdi mdi-twitter" />
                            </Link>
                          </li>{" "}
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              className="social-list-item bg-danger text-white border-danger"
                            >
                              <i className="mdi mdi-google" />
                            </Link>
                          </li>
                        </ul>
                      </div>*/}

                      {/*<div className="mt-4 text-center">
                        <Link to="/pages-forgot-pwd" className="text-muted">
                          <i className="mdi mdi-lock me-1" /> Forgot your
                          password?
                        </Link>
                      </div>*/}
                    </Form>
                  </div>
                </CardBody>
              </Card>
              {/*<div className="mt-5 text-center">
                <p>
                  Don&apos;t have an account ?{" "}
                  <Link
                    to="pages-register"
                    className="fw-medium text-primary"
                  >
                    {" "}
                    Signup now{" "}
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div>*/}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Login
