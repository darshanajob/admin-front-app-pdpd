import React, { useEffect, useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer"
import IconMaterialdesign from "pages/Icons/IconMaterialdesign";
import { Chart } from "react-google-charts";

import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    UncontrolledTooltip,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";


//import { Name, Email, Tags, Projects } from "../../pages/Contacts/ContactList/contactlistCol";
import {
    Name,
    Email,
    Address,
    EmpNo,
    Enable,
    NIC,
    Status,
    MobileNo,
} from "../Agent-Management/agentListCol";

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
import ReportService from "../../peo-eye-services/ReportService";
import DatePicker from "react-datepicker";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import ReactLoading from 'react-loading';
import Swal from "sweetalert2"
import moment from "moment/moment"
const callStudentReport = ({ dataColors }) => {

    //meta title
    document.title = "Call Status Report";
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    // let data = AgentService.getAllAgents();
    // setAgents(await AgentService.getAllAgents());
    //console.log(data);
    //setAgents(data.data.agent);s
    console.log(agents, 'agentss45');

    //get all student by agent
    useEffect(() => {
        ReportService.getAllCallReports().then(res => {
            console.log(res.data.students, 'from sercice');
            setAgents(res.data.students);
            console.log(agents, 'from file');
            setLoading(false)
        });
        /*  AgentService.getAllAgents().then(res=>{
              console.log(res.data.agent, 'from sercice');
              setAgents(res.data.agent)
              console.log(agents, 'from file');
          })*/

    }, []);

    const CALL_NOT_YET = agents.filter(item => item.call_status === "CALL_NOT_YET").length;
    const CALL_NOT_WORK = agents.filter(item => item.call_status === "CALL_NOT_WORK").length;
    const CALL_NUMBER_BUSY = agents.filter(item => item.call_status === "CALL_NUMBER_BUSY").length;
    const CALL_NOT_ANSWER = agents.filter(item => item.call_status === "CALL_NOT_ANSWER").length;
    const CALL_ANSWER_SUCCESS = agents.filter(item => item.call_status === "CALL_ANSWER_SUCCESS").length;


    const data = [
        ["Task", "Hours per Day"],
        ["Need To Call", CALL_NOT_YET],
        ["Number Is Not Working", CALL_NOT_WORK],
        ["Number Busy", CALL_NUMBER_BUSY],
        ["Did Not Anwser", CALL_NOT_ANSWER],
        ["Call Success", CALL_ANSWER_SUCCESS],
    ];
    const options = {
        title: "Call Status",
        is3D: true,
    };
    const dispatch = useDispatch();
    const [contact, setContact] = useState();
    // validation
    const validation = useFormik({
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


    const { users } = useSelector(state => ({
        users: state.contacts.users,
    }));

    const [userList, setUserList] = useState([]);
    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const submitAddress = (e) => {
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
        console.log('1', startDate);
        console.log('1', endDate);
        e.preventDefault();
        e.persist();
        const data = {
            dateS: moment(startDate).utc().format("YYYY-MM-DD"),
            dateE: moment(endDate).utc().format("YYYY-MM-DD"),
        }
        ReportService.sortAllCallReports(data).then(res => {
            console.log('res', res);
            Swal.close();
            setAgents(res.data.students);
            /*console.log(res.data.students, 'from sercice');
            setAgents(res.data.students)
            console.log(agents, 'from file');*/
        });

    }
    const columns = useMemo(
        () => [


            {
                Header: "Student Name", //
                accessor: "fullName",
                filterable: true,
                Cell: cellProps => {
                    return <Name {...cellProps} />;
                },
            },
            {
                Header: "Agent Name", //name
                accessor: "agent.name",
                filterable: true,
                Cell: cellProps => {
                    return <Name {...cellProps} />;
                },
            },
            {
                Header: "Student NIC",
                accessor: "nic",
                filterable: true,
                Cell: cellProps => {
                    return (
                        <>
                            {" "}
                            <Address {...cellProps} />{" "}
                        </>
                    );
                },
            },
            {
                Header: "Student Mobile No",
                accessor: "mobileNo",
                filterable: true,
                Cell: cellProps => {
                    return <Enable {...cellProps} />;
                },
            },
            {
                Header: "Call Status",
                accessor: "call_status",
                filterable: true,
                Cell: cellProps => {
                    return <EmpNo {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: true,
                Cell: cellProps => {
                    return <Email {...cellProps} />;
                },
            },

            {
                Header: "Student Id",
                accessor: "studentId",
                filterable: true,
                Cell: cellProps => {
                    return <MobileNo {...cellProps} />;
                },
            },



            /*  {
                  Header: "Action",
                  Cell: cellProps => {
                      return (
  
                          <div className="d-flex gap-3">
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
                                      const userData = cellProps.row.original;
                                      onClickDelete(userData);
                                  }}
                              >
  
                                  <i className="mdi mdi-delete font-size-18" id="deletetooltip"/>
                                  <UncontrolledTooltip placement="top" target="deletetooltip">
                                      Delete
                                  </UncontrolledTooltip>
                              </Link>
                          </div>
                      );
                  },
              },*/
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

    const onClickDelete = users => {
        setContact(users);
        setDeleteModal(true);
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
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteUser}
                onCloseClick={() => setDeleteModal(false)}
            />
            <div className="page-content">
                <Container fluid>
                    {/* table body */}
                    <Breadcrumbs title="Reports" breadcrumbItem="Call Status Report" />

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


                                            <tr>
                                                <th><DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} /></th>
                                                &nbsp;
                                                <th> <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} /></th>
                                                <th>&nbsp;<button className="btn btn-primary btn-block" type="submit" onClick={submitAddress} >
                                                    Change The Dates
                                                </button></th>
                                            </tr>
                                            <Chart
                                                chartType="PieChart"
                                                data={data}
                                                options={options}
                                                width={"100%"}
                                                height={"400px"}
                                            />
                                            <TableContainer
                                                columns={columns}

                                                data={agents}
                                                isGlobalFilter={true}
                                                handleUserClick={handleUserClicks}
                                                customPageSize={10}
                                                className="custom-header-css"
                                            />

                                        </CardBody>
                                    </>
                                }

                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(callStudentReport);
