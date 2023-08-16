import React, { useEffect, useState, useRef, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../components/Common/TableContainer"
import IconMaterialdesign from "pages/Icons/IconMaterialdesign";

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  InputGroup,
  Row,
  Toast,
  UncontrolledTooltip
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"


//import { Name, Email, Tags, Projects } from "../../pages/Contacts/ContactList/contactlistCol";
import {
  Name,
  Email,
  Address,
  EmpNo,
  Enable,
  NIC,
  Status,
  MobileNo
} from "../Agent-Management/agentListCol"

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
import AgentService from "../../peo-eye-services/AgentService"
import AdminService from "../../peo-eye-services/AdminService"
import Swal from "sweetalert2"
import ReactLoading from 'react-loading';

const AgentList = props => {

  //meta title
  document.title = "Agent Management | Peo Eye Admin Panel"
  const [agents, setAgents] = useState([])
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  // let data = AgentService.getAllAgents();
  // setAgents(await AgentService.getAllAgents());
  //console.log(data);
  //setAgents(data.data.agent);s
  console.log(agents, "agentss45")

  //get all student by agent
  useEffect(() => {
    retrieveAdmins();
    const user = JSON.parse(localStorage.getItem("authUser"));
    setRole(user?.roles[0].name);
  }, [])

  const dispatch = useDispatch()
  const [contact, setContact] = useState()
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (contact && contact.name) || "",
      designation: (contact && contact.designation) || "",
      email: (contact && contact.email) || "",
      projects: (contact && contact.projects) || ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
      designation: Yup.string().required("Please Enter Your Designation"),
      email: Yup.string().required("Please Enter Your Email"),
      projects: Yup.number().required("Please Enter Your Project")
    })

  })

  const { users } = useSelector(state => ({
    users: state.contacts.users
  }))

  const [userList, setUserList] = useState([])
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const columns = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "name",
        filterable: true,
        Cell: cellProps => {
          return <Name {...cellProps} />
        }
      },
      {
        Header: "Address",
        accessor: "address",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              {" "}
              <Address {...cellProps} />{" "}
            </>
          )
        }
      },
      {
        Header: "Employee No",
        accessor: "empNo",
        filterable: true,
        Cell: cellProps => {
          return <EmpNo {...cellProps} />
        }
      },
      {
        Header: "NIC",
        accessor: "user[0].nic",
        filterable: true,
        Cell: cellProps => {
          return <Email {...cellProps} />
        }
      },

      {
        Header: "Mobile No",
        accessor: "user[0].mobileNo",
        filterable: true,
        Cell: cellProps => {
          return <MobileNo {...cellProps} />
        }
      },
      {
        Header: "Email",
        accessor: "user[0].email",
        filterable: true,
        Cell: cellProps => {
          return <Email {...cellProps} />
        }
      },
      {
        Header: "Status",
        accessor: "user[0].status",
        filterable: true,
        Cell: cellProps => {
          return <Enable {...cellProps} />
        }
      },
      {
        Header: "Action",
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.user[0].status === 'Enable'
                ? /*<Button
                  color="danger"
                  className="btn-rounded "
                  onClick={() => updateStatus(cellProps.row.original.user[0].id,cellProps.row.original.user[0].status)}>
                  De-activate
                </Button>*/
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => updateStatus(cellProps.row.original.user[0].id, cellProps.row.original.user[0].status)}
                >
                  <i className="mdi mdi-lock-open-check"></i>{" "}
                </button>
                : /*<Button
                  color="success"
                  className="btn-rounded "
                  onClick={() => updateStatus(cellProps.row.original.user[0].id,cellProps.row.original.user[0].status)}>
                  <i className="mdi mdi-lock-check"></i>
                  Activate
                </Button>*/
                <button
                  type="button"
                  className="btn btn-success "
                  onClick={() => updateStatus(cellProps.row.original.user[0].id, cellProps.row.original.user[0].status)}
                >
                  <i className="mdi mdi-lock-check"></i>{" "}
                </button>
              }
              {/*{cellProps.row.original.user[0].status}
              <button
                type="button"
                className="btn btn-success "
              >
                <i className="mdi mdi-lock-check"></i>{" "}
              </button>
              <button
                type="button"
                className="btn btn-danger"
              >
                <i className="mdi mdi-lock-open-check"></i>{" "}
              </button>

              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const userData = cellProps.row.original
                  onClickDelete(userData)
                }}
              >

                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>*/}
            </div>
          )
        }
      }
    ],
    []
  )
  const columns2 = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "name",
        filterable: true,
        Cell: cellProps => {
          return <Name {...cellProps} />
        }
      },
      {
        Header: "Address",
        accessor: "address",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              {" "}
              <Address {...cellProps} />{" "}
            </>
          )
        }
      },
      {
        Header: "Employee No",
        accessor: "empNo",
        filterable: true,
        Cell: cellProps => {
          return <EmpNo {...cellProps} />
        }
      },
      {
        Header: "NIC",
        accessor: "nic",
        filterable: true,
        Cell: cellProps => {
          return <Email {...cellProps} />
        }
      },

      {
        Header: "Mobile No",
        accessor: "mobileNo",
        filterable: true,
        Cell: cellProps => {
          return <MobileNo {...cellProps} />
        }
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
        Cell: cellProps => {
          return <Email {...cellProps} />
        }
      },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: cellProps => {
          return <Enable {...cellProps} />
        }
      },
      {
        Header: "Action",
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.status === 'Enable'
                ? /*<Button
                  color="danger"
                  className="btn-rounded "
                  onClick={() => updateStatus(cellProps.row.original.user[0].id,cellProps.row.original.user[0].status)}>
                  De-activate
                </Button>*/
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => updateStatus(cellProps.row.original.id, cellProps.row.original.status)}
                >
                  <i className="mdi mdi-lock-open-check"></i>{" "}
                </button>
                : /*<Button
                  color="success"
                  className="btn-rounded "
                  onClick={() => updateStatus(cellProps.row.original.user[0].id,cellProps.row.original.user[0].status)}>
                  <i className="mdi mdi-lock-check"></i>
                  Activate
                </Button>*/
                <button
                  type="button"
                  className="btn btn-success "
                  onClick={() => updateStatus(cellProps.row.original.id, cellProps.row.original.status)}
                >
                  <i className="mdi mdi-lock-check"></i>{" "}
                </button>
              }
              {/*{cellProps.row.original.user[0].status}
              <button
                type="button"
                className="btn btn-success "
              >
                <i className="mdi mdi-lock-check"></i>{" "}
              </button>
              <button
                type="button"
                className="btn btn-danger"
              >
                <i className="mdi mdi-lock-open-check"></i>{" "}
              </button>

              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const userData = cellProps.row.original
                  onClickDelete(userData)
                }}
              >

                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>*/}
            </div>
          )
        }
      }
    ],
    []
  )

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers())
      setIsEdit(false)
    }
  }, [dispatch, users])

  useEffect(() => {
    setContact(users)
    setIsEdit(false)
  }, [users])

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setContact(users)
      setIsEdit(false)
    }
  }, [users])

  const toggle = () => {
    setModal(!modal)
  }
  const retrieveAdmins = () => {
    AgentService.getAllAgents().then(res => {
      console.log(res.data.agent, "from sercice")
      setAgents(res.data.agent)
      setLoading(false)
      console.log(agents, "from file")
    })
  }
  const handleUserClick = arg => {
    const user = arg

    setContact({
      id: user.id,
      name: user.name,
      designation: user.designation,
      email: user.email,
      tags: user.tags,
      projects: user.projects
    })
    setIsEdit(true)

    toggle()
  }
  const updateStatus = async (id, status) => {
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
    console.log(id, "id");
    console.log(status, "status");
    const myData = {
      id: id,
      status: status,
      dob: "2022-11-01",
      empNo: "001"
    }
    await AdminService.updateAdmin(myData).then(agent => {
      console.log(agent, 'data');
      if (agent.status === 'Enable') {
        Swal.close();
        Swal.fire(
          "Successfully Changed!",
          "",
          "success"
        )
      }
      else {
        Swal.close();
        Swal.fire(
          "Successfully Changed!",
          "",
          "success"
        )
      }
      retrieveAdmins();

    }).catch(e => {
      Swal.close();
      if (e.response.data.message === 'Unauthenticated.') {
        Swal.fire({
          icon: 'error',
          text: 'Unauthenticated User!',
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    })
  }

  var node = useRef()
  const onPaginationPageChange = page => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page)
    }
  }

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = users => {
    console.log(users, 'vdvdvdvd');
    setContact(users)
    setDeleteModal(true)
  }

  const handleDeleteUser = () => {
    dispatch(onDeleteUser(contact))
    onPaginationPageChange(1)
    setDeleteModal(false)
  }

  const handleUserClicks = () => {
    setUserList("")
    setIsEdit(false)
    toggle()
  }

  const keyField = "id"

  const [agentLink, setAgentLink] = useState();
  useEffect(() => {
    let linkArray;
    AdminService.getAllLinks(authUser?.id).then(res => {

      if (authUser?.roles[0]?.name === 'agent') {
        linkArray = res.data.agents;
        for (let i = 0; i < linkArray.length; i++) {
          if (linkArray[i].type === 2) {
            setAgentLink(linkArray[i].link)
          }
        }
      } else {
        linkArray = res.data.admin;
        for (let i = 0; i < linkArray.length; i++) {
          if (linkArray[i].type === 1) {
            setAgentLink(linkArray[i].link)
          }
        }
      }

    })
  }, [])

  const copyToCLipboard = () => {
    if (agentLink === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    } else {
      navigator.clipboard.writeText(agentLink)
      let timerInterval
      Swal.fire({
        title: 'Copied!',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      })
    }

  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* table body */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Agent List" />

          <Row>
            {loading ? <></> : <>
              <Col lg="12">
                <div className="action-button" style={{ paddingLeft: '84%' }}>
                  <Button onClick={() => copyToCLipboard()}>Copy Agent Creation Link</Button>
                </div>
              </Col>
            </>}
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
                    {role === 'super-admin' || role === 'normal-admins' ?
                      <CardBody>
                        <TableContainer
                          columns={columns}
                          data={agents}
                          isGlobalFilter={true}
                          handleUserClick={handleUserClicks}
                          customPageSize={10}
                          className="custom-header-css"
                        />

                      </CardBody> :
                      <CardBody>
                        <TableContainer
                          columns={columns2}
                          data={agents}
                          isGlobalFilter={true}
                          handleUserClick={handleUserClicks}
                          customPageSize={10}
                          className="custom-header-css"
                        />

                      </CardBody>}

                  </>}

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(AgentList)
