import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

import avatar from "../../assets/images/users/avatar-9.webp"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"
import AdminService from "../../peo-eye-services/AdminService"

const UserProfile = () => {

  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template"

  const dispatch = useDispatch()

  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [idx, setidx] = useState(1)
  const [links, setLinks] = useState([])
  const [agentCreationLink, setAgentCreationLink] = useState(null)
  const [agentSelfFoundLink, setAgentSelfFoundLink] = useState(null)
  const [adminSelfFoundLink, setAdminSelfFoundLink] = useState(null)
  const [normalStudentCreationLink, setNormalLink] = useState(null)

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success
  }))

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"))
      console.log(obj, "auth obj")
      /* const userLinks = JSON.parse(localStorage.getItem('links'));
       setLinks(userLinks);
       console.log(userLinks, 'userLinks')*/
      retrieveUserLinks(obj.roles[0].name)
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName)
        setemail(obj.email)
        setidx(obj.uid)
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username)
        setemail(obj.email)
        setidx(obj.uid)
      }
      setTimeout(() => {
        dispatch(resetProfileFlag())
      }, 3000)
    }
  }, [dispatch, success])

  const retrieveUserLinks = (userRole) => {
    console.log(userRole, "userole")
    AdminService.getAllLinks()
      .then((response) => {
        setLinks(response.admin)
        console.log(response, "data");
        switch(userRole) {
          case "normal-admins":
            FilterLinksAdmins(response.admin);
            break;
          case "super-admin":
            FilterLinksAdmins(response.admin);
            break;
          case "agent":
            FilterLinks(response.agent)
            break;

          default:

        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const FilterLinksAdmins = (linkArr) =>{
    console.log(linkArr, 'linkArr');
    let i
    for (i = 0; i < linkArr.length; i++) {
      console.log(i, "datai")
      if (linkArr[i].type === 1) {
        setAgentCreationLink(linkArr[i]);
      } else {
        setAdminSelfFoundLink(linkArr[i]);
      }
    }

  }

  const FilterLinksAgents = (linkArr) =>{
    console.log(linkArr, 'linkArr');
    let i
    for (i = 0; i < linkArr.length; i++) {
      if (linkArr[i].type === 1) {
        // normal student creation
        setNormalLink(linkArr[i]);
      } else if (linkArr[i].type === 2) {
        // agent creation
        setAgentCreationLink(linkArr[i]);
      }
    else{
      // agent self found
      setAgentSelfFoundLink(linkArr[i]);

      }
    }
  }
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: name || "",
      idx: idx || ""
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName")
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values))
    }
  })


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Skote" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">Email : {email}</p>
                        <p className="mb-0">Emp no : #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {links.length > 0 &&
          <div>
            <h4 className="card-title mb-4">REFERRAL LINKS</h4>
            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="ms-3">
                  </div>
                  <div className="flex-grow-1 align-self-center">
                    <div className="text-muted">
                      <div style={{ paddingRight: "300vh", paddingLeft: "5px" }}>
                        <h5>Student Creation Link </h5><textarea rows="7" cols="160" readOnly
                                                                 style={{ border: "none", resize: "none" }}>
                            {adminSelfFoundLink.link}
                          </textarea>
                        <h5>Agent Creation Link </h5><textarea rows="7" cols="160" readOnly
                                                               style={{ border: "none", resize: "none" }}>
                           {agentCreationLink.link}
                          </textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          }

          {/*<Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="username"
                    // value={name}
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      validation.touched.username && validation.errors.username ? true : false
                    }
                  />
                  {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Update User Name
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>*/}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
