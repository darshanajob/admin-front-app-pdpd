import React, { useEffect, useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
import { Formik, useFormik, Form } from "formik";
import IconMaterialdesign from "pages/Icons/IconMaterialdesign";

import {
  Card,
  CardBody,
  Col,
  Container, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader,
  Row,
  UncontrolledTooltip
} from "reactstrap"
import * as Yup from "yup";

//import { Name, Email, Tags, Projects } from "../../pages/Contacts/ContactList/contactlistCol";
import {
  Name,
  Mobile,
  Address,
  PaymentType,
  PayemntApprived, StudentID, DeclineNote, HalfPaymentType, Batch
} from "../Payment/paymentApproveCol"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getUsers as onGetUsers,
  deleteUser as onDeleteUser,
} from "store/contacts/actions";
import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import AgentService from "../../peo-eye-services/AgentService";
import paymentService from "../../peo-eye-services/PaymentService";
import { Img } from "./paymentApproveCol";
import StudentServices from "../../peo-eye-services/studentServices";
import Swal from "sweetalert2";
import ReactLoading from 'react-loading';

const paymentApprove = props => {

  //meta title
  document.title = "Payment Approval | Peo Eye Admin Panel";
  const [agents, setAgents] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // let data = AgentService.getAllAgents();
  // setAgents(await AgentService.getAllAgents());
  //console.log(data);
  //setAgents(data.data.agent);s
  console.log(agents, 'agentss45');

  //get all student by agent
  useEffect(() => {
    paymentService.getAllPayment().then(res => {
      setLoading(false)
      console.log(res.data.studentpayment, 'from sercice');
      setAgents(res.data.studentpayment)
      console.log(agents, 'from file');
    })
  }, []);

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  const [image, setimage] = useState();

  const onClickEdit = users => {
    console.log(users, 'select1record');
    setContact(users);
    //setimage(users.payment[0].paymentSlip)
    //let testimage = users.payment[0].paymentSlip;
    //  setimage(testimage)
    setEditModal(true);
  };
  function tog_standard_edit() {
    setEditModal(!editModal);
  }
  // validation
  /*    const validation = useFormik({
          // enableReinitialize : use this flag when initial values needs to be changed
          enableReinitialize: true,

          initialValues: {
              name: (contact && contact.name) || "",
              designation: (contact && contact.designation) || "",
              email: (contact && contact.email) || "",
              projects: (contact && contact.projects) || "",
          },
          validationSchema: Yup.object({
              name: Yup.string().required("Please Enter Your Name"),
              designation: Yup.string().required("Please Enter Your Designation"),
              email: Yup.string().required("Please Enter Your Email"),
              projects: Yup.number().required("Please Enter Your Project"),
          }),

      });*/
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      fullName: "",
      mobileNo: "",
      email: "",
      nic: "",
      address: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Please Enter Student Name"),
      mobileNo: Yup.string().required("Please Enter Student Mobile No"),
    }),

    onSubmit: async (values) => {
      console.log('login')
      const login = {
        fullName: values.fullName,
        mobileNo: values.mobileNo
      }
      console.log(login, 'login')
    }

  });


  const { users } = useSelector(state => ({
    users: state.contacts.users,
  }));

  const [userList, setUserList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "fullName",
        filterable: true,
        Cell: cellProps => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Student ID",
        accessor: "studentId",
        filterable: true,
        Cell: cellProps => {
          return <StudentID {...cellProps} />;
        },
      },
      /*{
        Header: "Address",
        accessor: "address",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              {" "}
              <Address {...cellProps} />{" "}
            </>
          );
        },
      },*/
      {
        Header: "NIC",
        accessor: "nic",
        filterable: true,
        Cell: cellProps => {
          return <Mobile {...cellProps} />;
        },
      },
      {
        Header: "Batch",
        accessor: "batch",
        filterable: true,
        Cell: cellProps => {
          return <Batch {...cellProps} />;
        },
      },
      {
        Header: "Payment Type",
        accessor: "paymentType",
        filterable: true,
        Cell: cellProps => {
          return <PaymentType {...cellProps} />;
        },
      },
      {
        Header: "Payment Status",
        accessor: "status",
        filterable: true,
        Cell: cellProps => {
          return <PayemntApprived {...cellProps} />;
        },
      },
      {
        Header: "First/Second Half",
        accessor: "payment_type_links",
        filterable: false,
        Cell: cellProps => {
          return <HalfPaymentType {...cellProps} />;
        },
      },
      {
        Header: "Decline Note",
        accessor: "decline_note",
        filterable: true,
        Cell: cellProps => {
          return <DeclineNote {...cellProps} />;
        },
      },
      {
        Header: "Action",
        Cell: cellProps => {
          return (

            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-success "
                onClick={() => {
                  const userData = cellProps.row.original;
                  onClickEdit(userData);
                }}
              >
                <i className="mdi mdi-lock-check"></i>{" "}
              </button>
              {/*    <button
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="mdi mdi-lock-open-check"></i>{" "}
                            </button>

                            <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    const userData = cellProps.row.original;
                                    onClickDelete(userData);
                                }}
                            >

                                <i className="mdi mdi-delete font-size-18" id="deletetooltip"/>
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Deletes
                                </UncontrolledTooltip>
                            </Link>*/}
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers());
      setIsEdit(false);
    }
  }, [dispatch, users]);

  useEffect(() => {
    setContact(users);
    setIsEdit(false);
  }, [users]);

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setContact(users);
      setIsEdit(false);
    }
  }, [users]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleUserClick = arg => {
    const user = arg;

    setContact({
      id: user.id,
      name: user.name,
      designation: user.designation,
      email: user.email,
      tags: user.tags,
      projects: user.projects,
    });
    setIsEdit(true);

    toggle();
  };

  var node = useRef();
  const onPaginationPageChange = page => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = async users => {
    Swal.fire({
      title: 'Please provide a reason for the payment decline.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        console.log(login, 'login');
        if (login) {
          console.log('found')
        }
        else {
          Swal.showValidationMessage(
            `Required!`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      console.log(result, 'result');
     // console.log(values.paymentType,'value');//paymentType: values.paymentType
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
        let data;
        data = {
          type: 0,
          message: result.value,
          paymentType: users.paymentType,
          amount:contact.amount
        }

        paymentService.changeStatus(users.id, data).then(res => {
          console.log(res, 'dadea');
          Swal.close();
          Swal.fire(
            "Payment Decline Successfully!",
            "",
            "success"
          )
          paymentService.getAllPayment().then(response => {
            console.log(response.data.studentpayment, 'from sercice');
            setAgents(response.data.studentpayment)
            // console.log(agents, 'from file');
          })
        })
      }
    })
    /*  console.log('test123', users);
      setContact(users);
      setDeleteModal(true);*/



    tog_standard_edit();

  };

  const handleDeleteUser = () => {
    dispatch(onDeleteUser(contact));
    onPaginationPageChange(1);
    setDeleteModal(false);
  };

  const handleUserClicks = () => {
    setUserList("");
    setIsEdit(false);
    toggle();
  };

  const keyField = "id";

  return (
    <React.Fragment>
      <Modal
        isOpen={editModal}
        toggle={() => {
          tog_standard_edit();
        }}
      >
        <div className="modal-content">
          <ModalHeader toggle={tog_standard_edit}>Payment Details</ModalHeader>
          <ModalBody>
          </ModalBody>
          {/*<button
            type="button"
            onClick={() => {
              setEditModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>*/}
        </div>
        <Formik
          initialValues={{
            id: contact?.id ? contact.id : '',
            fullName: contact?.fullName ? contact?.fullName : '',
            address: contact?.address ? contact?.address : '',
            mobileNo: contact?.mobileNo ? contact?.mobileNo : '',
            paymentType: contact?.paymentType ? contact?.paymentType : '',
            payemntapprived: contact?.payemntapprived ? contact?.payemntapprived : '',
            paymentSlip: contact?.paymentSlip ? contact?.paymentSlip : '',
            studentId: contact?.studentId ? contact?.studentId : '',
            amount: contact?.amount ? contact?.amount : '',
            nic: contact?.nic ? contact?.nic : '',
            status: 'CONTACTED_NO_ANSWER'
          }}
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
            console.log(values, 'submitted values');
            // values?.id;
            let data;
            data = {
              type: 1,
              paymentType: values.paymentType,
              amount:contact.amount
            }
            await paymentService.changeStatus(values.id, data).then(res => {
              console.log(res, 'dadea');
              Swal.close();
              Swal.fire(
                "Payment Approve Successfully!",
                "",
                "success"
              )
              paymentService.getAllPayment().then(response => {
                console.log(response.data.studentpayment, 'from service');
                setAgents(response.data.studentpayment)
                // console.log(agents, 'from file');
              })
            })


            tog_standard_edit();

          }}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form style={{ paddingLeft: "20px", paddingRight: "20px" }}>
              <div className="mb-3">
                <Label htmlFor="formrow-firstname-Input">Name : {values?.fullName}</Label>
              </div>
              <div className="mb-3">
                <Label htmlFor="formrow-firstname-Input">Student ID : {values?.studentId}</Label>
              </div>
              <div className="mb-3">
                <Label htmlFor="formrow-firstname-Input">Student NIC : {values?.nic}</Label>
              </div>
              <div className="mb-3">
                <Label htmlFor="formrow-firstname-Input">Amount Paid : {values?.amount}</Label>
              </div>
              <div className="mb-3">
                <Label htmlFor="formrow-firstname-Input">Payment Type : {values?.paymentType}</Label>
              </div>

              <div className="mb-3">
                <Label htmlFor="formrow-firstname-Input">Payment slip :</Label>
                {/*  <Input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            placeholder="Enter Your Address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            invalid={errors?.address && touched?.address ? true : false}
                            value={values?.address}
                        />*/}
                <img className="img-thumbnail" src={process.env.REACT_APP_BACKEND_ENDPOINT +  values.paymentSlip} alt="image not found" />
                {errors?.address && touched?.address ? (
                  <FormFeedback type="invalid">{errors?.address}</FormFeedback>
                ) : null}
              </div>
              <div className="mb-3" style={{ paddingLeft: "130px" }}>
                <button type="submit" className="btn btn-primary w-md">
                  Approve Payment
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link
                  to="#"
                  className="btn btn-danger"
                  onClick={() => {
                    const userData = values;
                    onClickDelete(userData);
                  }}
                >
                  Decline Payment
                  {/*<i className="mdi mdi-delete font-size-18" id="deletetooltip"/>
                            <UncontrolledTooltip placement="top" target="deletetooltip">
                                Delete
                            </UncontrolledTooltip>*/}
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <div className="page-content">
        <Container fluid>
          {/* table body */}
          <Breadcrumbs title="Manual" breadcrumbItem="Payment Verify" />
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
                        data={agents}
                        isGlobalFilter={true}
                        handleUserClick={handleUserClicks}
                        customPageSize={10}
                        className="custom-header-css"
                      />

                    </CardBody>
                  </>}

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(paymentApprove);
