import React, { useEffect, useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer"
import IconMaterialdesign from "pages/Icons/IconMaterialdesign";

import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    UncontrolledTooltip,
    Modal,
    CardTitle,
    Button,
    Label,
    // Form,
    Input,
    FormFeedback,
    Alert,
} from "reactstrap";
import * as Yup from "yup";
import { Formik, useFormik, Form } from "formik";

import { Name, Email, Tags, Projects, Mobile, Agent, Status } from "./studentListCol";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
    getUsers as onGetUsers,
    deleteUser as onDeleteUser,
} from "store/contacts/actions";
import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import studentServices from "peo-eye-services/studentServices";
import StudentServices from "peo-eye-services/studentServices";
import UiSweetAlert from "pages/Ui/UiSweetAlert";
import Swal from "sweetalert2";

const StudentList = props => {


    // useEffect(() => {
    //     studentServices.getAllStudents();
    // },[]);

    //meta title
    document.title = "Student  | Skote - React Admin & Dashboard Template";
    const [error, setError] = useState(null)
    const addStudentSchema = Yup.object().shape({
        fullName: Yup.string()
            .min(5, 'Too Short!')
            .max(50, 'Too Long!'),
        address: Yup.string()
            .min(5, 'Too Short!')
            .max(50, 'Too Long!'),
        mobileNo: Yup.string()
            .max(10, 'Invalid  mobile number!')
            .required('Mobile number is required'),
        nic: Yup.string()
    });

    const dispatch = useDispatch();
    const [contact, setContact] = useState();
    const [student_id, setStudentId] = useState();
    const [student_dets, setStudentDets] = useState();
    // validation
    const validation1 = useFormik({
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

    });


    const [allStudents, setAllStudents] = useState([]);
    const [agentAllStudents, setAgentAllStudents] = useState([]);
    const [allAgents, setAllAgents] = useState([]);
    const [authUser, setAuthUser] = useState();
    const [authAgent, setAuthAgent] = useState();
    const [agent_id, setAgentId] = useState('');
    const [isAssigntoAdmin, setIsAssigntoAdmin] = useState(false)

    //get all agents with students count
    useEffect(() => {
        StudentServices.getAllAgentsWithStudentCount().then(res => {
            res.data.agent.sort(function (a, b) {
                return a.NumberOFStudents - b.NumberOFStudents;
            })
            console.log(res.data.agent, 'agentData');
            setAllAgents(res.data.agent)
            if (localStorage.getItem('agentdets') !== "undefined") {
                console.log(JSON.parse(localStorage.getItem('agentdets')), 'agentdets');
                setAuthAgent(JSON.parse(localStorage.getItem('agentdets')));
            }
        })
    }, []);

    //get all students admin
    useEffect(() => {
        StudentServices.getAllStudents().then(res => {
            console.log(res, 'studentData');
            setAllStudents(res.data.students);
            // console.log(JSON.parse(localStorage.getItem('agentdets'))?.id, 'allage1');


            if (localStorage.getItem('agentdets') !== "undefined") {
                var newArr = res.data.students.filter(function (obj) {
                    // console.log(obj?.agent_id, 'allage0');
                    return obj?.agent_id === JSON.parse(localStorage.getItem('agentdets'))?.id
                })
                // console.log(newArr, 'allage2');
                setAgentAllStudents(newArr)
            }

            setAuthUser(JSON.parse(localStorage.getItem('authUser')));
            console.log(JSON.parse(localStorage.getItem('authUser')), 'syudentData');
        })
    }, []);

    //get agent all students 
    useEffect(() => {
        StudentServices.getAgentAllStudents().then(res => {
            setAgentAllStudents(res.data.agent.student);
            console.log(res.data.agent.student, 'getAgentAllStudents');
        })
    }, []);


    const [userRole, setUserRole] = useState();

    useEffect(() => {
        // setAuthUser(localStorage.getItem('authUser'));
        // console.log(authUser, 'syudentData');
        // console.log(authUser, 'syudentData');
        // setUserRole(authUser.roles[0].name);
    }, []);

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
    // const [fullName, setFullName] = useState("");
    // const [mobileNo, setMobileNo] = useState("");
    // const [email, setEmail] = useState("");
    // const [nic, setNIC] = useState("");
    // const [address, setAddress] = useState("");

    const columns = useMemo(
        () => [


            {
                Header: "Name",
                accessor: "fullName",
                filterable: true,
                Cell: cellProps => {
                    return <Name {...cellProps} />;
                },
            },
            {
                Header: "Mobile",
                accessor: "user.mobileNo",
                filterable: true,
                Cell: cellProps => {
                    return <Mobile {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: true,
                Cell: cellProps => {
                    return <Status {...cellProps} />;
                },
            },
            {
                Header: "Agent",
                accessor: "agent.name",
                filterable: false,
                Cell: cellProps => {
                    return <Agent {...cellProps} />;
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
                            {/* <button
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="mdi mdi-lock-open-check"></i>{" "}
                            </button> */}

                            <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    const userData = cellProps.row.original;
                                    onClickDelete(userData);
                                }}
                            >

                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const columnsAgent = useMemo(
        () => [


            {
                Header: "Name",
                accessor: "fullName",
                filterable: true,
                Cell: cellProps => {
                    return <Name {...cellProps} />;
                },
            },
            {
                Header: "Mobile",
                accessor: "mobileNo",
                filterable: true,
                Cell: cellProps => {
                    return <Mobile {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: true,
                Cell: cellProps => {
                    return <Status {...cellProps} />;
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
                            {/* <button
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="mdi mdi-lock-open-check"></i>{" "}
                            </button> */}

                            {/* <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    const userData = cellProps.row.original;
                                    onClickDelete(userData);
                                }}
                            >

                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link> */}
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
    const [editModal, setEditModal] = useState(false);

    const onClickDelete = users => {
        setStudentId(users?.id);
        setDeleteModal(true);
    };

    const onClickEdit = users => {
        console.log(users, 'select');
        setStudentDets(users);
        setEditModal(true);
    };

    const handleDeleteUser = () => {
        // dispatch(onDeleteUser(contact));
        console.log(student_id, 'contact');
        StudentServices.deleteStudent(student_id).then(res => {
            console.log(res, 'respo');
            StudentServices.getAllStudents().then(res => {
                console.log(res, 'syudentData');
                setAllStudents(res.data.students)
            })
        });
        onPaginationPageChange(1);
        setDeleteModal(false);
    };

    const handleUserClicks = () => {
        setUserList("");
        setIsEdit(false);
        toggle();
    };

    const [modal_standard, setmodal_standard] = useState(false);

    function tog_standard() {
        setmodal_standard(!modal_standard);
        // removeBodyCss();
    }

    function tog_standard_edit() {
        setEditModal(!editModal);
    }

    const keyField = "id";

    const registerStudent = async () => {

        const regDets = {
            fullName,
            mobileNo,
            email,
            nic,
            address,
            requesttype: 3
        }

        console.log(regDets, 'details');

        const data = await studentServices.registerStudent(regDets);
        console.log('fadga', data);

        // studentServices.registerStudent(regDets).then((res) => {
        //     console.log(res);
        // })
    }



    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteUser}
                onCloseClick={() => setDeleteModal(false)}
            />

            <div className="page-content">
                <Row>
                    <Col>
                        <h3>Student Management ({authUser?.roles[0]?.name})</h3>
                    </Col>
                    <Col>


                        {/*Model */}

                        <div>
                            <div style={{ paddingLeft: "75%" }}>
                                <Button color="secondary" className="btn btn-secondary waves-effect waves-light"
                                    type="button"
                                    onClick={() => {
                                        tog_standard();
                                    }}
                                    data-toggle="modal"
                                    data-target="#myModal"
                                >
                                    REGISTER
                                </Button>
                            </div>
                            <Modal
                                isOpen={modal_standard}
                                toggle={() => {
                                    tog_standard();
                                }}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                        Student Register
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setmodal_standard(false);
                                        }}
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <Card>
                                    <CardBody>
                                        {error && (
                                            <Alert color="danger" role="alert">{error}</Alert>
                                        )}

                                        <Formik
                                            initialValues={{
                                                fullName: '',
                                                address: '',
                                                mobileNo: '',
                                                nic: '',
                                                agent: allAgents[0]?.agent_id
                                            }}
                                            validationSchema={addStudentSchema}
                                            onSubmit={async values => {
                                                console.log(values);
                                                console.log(authUser, 'authUser');

                                                let regDets;

                                                if (authUser?.roles[0]?.name === 'agent') {
                                                    regDets = {
                                                        fullName: values.fullName,
                                                        mobileNo: values.mobileNo,
                                                        nic: values.nic,
                                                        address: values.address,
                                                        requesttype: 3,
                                                        status: 'AGENT_ENTERED',
                                                        agent_id: authAgent[0]?.id
                                                    }
                                                } else {
                                                    if (isAssigntoAdmin) {
                                                        regDets = {
                                                            fullName: values.fullName,
                                                            mobileNo: values.mobileNo,
                                                            nic: values.nic,
                                                            address: values.address,
                                                            requesttype: 3,
                                                            status: 'ADMIN_ENTERED',
                                                            admin_id: authUser?.id
                                                        }
                                                    } else {
                                                        regDets = {
                                                            fullName: values.fullName,
                                                            mobileNo: values.mobileNo,
                                                            nic: values.nic,
                                                            address: values.address,
                                                            requesttype: 3,
                                                            status: 'ADMIN_ENTERED',
                                                            agent_id: values.agent
                                                        }
                                                    }
                                                }


                                                console.log(regDets, 'regDetsregDets');

                                                await StudentServices.registerStudent(regDets).then(res => {
                                                    console.log(res, 'dadea');
                                                    Swal.fire(
                                                        "Student Added Successfully!",
                                                        "",
                                                        "success"
                                                    )
                                                    setError(null)
                                                    StudentServices.getAgentAllStudents().then(res => {
                                                        setAgentAllStudents(res.data.agent.student);
                                                        console.log(res.data.agent.student, 'getAgentAllStudents');
                                                    })
                                                    StudentServices.getAllStudents().then(res => {
                                                        console.log(res, 'syudentData');
                                                        setAllStudents(res.data.students)
                                                    })
                                                    setmodal_standard(false)
                                                }).catch(e => {
                                                    console.log(e, 'dadea');
                                                    console.log(e.response.data, 'error');
                                                    if (e.response.status === 500) {
                                                        console.log('errorsdas');
                                                        setError("The NIC has been already been taken.")

                                                    } else if (e.response.data.message) {
                                                        if (e.response.data.errors.mobileNo) {
                                                            setError(e.response.data.errors.mobileNo[0])
                                                        }
                                                    }
                                                })
                                            }}
                                        >
                                            {({ handleChange, handleBlur, values, errors, touched }) => (
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
                                                            className="form-control"
                                                            id="address"
                                                            name="address"
                                                            placeholder="Enter Your Address"
                                                            onBlur={handleBlur}
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
                                                        <Col lg={6}>
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
                                                    </Row>

                                                    <Row>
                                                        <Col md={8}>
                                                            {
                                                                authUser?.roles[0]?.name === 'agent' ?
                                                                    <></> : <>
                                                                        <div className="mb-3">
                                                                            <Input type="checkbox" onChange={(e) => setIsAssigntoAdmin(e.target.checked)} />
                                                                            <Label htmlFor="formrow-email-Input">No Need Assign to Agent</Label>
                                                                            <Input
                                                                                type="select"
                                                                                id="agent"
                                                                                name="agent"
                                                                                className="form-control"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={isAssigntoAdmin}
                                                                            >
                                                                                {allAgents.map((agent) => (
                                                                                    <option key={agent.agent_id} value={agent.agent_id}>{agent.name} - Students({agent.NumberOFStudents})</option>
                                                                                ))}
                                                                            </Input>
                                                                        </div>
                                                                    </>
                                                            }

                                                        </Col>
                                                    </Row>

                                                    {/* <Row>
                                                        <Col md={8}>
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
                                                    </Row> */}
                                                    <div>
                                                        <button type="submit" className="btn btn-primary w-md">
                                                            Submit
                                                        </button>
                                                    </div>

                                                </Form>
                                            )}
                                        </Formik>
                                    </CardBody>
                                </Card>
                                {/* <div className="modal-footer">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            tog_standard();
                                        }}
                                        className="btn btn-secondary "
                                        data-dismiss="modal"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary "
                                        onClick={registerStudent}
                                    >
                                        Register
                                    </button>
                                </div> */}
                            </Modal>


                            <Modal
                                isOpen={editModal}
                                toggle={() => {
                                    tog_standard_edit();
                                }}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title mt-0" id="myModalLabel">
                                        Edit Student Details
                                    </h5>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditModal(false);
                                        }}
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <Card>
                                    <CardBody>
                                        {/* {error && (
                                            <Alert color="danger" role="alert">{error}</Alert>
                                        )} */}

                                        <Formik
                                            initialValues={{
                                                fullName: student_dets?.fullName ? student_dets?.fullName : '',
                                                address: student_dets?.address ? student_dets?.address : '',
                                                mobileNo: student_dets?.user?.mobileNo ? student_dets?.user?.mobileNo : '',
                                                nic: student_dets?.user?.nic ? student_dets?.user?.nic : '',
                                                status: 'CONTACTED_NO_ANSWER'
                                            }}
                                            validationSchema={addStudentSchema}
                                            onSubmit={async values => {
                                                console.log(values);

                                                let updateDets;

                                                if (authUser?.roles[0]?.name === 'agent') {
                                                    updateDets = {
                                                        fullName: values.fullName,
                                                        mobileNo: values.mobileNo,
                                                        nic: values.nic,
                                                        address: values.address,
                                                        status: values.status,
                                                    }
                                                } else {
                                                    if (isAssigntoAdmin) {
                                                        updateDets = {
                                                            fullName: values.fullName,
                                                            mobileNo: values.mobileNo,
                                                            nic: values.nic,
                                                            address: values.address,
                                                            status: values.status,
                                                        }
                                                    } else {
                                                        updateDets = {
                                                            fullName: values.fullName,
                                                            mobileNo: values.mobileNo,
                                                            nic: values.nic,
                                                            address: values.address,
                                                            status: values.status,
                                                        }
                                                    }
                                                }


                                                console.log(updateDets, 'regDetsregDets');

                                                await StudentServices.editStudent(student_dets?.id, updateDets).then(res => {
                                                    console.log(res, 'dadea');
                                                    Swal.fire(
                                                        "Student Update Successfully!",
                                                        "",
                                                        "success"
                                                    )
                                                    StudentServices.getAgentAllStudents().then(res => {
                                                        setAgentAllStudents(res.data.agent.student);
                                                        console.log(res.data.agent.student, 'getAgentAllStudents');
                                                    })
                                                    StudentServices.getAllStudents().then(res => {
                                                        console.log(res, 'syudentData');
                                                        setAllStudents(res.data.students)
                                                        // if (localStorage.getItem('agentdets') !== "undefined") {
                                                        //     var newArr = res.data.students.filter(function (obj) {
                                                        //         console.log(obj?.agent_id, 'allage0');
                                                        //         return obj?.agent_id === JSON.parse(localStorage.getItem('agentdets'))?.id
                                                        //     })
                                                        //     setAgentAllStudents(newArr)
                                                        // }
                                                    })
                                                    setEditModal(false);
                                                }).catch(e => {
                                                    console.log(e, 'dadea');
                                                    console.log(e.response.data, 'error');
                                                    // if (e.response.status === 500) {
                                                    //     console.log('errorsdas');
                                                    //     setError("The NIC has been already been taken.")

                                                    // } else if (e.response.data.message) {
                                                    //     if (e.response.data.errors.mobileNo) {
                                                    //         setError(e.response.data.errors.mobileNo[0])
                                                    //     }
                                                    // }
                                                })
                                            }}
                                        >
                                            {({ handleChange, handleBlur, values, errors, touched }) => (
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
                                                            className="form-control"
                                                            id="address"
                                                            name="address"
                                                            placeholder="Enter Your Address"
                                                            onBlur={handleBlur}
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
                                                                    disabled
                                                                />
                                                                {errors?.mobileNo && touched?.mobileNo ? (
                                                                    <FormFeedback type="invalid">{errors?.mobileNo}</FormFeedback>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                        <Col lg={6}>
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
                                                    </Row>

                                                    <Row>
                                                        <Col md={8}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Status</Label>
                                                                <Input
                                                                    type="select"
                                                                    id="agent"
                                                                    name="status"
                                                                    className="form-control"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                >
                                                                    <option value='CONTACTED_NO_ANSWER'>Contacted (No Answer)</option>
                                                                    <option value='CONTACTED_NUMBER_BUSY'>Contacted (Number Busy)</option>
                                                                    <option value='CONTACTED_SUCCESS'>Contacted (Success)</option>
                                                                    {/* {allAgents.map((agent) => (
                                                                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                                                                    ))} */}
                                                                </Input>
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <div>
                                                        <button type="submit" className="btn btn-primary w-md">
                                                            Update
                                                        </button>
                                                    </div>

                                                </Form>
                                            )}
                                        </Formik>
                                    </CardBody>
                                </Card>
                            </Modal>



                        </div>
                    </Col>
                </Row>

                <br></br>
                <Container fluid>

                    {/* table body */}



                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {
                                        authUser?.roles[0]?.name === 'agent' ?
                                            <TableContainer
                                                columns={columnsAgent}
                                                data={agentAllStudents}
                                                isGlobalFilter={true}
                                                handleUserClick={handleUserClicks}
                                                customPageSize={10}
                                                className="custom-header-css"
                                            /> :
                                            <TableContainer
                                                columns={columns}
                                                data={allStudents}
                                                isGlobalFilter={true}
                                                handleUserClick={handleUserClicks}
                                                customPageSize={10}
                                                className="custom-header-css"
                                            />
                                    }


                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>


            </div>
        </React.Fragment>
    );
};

export default withRouter(StudentList);
