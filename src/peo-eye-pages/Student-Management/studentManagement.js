import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardTitle, Button, Table, Input, Modal, Label, FormFeedback, Alert } from "reactstrap";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter } from "react-router-dom";
import { useState } from "react";
import StudentServices from "peo-eye-services/studentServices";
import Swal from "sweetalert2";
import { useEffect } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
import { Form, Formik } from "formik";
import DeleteModal from "components/Common/DeleteModal";
import * as Yup from 'yup';
import AdminService from "peo-eye-services/AdminService";
import ReactLoading from 'react-loading';
import BatchService from "../../peo-eye-services/BatchService"
import * as moment from "moment"
import Pagination from 'react-responsive-pagination';
import DatePicker from "react-datepicker"
// const students = [
//     { id: 1, number: 'ewfw', name: 'fwf', message: 'fwfwe' },
//     { id: 2, number: '', name: '', message: '' },
//     { id: 3, number: '', name: '', message: '' }
// ];


function actionsFormatter(cell) {
    //console.log(cell, 'vhuviuvhu')
    return moment(cell).utc().format('YYYY-MM-DD') ;
}

const StudentManagement = props => {
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [state, setState] = useState([]);
    const [allAgents, setAllAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState();
    const [agentAllStudents, setAgentAllStudents] = useState([]);
    const [adminAllStudents, setAdminAllStudents] = useState([]);
    const [student_dets, setStudentDets] = useState();
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));
    const [modal_standard, setmodal_standard] = useState(false);
    const [myStudent, setMyStudent] = useState(false);
    const [authAgent, setAuthAgent] = useState();
    const [loading, setLoading] = useState(true);
    const [allActiveBatches, setAllActiveBatches] = useState([]);
    const [allBatches, setAllBatches] = useState([]);
    // all students page
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [sizePerPage, setPageSize] = useState(2);
    const [pagination, setPagination] = useState(true);
    const [filter, setFilter] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [filterData, setFilterData] = useState({});

    function tog_standard() {
        setmodal_standard(!modal_standard);
        // removeBodyCss();
    }

    //get all students admin
    useEffect(() => {
        setAuthUser(JSON.parse(localStorage.getItem('authUser')));
        getAllTypesStudents();
    }, []);



    const getAllTypesStudents = (pageNumber = 1) => {
        setPagination(true);
        setLoading(true);
        setFilter(false);
        console.log(currentPage, 'currentPage----')
        if (localStorage.getItem('agentdets') !== "undefined") {
            StudentServices.getAgentAllStudents(pageNumber).then(resp => {
                console.log(resp.data.students, 'one');
                setAgentAllStudents(resp.data.students.data)
                setStudents(resp.data.students.data)
                setPageCount(resp.data.students.last_page);
                setCurrentPage((resp.data.students.current_page))
                 setLoading(false)

            })
            setAuthAgent(JSON.parse(localStorage.getItem('agentdets')));
        } else {
            StudentServices.getAllStudents(pageNumber).then(res => {
                console.log(res.data.students.data, 'two');
                setAllStudents(res.data.students.data)
                setStudents(res.data.students.data);
                setPageCount(res.data.students.last_page);
                setCurrentPage((res.data.students.current_page))
                setLoading(false)
            })
        }
        if (authUser?.roles[0]?.name !== 'agent') {
            StudentServices.getAdminAllStudents().then(resp => {
                // admins - my students
                console.log(res.data.students, 'three');
                setAdminAllStudents(resp.data.students)
                //setLoading(false)
            })
        }
    }
    const  retrieveBatches = () => {
        setLoading(true)
        BatchService.getAllBatches()
          .then((response) => {
              setLoading(false)
              const result = response.data.data.reduce((agg, item, index) => {
                  agg[item.name.toString()] = item.name;
                  return agg;
              }, {})

              setAllBatches(result);
          })
          .catch((e) => {
              //console.log(e);
          })
    }

    const filterAdminStudents = () => {
        setStudents(adminAllStudents)
        setMyStudent(true)
    }

    const filterAllStudents = () => {

        setStudents(allStudents)
        setMyStudent(false);
        setPagination(true);
    }

    //get all agents with students count
    useEffect(() => {
        StudentServices.getAllAgentsWithStudentCount().then(res => {
            res.data.agent.sort(function (a, b) {
                return a.NoOfStd - b.NoOfStd;
            })
            setAllAgents(res.data.agent)
            setSelectedAgent(res.data.agent[0].id)
        })
    }, []);

    //get all batches
    useEffect(() => {
        retrieveBatches();
        StudentServices.getAllBatches().then(res => {
            setAllActiveBatches(res.data.batches)
        })
    }, []);

    const pageChange = (pageNumber) => {
        console.log(pageNumber);
        setCurrentPage(pageNumber);
        getAllTypesStudents(pageNumber);

    }

    const columns = [
        {
            dataField: "id",
            text: "ID",
        },
        {
            dataField: "mobileNo",
            text: "Mobile",
            editable: false
        },
        {
            dataField: "fullName",
            text: "Name",
            editable: false,
            bgColor: '#00BFFF'
        },
        {
            dataField: "message",
            text: "Message",
            editable: false
        },
        {
            dataField: "status",
            text: "Status",
            editor: {
                type: Type.SELECT,
                options: [{
                    value: 'CALL_NOT_WORK',
                    label: 'CALL_NOT_WORK'
                }, {
                    value: 'CALL_NUMBER_BUSY',
                    label: 'CALL_NUMBER_BUSY'
                }, {
                    value: 'CALL_NOT_ANSWER',
                    label: 'CALL_NOT_ANSWER'
                }, {
                    value: 'CALL_ANSWER_SUCCESS',
                    label: 'CALL_ANSWER_SUCCESS'
                }]
            },
            validator: (newValue, row, column, done) => {

                if (newValue === '') {

                    return {
                        valid: false,
                    };
                }
                return true;
            }
        },
        {
            dataField: "details_status",
            text: "Send Details",
            editor: {
                type: Type.SELECT,
                options: [{
                    value: 'NONE',
                    label: 'None'
                }, {
                    value: 'Payment Details',
                    label: 'Payment Details'
                }, {
                    value: 'Intro Msg',
                    label: 'Intro Msg'
                }]
            },
        },
        {
            dataField: "important_status",
            text: "Important Status",
            editor: {
                type: Type.SELECT,
                options: [{
                    value: 'MOST_IMPORTANT',
                    label: 'MOST_IMPORTANT'
                }, {
                    value: 'IMPORTANT',
                    label: 'IMPORTANT'
                }, {
                    value: 'NOT_IMPORTANT',
                    label: 'NOT_IMPORTANT'
                }]
            },
        },
        {
            dataField: "comment",
            text: "Comment",
        },
        {
            dataField: "databasePkey",
            text: "Remove",
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <Button
                    >
                        Follow
                    </Button>
                );
            }
        },
    ];

    const selectOptionsCall = {
        'CALL_NOT_YET': 'CALL_NOT_YET',
        'CALL_NOT_WORK': 'CALL_NOT_WORK',
        'CALL_NUMBER_BUSY': 'CALL_NUMBER_BUSY',
        'CALL_NOT_ANSWER': 'CALL_NOT_ANSWER',
        'CALL_ANSWER_SUCCESS': 'CALL_ANSWER_SUCCESS'
    };

    const selectOptionsDetails = {
        'NONE': 'NONE',
        'LINK_SHARED': 'LINK_SHARED',
        'PAYMENT_DETAILS': 'PAYMENT_DETAILS',
        'INTRO_MSG': 'INTRO_MSG'
    };

    const selectOptionsImportant = {
        'NOT_YET': 'NOT_YET',
        'MOST_IMPORTANT': 'MOST_IMPORTANT',
        'IMPORTANT': 'IMPORTANT',
        'NOT_IMPORTANT': 'NOT_IMPORTANT'
    };
    const selectOptionsCreationType = {
        'AGENT_FOUND_STUDENT': 'AGENT_FOUND_STUDENT',
        'ADMIN_ALLOCATED_STUDENT': 'ADMIN_ALLOCATED_STUDENT',
        'ADMIN_FOUND_STUDENT': 'ADMIN_FOUND_STUDENT'
    };
    const selectOptionsStudentType = {
        'NO_PAYMENT': 'Registered',// registered students
        'FULL_PAYMENT_VERIFY': 'Payment Done', // all payments done
        'HALF_PAYMENT_VERIFY': 'First Half Payment Done',// half payment option - first half done
        'FIRST_PAYMENT_PENDING': 'First Half Payment in Pending', // first payment in pending state
        'SECOND_PAYMENT_PENDING': 'Second Half Payment in Pending',// second payment in pending state
        'FULL_PAYMENT_PENDING': 'Full Payment in Pending',// full payment in pending state
        'FIRST_PAYMENT_DECLINED': 'First Half Payment Declined',// first payment declined
        'SECOND_PAYMENT_DECLINED': 'Second Half Payment Declined',// second payment declined
        'FULL_PAYMENT_DECLINED': 'Full Payment Declined',// full payment declined
        'OTHER_PAYMENT_PENDING': 'Other Payment Pending',// full payment declined
        'OTHER_PAYMENT_DECLINED': 'Other Payment Declined',// full payment declined
        'OTHER_PAYMENT_VERIFY': 'Other Payment Done',// full payment declined
    };
    // Array options
    const selectOptionsArr = [{
        value: 'MOST_IMPORTANT',
        label: 'MOST_IMPORTANT'
    }, {
        value: 'IMPORTANT',
        label: 'IMPORTANT'
    }, {
        value: 'NOT_IMPORTANT',
        label: 'NOT_IMPORTANT'
    }];
    const selectOptionsBatch = {
        'batch01': 'batch01',
        'batch02': 'batch02',
        'batch03': 'batch03'
    };

    let columns1;

    if (authUser?.roles[0]?.name === 'agent') {
        columns1 = [
            {
                dataField: "id",
                text: "ID",
            },
            {
                dataField: "mobileNo",
                text: "Mobile",
            },
            {
                dataField: "fullName",
                text: "Name",
            },
            {
                dataField: "studentId",
                text: "Student Id",
            },
            {
                dataField: "created_at",
                text: "Created Date",
                formatter: cell => actionsFormatter(cell)
            },
            {
                dataField: "batch.name",
                text: "Batch",
            },
            {
                dataField: "message",
                text: "Message",
            },
            {
                dataField: "call_status",
                text: "Call Status",
                formatter: cell => selectOptionsCall[cell],
                /*filter: selectFilter({
                    options: selectOptionsCall
                })*/
            },
            {
                dataField: "payment_type_links",
                text: "Student Type",
                formatter: cell => selectOptionsStudentType[cell],
                /*filter: selectFilter({
                    options: selectOptionsStudentType
                })*/
            },
            {
                dataField: "details_status",
                text: "Send Details",
                formatter: cell => selectOptionsDetails[cell],
                /*filter: selectFilter({
                    options: selectOptionsDetails
                })*/
            },
            {
                dataField: "important_status",
                text: "Important Status",
                formatter: cell => selectOptionsImportant[cell],
                // formatter: cell => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
                /*filter: selectFilter({
                    options: selectOptionsImportant
                })*/

            },
            {
                dataField: "comment",
                text: "Comment",
            },
            {
                dataField: "allocationType",
                text: "Created Type",
                formatter: cell => selectOptionsCreationType[cell],
                /*filter: selectFilter({
                    options: selectOptionsCreationType
                })*/
            },
            {
                dataField: "databasePkey",
                text: "Action",
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return (
                        <Button color="success"
                            className="btn btn-success waves-effect waves-light"
                            onClick={() => {
                                openModal(row);
                            }}
                        >
                            Edit
                        </Button>
                    );
                }
            },
        ];
    } else if(authUser?.roles[0]?.name === 'normal-admins') {
        columns1 = [
            {
                dataField: "id",
                text: "ID",
            },
            {
                dataField: "mobileNo",
                text: "Mobile",
                //filter: textFilter()
            },
            {
                dataField: "fullName",
                text: "Name",
            },
            {
                dataField: "studentId",
                text: "Student Id",
            },
            {
                dataField: "created_at",
                text: "Created Date",
                formatter: cell => actionsFormatter(cell)
            },
            {
                dataField: "batch.name",
                text: "Batch",
                //filter: textFilter()
            },
            {
                dataField: "message",
                text: "Message",
            },
            {
                dataField: "agent.name",
                text: "Agent",
                //filter: textFilter()
            },
            {
                dataField: "call_status",
                text: "Call Status",
                formatter: cell => selectOptionsCall[cell],
                /*filter: selectFilter({
                    options: selectOptionsCall
                })*/
            },
            {
                dataField: "payment_type_links",
                text: "Student Type",
                formatter: cell => selectOptionsStudentType[cell],
                /*filter: selectFilter({
                    options: selectOptionsStudentType
                })*/
            },
            {
                dataField: "details_status",
                text: "Send Details",
                formatter: cell => selectOptionsDetails[cell],
                /*filter: selectFilter({
                    options: selectOptionsDetails
                })*/
            },
            {
                dataField: "important_status",
                text: "Important Status",
                formatter: cell => selectOptionsImportant[cell],
                // formatter: cell => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
                /*filter: selectFilter({
                    options: selectOptionsImportant
                })*/

            },
            {
                dataField: "comment",
                text: "Comment",
            },
            {
                dataField: "allocationType",
                text: "Created Type",
                formatter: cell => selectOptionsCreationType[cell],
                /*filter: selectFilter({
                    options: selectOptionsCreationType
                })*/
            },
            {
                dataField: "databasePkey",
                text: "Action",
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return (
                      <Button color="success"
                              className="btn btn-success waves-effect waves-light"
                              onClick={() => {
                                  openModal(row);
                              }}
                      >
                          Edit
                      </Button>
                    );
                }
            },
        ];

    }else if(authUser?.roles[0]?.name === 'super-admin') {
        columns1 = [
            {
                dataField: "id",
                text: "ID",
            },
            {
                dataField: "mobileNo",
                text: "Mobile",
                //filter: textFilter()
            },
            {
                dataField: "fullName",
                text: "Name",
            },
            {
                dataField: "studentId",
                text: "Student Id",
            },
            {
                dataField: "created_at",
                text: "Created Date",
                formatter: cell => actionsFormatter(cell)
            },
            {
                dataField: "batch.name",
                text: "Batch",
                //filter: textFilter()
            },
            {
                dataField: "message",
                text: "Message",
            },
            {
                dataField: "agent.name",
                text: "Agent",
                //filter: textFilter()
            },
            {
                dataField: "payment_type_links",
                text: "Student Type",
                formatter: cell => selectOptionsStudentType[cell],
                /*filter: selectFilter({
                    options: selectOptionsStudentType
                })*/
            },
            {
                dataField: "call_status",
                text: "Call Status",
                formatter: cell => selectOptionsCall[cell],
                /*filter: selectFilter({
                    options: selectOptionsCall
                })*/
            },
            {
                dataField: "details_status",
                text: "Send Details",
                formatter: cell => selectOptionsDetails[cell],
                /*filter: selectFilter({
                    options: selectOptionsDetails
                })*/
            },
            {
                dataField: "important_status",
                text: "Important Status",
                formatter: cell => selectOptionsImportant[cell],
                // formatter: cell => selectOptionsArr.filter(opt => opt.value === cell)[0].label || '',
                /*filter: selectFilter({
                    options: selectOptionsImportant
                })*/

            },
            {
                dataField: "comment",
                text: "Comment",
            },
            {
                dataField: "allocationType",
                text: "Created Type",
                formatter: cell => selectOptionsCreationType[cell],
                /*filter: selectFilter({
                    options: selectOptionsCreationType
                })*/
            },
            {
                dataField: "databasePkey",
                text: "Action",
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return (
                        <div className="d-flex gap-3">
                            <Button
                                color="success"
                                className="btn btn-success waves-effect waves-light"
                                onClick={() => {
                                    openModal(row);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                color="danger"
                                className="btn btn-danger waves-effect waves-light"
                                onClick={() => {
                                    userDelete(row);
                                }}
                            >
                                Delete
                            </Button>
                        </div>

                    );
                }
            },
        ];
    }


    const openModal = (val) => {
        setmodal_standard(true)
        setStudentDets(val)
    }

    const rowStyle = (row, rowIndex) => {
        const style = {};
        if (row.priority === 'High') {
            style.backgroundColor = '#f46a6a ';
        }

        return style;
    };


    const saveData = () => {

    }

    const allocateAgent = () => {


    }

    function tog_standard() {
        setmodal_standard(!modal_standard);
        // removeBodyCss();
    }

    //delete customer
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [student_id, setStudentId] = useState();
    const [registerModal, setRegisterModal] = useState(false);
    const [error, setError] = useState(null)
    const [isAssigntoAdmin, setIsAssigntoAdmin] = useState(false)

    const addStudentSchema = Yup.object().shape({
        fullName: Yup.string()
            .min(5, 'Too Short!')
            .max(50, 'Too Long!'),
        address: Yup.string()
            .min(5, 'Too Short!')
            .max(50, 'Too Long!'),
        mobileNo: Yup.string()
          .min(9, 'Invalid  mobile number!')
            .max(12, 'Invalid  mobile number!')
            .required('Mobile number is required'),
        nic: Yup.string()
    });

    function tog_standardRegister() {
        setRegisterModal(!registerModal);
        // removeBodyCss();
    }

    const onClickDelete = users => {
        setStudentId(users?.id);

        setDeleteModal(true);
    };

    const userDelete = users => {


        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
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

                StudentServices.deleteStudent(users?.id).then(res => {
                    getAllTypesStudents();
                    Swal.close();
                    swalWithBootstrapButtons.fire(
                        'Deleted!',
                        'User has been deleted.',
                        'success'
                    )
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                )
            }
        })
    };

    const handleDeleteUser = () => {

        StudentServices.deleteStudent(student_id).then(res => {

        });
        getAllTypesStudents();
        setDeleteModal(false);
    };

    const handleFilter = (values) => {
        setFilter(true);
        setPagination(false);
        console.log(values, 'filter form values');
        let agent = null;
        if (authUser?.roles[0]?.name === 'agent') {
            agent =authAgent?.name;
        }else{
            agent = values.agent_filter
        }
        const filterObj = {
            mobileNo:values.mobile_no_filter,
            agent_id:agent,
            batchid:values.batch_filter,
            call_status:values.call_status_filter,
            details_status:values.send_details_filter,
            allocationType:values.created_type_filter,
            important_status:values.important_status_filter,
            payment_type_links:values.student_type_filter,
            source_of_information:values.source_of_information,
            student_find_about:values.student_find_about,
            date:startDate ? moment(startDate).utc().format("YYYY-MM-DD") : ""
        }
        setFilterData(filterObj);
        StudentServices.filterStudents(filterObj).then(res => {
            console.log(res, 'response of filter');
            setStudents(res.data.students);

        });
    };

    const filteredStudentsAfterEdit = () =>{
        if (filter){
            //filtered students
            console.log(filterData, 'filter data');
            StudentServices.filterStudents(filterData).then(res => {
                console.log(res, 'response of filter');
                setStudents(res.data.students);
            });
        }
        else{
            console.log('tesmp solution')
        }
    }
    const [studenttLink, setStudentLink] = useState();
    const [agentStudenttLink, setAgentStudentLink] = useState();
    useEffect(() => {
        let linkArray;
        AdminService.getAllLinks(authUser?.id).then(res => {


            if (authUser?.roles[0]?.name === 'agent') {
                linkArray = res.data.agents;
                for (let i = 0; i < linkArray.length; i++) {
                    if (linkArray[i].type === 1) {

                        setStudentLink(linkArray[i].link)
                    } else if (linkArray[i].type === 0) {

                        setAgentStudentLink(linkArray[i].link)
                    }
                }
            } else {
                linkArray = res.data.admin;
                for (let i = 0; i < linkArray.length; i++) {
                    if (linkArray[i].type === 2) {

                        setStudentLink(linkArray[i].link)
                    }
                }
            }
            setLoading(false)
        })
    }, [])

    const copyToCLipboard = (link) => {

        if (link === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        } else {
            navigator.clipboard.writeText(link)
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
    const Form1 = () => {
        const handleSubmit1 = (values) => {
            console.log("Form 1 submitted:", values);
        };

        return (
          <Formik initialValues={{call_status_filter:''}} onSubmit={async values => {
              console.log(values, 'valjues')}} >
              {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form>
                  <Row>
                      <Col md={6}>
                          <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Call Status</Label>
                              <Input
                                type="select"
                                id="call_status_filter"
                                name="call_status_filter"
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                values={values?.call_status_filter}
                              >
                                  <option value='CALL_NOT_YET'>CALL_NOT_YET</option>
                                  <option value='CALL_NOT_WORK'>CALL_NOT_WORK</option>
                                  <option value='CALL_NUMBER_BUSY'>CALL_NUMBER_BUSY</option>
                                  <option value='CALL_NOT_ANSWER'>CALL_NOT_ANSWER</option>
                                  <option value='CALL_ANSWER_SUCCESS'>CALL_ANSWER_SUCCESS</option>
                              </Input>
                          </div>
                      </Col>
                      {/*<Col md={6}>
                          <div className="mb-3">
                              <Label htmlFor="formrow-email-Input">Send Details Status</Label>
                              <Input
                                type="select"
                                id="details_status"
                                name="details_status"
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.details_status}
                              >
                                  <option value='NONE'>None</option>
                                  <option value='LINK_SHARED'>LINK_SHARED</option>
                                  <option value='PAYMENT_DETAILS'>PAYMENT_DETAILS</option>
                                  <option value='INTRO_MSG'>INTRO_MSG</option>
                              </Input>
                          </div>
                      </Col>*/}
                  </Row>
                  <div>
                      <button type="submit" className="btn btn-primary w-md">
                          Update
                      </button>
                  </div>
              </Form>)}
          </Formik>
        );
    };


    //meta title
    document.title = "Student Management | Peo Eye Admin Panel";
    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteUser}
                onCloseClick={() => setDeleteModal(false)}
            />

            <div className="page-content">
                <div className="container-fluid">
                    {/* <Breadcrumbs title="Tables" breadcrumbItem="Student Management" /> */}
                    {authUser?.roles[0]?.name !== 'agent' ?

                        <Row>
                            <Col>
                                <h3>Student Management ({authUser?.roles[0]?.name})</h3>
                            </Col>

                            {/* <Col>
                                <div style={{ paddingLeft: "80%" }}>
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
                            </Col> */}

                            <Col style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "20px" }}>
                                <div>
                                    <Button color="primary"
                                        className="btn btn-primary waves-effect waves-light"
                                        type="button"
                                        onClick={() => {
                                            tog_standardRegister();
                                        }}
                                        data-toggle="modal"
                                        data-target="#myModal"
                                    >
                                        REGISTER
                                    </Button>
                                </div>{myStudent ?
                                    <div >
                                        <Button color="primary"
                                            className="btn btn-primary waves-effect waves-light"
                                            type="button"
                                            onClick={() => {
                                                filterAllStudents();
                                            }}
                                            data-toggle="modal"
                                            data-target="#myModal"
                                        >
                                            All Students
                                        </Button>
                                    </div>
                                    :
                                    <div>
                                        <Button color="primary"
                                            className="btn btn-primary waves-effect waves-light"
                                            type="button"
                                            onClick={() => {
                                                filterAdminStudents();
                                            }}
                                            data-toggle="modal"
                                            data-target="#myModal"
                                        >
                                            My Students
                                        </Button>
                                    </div>

                                }</Col>

                        </Row> :


                        <Row>
                            <Col>
                                <h3>Student Management</h3>
                            </Col>
                            <Col>
                                <div style={{ paddingLeft: "80%" }}>
                                    <div className="d-flex gap-3">
                                        <Button color="primary"
                                            className="btn btn-primary waves-effect waves-light"
                                            type="button"
                                            onClick={() => {
                                                tog_standardRegister();
                                            }}
                                            data-toggle="modal"
                                            data-target="#myModal"
                                        >
                                            REGISTER
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>}
                    <br></br>

                    <Row>
                        <Modal
                            isOpen={registerModal}
                            toggle={() => {
                                tog_standardRegister();
                            }}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title mt-0" id="myModalLabel">
                                    Student Register
                                </h5>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRegisterModal(false);
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
                                            // fullName: '',
                                            // address: '',
                                            mobileNo: '',
                                            // nic: '',
                                            // agent: allAgents[0]?.id
                                        }}
                                        validationSchema={addStudentSchema}
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
                                            setError(null)
                                            let regDets;

                                            if (authUser?.roles[0]?.name === 'agent') {
                                                regDets = {
                                                    // fullName: values.fullName,
                                                    mobileNo: values.mobileNo,
                                                    // nic: values.nic,
                                                    // address: values.address,
                                                    requesttype: 3,
                                                    status: 'AGENT_ENTERED',
                                                    agent_id: authAgent?.id
                                                }
                                            } else {
                                                regDets = {
                                                    // fullName: values.fullName,
                                                    mobileNo: values.mobileNo,
                                                    // nic: values.nic,
                                                    // address: values.address,
                                                    requesttype: 3,
                                                    status: 'ADMIN_ENTERED',
                                                    admin_id: authUser?.id
                                                }
                                            }

                                            await StudentServices.registerStudent(regDets).then(res => {
                                                Swal.fire(
                                                    "Student Added Successfully!",
                                                    "",
                                                    "success"
                                                )
                                                setError(null)
                                                getAllTypesStudents();
                                                Swal.close();
                                                setRegisterModal(false)
                                            }).catch(e => {
                                                Swal.close();
                                                if (e.response.status === 500) {
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
                                                {/* <div className="mb-3">
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
                                                </div> */}

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
                                                    {/* <Col lg={6}>
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
                                                    </Col> */}
                                                </Row>

                                                <Row>
                                                    <Col md={8}>
                                                        {/*{
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
                                                                                <option key={agent.id} value={agent.id}>{agent.name} - Students({agent.NoOfStd})</option>
                                                                            ))}
                                                                        </Input>
                                                                    </div>
                                                                </>
                                                        }*/}

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
                        <Modal isOpen={modal_standard}
                            toggle={() => {
                                tog_standard();
                            }}>

                            <div className="modal-header">
                                <h5 className="modal-title mt-0" id="myModalLabel">
                                    Edit Student Details
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
                                        {student_dets ?
                                          <div className="table-responsive">
                                              <table className="table">
                                                  <tbody>
                                                  <tr>
                                                      <th scope="col">NIC :</th>
                                                      <td scope="col">{student_dets?.nic}</td>
                                                  </tr>
                                                  <tr>
                                                      <th scope="row">Address</th>
                                                      <td><span className="badge badge-soft-info">{student_dets?.address}</span></td>
                                                  </tr>
                                                  <tr>
                                                      <th scope="row">Age:</th>
                                                      <td>{student_dets?.age}</td>
                                                  </tr>
                                                  <tr>
                                                      <th scope="row">District:</th>
                                                      <td>{student_dets?.district}</td>
                                                  </tr>
                                                  <tr>
                                                      <th scope="row">Found About Peo eye - Added by Admin:</th>
                                                      <td>{student_dets?.findabout}</td>
                                                  </tr>
                                                  <tr>
                                                      <th scope="row">Found About Peo eye - Added by Student:</th>
                                                      <td>{student_dets?.student_find_about}</td>
                                                  </tr>
                                                  <tr>
                                                      <th scope="row">Created Date:</th>
                                                      <td>{moment(student_dets?.created_at).utc().format('YYYY-MM-DD')}</td>
                                                  </tr>

                                                           </tbody>
                                              </table>
                                          </div> : null}
                                    </CardBody>
                                </Card>
                            <Card>
                                <CardBody>
                                    <Formik
                                        initialValues={{
                                            call_status: student_dets?.call_status ? student_dets?.call_status : 'CALL_NOT_YET',
                                            details_status: student_dets?.details_status ? student_dets?.details_status : 'NONE',
                                            important_status: student_dets?.important_status ? student_dets?.important_status : 'NOT_YET',
                                            batch: student_dets?.batch_id ,
                                            comment: student_dets?.comment ? student_dets?.comment : '',
                                            fullName: student_dets?.fullName ? student_dets?.fullName : '',
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

                                            const updateDets = {
                                                call_status: values.call_status,
                                                details_status: values.details_status,
                                                important_status: values.important_status,
                                                batch: values.batch,
                                                comment: values.comment,
                                                fullName: values.fullName,
                                                priority:student_dets.priority
                                            }

                                            await StudentServices.editStudent(student_dets?.id, updateDets).then(res => {
                                                console.log(updateDets,'sudda')
                                                Swal.close()
                                                Swal.fire(
                                                    "Student Update Successfully!",
                                                    ` <p>${updateDets?.batch}</p>` +
                                                  `<p>${ updateDets?.call_status}</p>`,
                                                  `<p>${ updateDets?.details_status}</p>`,
                                                  `<p>${ updateDets?.important_status}</p>`,
                                                  `<p>${ updateDets?.comment}</p>`,
                                                  `<p>${ updateDets?.fullName}</p>`,
                                                    "success"
                                                )
                                                /*getAllTypesStudents(); authenticated ? renderApp() : renderLogin();
                                                handleFilter();*/
                                                filteredStudentsAfterEdit();

                                                setmodal_standard(false);
                                            }).catch(e => {
                                                Swal.close();
                                                Swal.fire({
                                                  icon: 'error',
                                                  title: 'Oops...',
                                                  text: 'Something went wrong!',
                                                })
                                            })
                                        }}>

                                        {({ handleChange, handleBlur, values, errors, touched }) => (
                                            <Form>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="formrow-email-Input">Call Status</Label>
                                                            <Input
                                                                type="select"
                                                                id="agent"
                                                                name="call_status"
                                                                className="form-control"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values?.call_status}
                                                            >
                                                                <option value='CALL_NOT_YET'>CALL_NOT_YET</option>
                                                                <option value='CALL_NOT_WORK'>CALL_NOT_WORK</option>
                                                                <option value='CALL_NUMBER_BUSY'>CALL_NUMBER_BUSY</option>
                                                                <option value='CALL_NOT_ANSWER'>CALL_NOT_ANSWER</option>
                                                                <option value='CALL_ANSWER_SUCCESS'>CALL_ANSWER_SUCCESS</option>
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="formrow-email-Input">Send Details Status</Label>
                                                            <Input
                                                                type="select"
                                                                id="details_status"
                                                                name="details_status"
                                                                className="form-control"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values?.details_status}
                                                            >
                                                                <option value='NONE'>None</option>
                                                                <option value='LINK_SHARED'>LINK_SHARED</option>
                                                                <option value='PAYMENT_DETAILS'>PAYMENT_DETAILS</option>
                                                                <option value='INTRO_MSG'>INTRO_MSG</option>
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="formrow-email-Input">Important Status</Label>
                                                            <Input
                                                                type="select"
                                                                id="important_status"
                                                                name="important_status"
                                                                className="form-control"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values?.important_status}
                                                            >
                                                                <option value='NOT_YET'>NOT_YET</option>
                                                                <option value='MOST_IMPORTANT'>MOST_IMPORTANT</option>
                                                                <option value='IMPORTANT'>IMPORTANT</option>
                                                                <option value='NOT_IMPORTANT'>NOT_IMPORTANT</option>
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
                                                                <option value={null}></option>
                                                                {allActiveBatches.map((batch) => (
                                                                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="formrow-firstname-Input">Comment</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="comment"
                                                                name="comment"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values?.comment}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="formrow-firstname-Input">Name</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="fullName"
                                                                name="fullName"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values?.fullName}
                                                            />
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

                        <Col>
                            <Card>
                                <CardBody>


                                    {loading ? <>
                                        <center>
                                            <ReactLoading type='bubbles' color='#000' height={'5%'} width={'5%'} />
                                        </center>
                                    </>
                                        : <>
                                            {authUser?.roles[0]?.name === 'agent' ?
                                                <div className="action-button" style={{ paddingLeft: '64%' }}>
                                                    <Row>
                                                        <Col>
                                                            <Button color="dark"
                                                                className="btn btn-dark waves-effect waves-light" onClick={() => copyToCLipboard(agentStudenttLink)}>Copy Self Found Student Creation Link</Button>
                                                        </Col>
                                                        <Col>
                                                            <Button color="dark"
                                                                className="btn btn-dark waves-effect waves-light" onClick={() => copyToCLipboard(studenttLink)}>Copy Student Creation Link</Button>
                                                        </Col>
                                                    </Row>
                                                </div> :
                                                <div className="action-button" style={{ paddingLeft: '85.5%' }}>
                                                    <Row>
                                                        <Col>
                                                            <Button color="dark"
                                                                className="btn btn-dark waves-effect waves-light" onClick={() => copyToCLipboard(studenttLink)}>Copy Student Creation Link</Button>
                                                        </Col>
                                                    </Row>
                                                </div>}
                                          {/*filter field*/}
                                          <Formik initialValues={{
                                              call_status_filter:'',
                                              mobile_no_filter:'',
                                              batch_filter:'',
                                              agent_filter:'',
                                              student_type_filter:'',
                                              send_details_filter:'',
                                              important_status_filter:'' ,
                                              created_type_filter:'',
                                              date:startDate,
                                              source_of_information:'',
                                              student_find_about:''
                                          }} onSubmit={async values => {handleFilter(values)}} >
                                              {({ handleChange, handleBlur, values, errors, touched }) => (
                                                <Form>
                                                    <Row>
                                                        <Col md={3}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-password-Input">Mobile Number</Label>
                                                                <Input
                                                                  type="number"
                                                                  id="mobile_no_filter"
                                                                  name="mobile_no_filter"
                                                                  className="form-control"
                                                                  onBlur={handleBlur}
                                                                  onChange={handleChange}
                                                                  value={values?.mobile_no_filter}
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Student Type</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="student_type_filter"
                                                                  name="student_type_filter"
                                                                  className="form-control"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  values={values?.student_type_filter}
                                                                >
                                                                    <option value=''>SELECT </option>
                                                                    <option value='NO_PAYMENT'>Registered</option>
                                                                    <option value='FULL_PAYMENT_VERIFY'>Payment Done</option>
                                                                    <option value='HALF_PAYMENT_VERIFY'>First Half Payment Done</option>
                                                                    <option value='FIRST_PAYMENT_PENDING'>First Half Payment in Pending</option>
                                                                    <option value='SECOND_PAYMENT_PENDING'>Second Half Payment in Pending</option>
                                                                    <option value='FULL_PAYMENT_PENDING'>Full Payment in Pending</option>
                                                                    <option value='FIRST_PAYMENT_DECLINED'>First Half Payment Declined</option>
                                                                    <option value='SECOND_PAYMENT_DECLINED'>Second Half Payment Declined</option>
                                                                    <option value='FULL_PAYMENT_DECLINED'>Full Payment Declined</option>
                                                                </Input>
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Important Status</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="important_status_filter"
                                                                  name="important_status_filter"
                                                                  className="form-control"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  values={values?.important_status_filter}
                                                                >
                                                                    <option value=''>SELECT </option>
                                                                    <option value='NOT_YET'>NOT_YET</option>
                                                                    <option value='MOST_IMPORTANT'>MOST_IMPORTANT</option>
                                                                    <option value='IMPORTANT'>IMPORTANT</option>
                                                                    <option value='NOT_IMPORTANT'>NOT_IMPORTANT</option>
                                                                </Input>
                                                            </div>

                                                          <div className="mb-3">
                                                            <Label htmlFor="formrow-email-Input">Source of Information ( Admin Added)</Label>
                                                            <Input
                                                              type="select"
                                                              id="source_of_information"
                                                              name="source_of_information"
                                                              className="form-control"
                                                              onChange={handleChange}
                                                              onBlur={handleBlur}
                                                              values={values?.source_of_information}
                                                            >
                                                              <option value=''>SELECT </option>
                                                              <option value='WhatsApp'>WhatsApp</option>
                                                              <option value='Facebook'>Facebook</option>
                                                              <option value='Hotline'>Hotline</option>
                                                              <option value='Telegram'>Telegram</option>
                                                              <option value='Tiktok'>Tiktok</option>
                                                            </Input>
                                                          </div>
                                                        </Col>
                                                        <Col md={3}>
                                                            {authUser?.roles[0]?.name !== 'agent' &&
                                                            (<div className="mb-3">
                                                                <Label htmlFor="formrow-password-Input">Agent</Label>
                                                                <Input
                                                                  type="text"
                                                                  id="agent_filter"
                                                                  name="agent_filter"
                                                                  className="form-control"
                                                                  onBlur={handleBlur}
                                                                  onChange={handleChange}
                                                                  value={values?.agent_filter}
                                                                />
                                                            </div>)}
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Call Status</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="call_status_filter"
                                                                  name="call_status_filter"
                                                                  className="form-control"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  values={values?.call_status_filter}
                                                                >
                                                                    <option value=''> SELECT</option>
                                                                    <option value='CALL_NOT_YET'>CALL_NOT_YET</option>
                                                                    <option value='CALL_NOT_WORK'>CALL_NOT_WORK</option>
                                                                    <option value='CALL_NUMBER_BUSY'>CALL_NUMBER_BUSY</option>
                                                                    <option value='CALL_NOT_ANSWER'>CALL_NOT_ANSWER</option>
                                                                    <option value='CALL_ANSWER_SUCCESS'>CALL_ANSWER_SUCCESS</option>
                                                                </Input>
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Created Type</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="created_type_filter"
                                                                  name="created_type_filter"
                                                                  className="form-control"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  values={values?.created_type_filter}
                                                                >
                                                                    <option value=''> SELECT</option>
                                                                    <option value='AGENT_FOUND_STUDENT'>AGENT_FOUND_STUDENT</option>
                                                                    <option value='ADMIN_ALLOCATED_STUDENT'>ADMIN_ALLOCATED_STUDENT</option>
                                                                    <option value='ADMIN_FOUND_STUDENT'>ADMIN_FOUND_STUDENT</option>
                                                                </Input>
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Source of Information ( Student Added)</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="student_find_about"
                                                                  name="student_find_about"
                                                                  className="form-control"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  values={values?.student_find_about}
                                                                >
                                                                    <option value=''>SELECT </option>
                                                                    <option value='WhatsApp'>WhatsApp</option>
                                                                    <option value='Facebook'>Facebook</option>
                                                                    <option value='Hotline'>Hotline</option>
                                                                    <option value='Telegram'>Telegram</option>
                                                                    <option value='Tiktok'>Tiktok</option>
                                                                </Input>
                                                            </div>
                                                        </Col>
                                                        <Col md={3}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Batch</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="batch_filter"
                                                                  name="batch_filter"
                                                                  className="form-control"
                                                                  onBlur={handleBlur}
                                                                  onChange={handleChange}
                                                                  value={values?.batch_filter}
                                                                >
                                                                    <option  value="" >SELECT </option>
                                                                    {allActiveBatches.map((batch) => (
                                                                      <option key={batch.id} value={batch.id}>{batch.name}</option>
                                                                    ))}
                                                                </Input>
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Send Details</Label>
                                                                <Input
                                                                  type="select"
                                                                  id="send_details_filter"
                                                                  name="send_details_filter"
                                                                  className="form-control"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  values={values?.send_details_filter}
                                                                >
                                                                    <option value=''> SELECT</option>
                                                                    <option value='NONE'>None</option>
                                                                    <option value='LINK_SHARED'>LINK_SHARED</option>
                                                                    <option value='PAYMENT_DETAILS'>PAYMENT_DETAILS</option>
                                                                    <option value='INTRO_MSG'>INTRO_MSG</option>
                                                                </Input>
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label htmlFor="formrow-email-Input">Select Date</Label>
                                                                <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div style={{display: "flex",
                                                        alignItems: "center",
                                                        gap: "20px"}}>
                                                        <button type="submit" className="btn btn-primary w-md">
                                                            Filter
                                                        </button>
                                                        <Button color="primary"
                                                                className="btn btn-primary waves-effect waves-light"
                                                                type="button"
                                                                onClick={() => {
                                                                    getAllTypesStudents()
                                                                }}
                                                                data-toggle="modal"
                                                                data-target="#myModal"
                                                        >
                                                            All Students
                                                        </Button>
                                                    </div>
                                                </Form>)}
                                          </Formik>
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    keyField="id"
                                                    data={students}
                                                    columns={columns1}
                                                    rowStyle={rowStyle}
                                                    sizePerPageList={[20, 50, 100]}
                                                    filter={filterFactory()}
                                                />
                                            </div>
                                          {pagination && (
                                            <Pagination
                                            current={currentPage}
                                            total={pageCount}
                                            onPageChange={pageNumber => pageChange(pageNumber)}
                                          />)}

                                        </>}

                                </CardBody>

                                {/* <CardBody>
                                    <CardTitle className="h4">Student Allocation Table </CardTitle>

                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={agentAllStudents}
                                            columns={columns}
                                            rowStyle={ rowStyle }
                                            cellEdit={ cellEditFactory({
                                                mode: 'click',
                                                blurToSave: true
                                              }) }
                                              pagination={ paginationFactory()}
                                        />
                                    </div>
                                </CardBody> */}
                            </Card>
                            {/* <Button onClick={() => saveData()}>Save</Button> */}
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(StudentManagement);
