import React, { useEffect, useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer"
import IconMaterialdesign from "pages/Icons/IconMaterialdesign";
import { Chart } from "react-google-charts";

import {
    Card,
    CardBody, CardTitle,
    Col,
    Container,
    Row,
    UncontrolledTooltip,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";


//import { Name, Email, Tags, Projects } from "../../pages/Contacts/ContactList/contactlistCol";
import { Commission, Amount, PaymentMethod, Status ,ReferenceNo
    } from "../Commissions/commissionCol";

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
import CommissionService from "../../peo-eye-services/CommissionService";
import {PaymentType} from "../Reports/reportCol";
const commissionsAgent =  ({ dataColors }) => {

    //meta title
    document.title = "Personal Commissions";
    const [agents, setAgents] = useState([]);
    const [monthStartDate, setmonthStartDate] = useState([]);
    const [monthEndDate, setmonthEndDate] = useState([]);
    const [amount, setAmount] = useState([]);
    // let data = AgentService.getAllAgents();
    // setAgents(await AgentService.getAllAgents());
    //console.log(data);
    //setAgents(data.data.agent);s
    console.log(agents, 'agentss45');

    //get all student by agent
    useEffect(() => {
        CommissionService.getCommissions().then(res => {
            console.log(res.data.students, 'from009sercice');
            setAgents(res.data.students);
            setAmount(res.data.sum)
            setmonthEndDate(res.data.dateE)
            setmonthStartDate(res.data.dateS)
        })

       /* ReportService.getAllCallReports().then(res=>{
            console.log(res.data.students, 'from sercice');
            setAgents(res.data.students);
            console.log(agents, 'from file');
        });*/
        /*  AgentService.getAllAgents().then(res=>{
              console.log(res.data.agent, 'from sercice');
              setAgents(res.data.agent)
              console.log(agents, 'from file');
          })*/

    }, []);

    const full = agents.filter(item => item.payment_type === "full").length;
    const half = agents.filter(item => item.payment_type === "half").length;



    const data = [
        ["Task", "Hours per Day"],
        ["Full Payment", full],
        ["Half Payment", half],

    ];
    const options = {
        title: "Commmissions Status",
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


    const {users} = useSelector(state => ({
        users: state.contacts.users,
    }));

    const [userList, setUserList] = useState([]);
    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const submitAddress = (e) => {
        console.log('1', startDate);
        console.log('1', endDate);
        e.preventDefault();
        e.persist();
        const data = {
            dateS: startDate,
            dateE: endDate,
        }
        ReportService.sortAllCallReports(data).then(res=>{
            console.log('res',res);
            setAgents(res.data.students);
            /*console.log(res.data.students, 'from sercice');
            setAgents(res.data.students)
            console.log(agents, 'from file');*/
        });

    }
    const columns = useMemo(
        () => [


            {
                Header: "Commission", //
                accessor: "commission_amount",
                filterable: true,
                Cell: cellProps => {
                    return <Commission {...cellProps} />;
                },
            },
            {
                Header: "Amount", //name
                accessor: "payment.amount",
                filterable: true,
                Cell: cellProps => {
                    return <Amount {...cellProps} />;
                },
            },
            {
                Header: "Payment Method",
                accessor: "payment_method",
                filterable: true,
                Cell: cellProps => {
                    return (
                        <>
                            {" "}
                            <PaymentMethod {...cellProps} />{" "}
                        </>
                    );
                },
            },
            {
                Header: "Status",
                accessor: "payment.status",
                filterable: true,
                Cell: cellProps => {
                    return <Status {...cellProps} />;
                },
            },
            {
                Header: "Reference No",
                accessor: "payment.referenceNo",
                filterable: true,
                Cell: cellProps => {
                    return <ReferenceNo {...cellProps} />;
                },
            },
            {
                Header: "Payment Type No",
                accessor: "payment_type",
                filterable: true,
                Cell: cellProps => {
                    return <PaymentType {...cellProps} />;
                },
            }



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
                    <Breadcrumbs title="Reports" breadcrumbItem="Commmissions"/>

                    <Row>
                        <Col lg="12">
                            <Card>

                                <CardBody>
                                    <Row>
                                        <Card>
                                                <CardTitle className="mb-4">Monthly Earnings</CardTitle>
                                                            <p className="text-muted">{monthStartDate} <span className="text-primary m-2"> to </span> {monthEndDate}</p>
                                                            <h4>Total - {amount}</h4>
                                        </Card>
                                        <Chart
                                            chartType="PieChart"
                                            data={data}
                                            options={options}
                                            width={"100%"}
                                            height={"400px"}
                                        />
                                    </Row>

                                    {/*<tr>

                                        <th>  <div className="text-muted text-center">
                                            <p className="mb-2">{ monthStartDate} - To - {monthEndDate}</p>
                                            <h4>Total - {amount}</h4>

                                        </div></th>
                                    </tr>*/}


                                    <TableContainer
                                        columns={columns}

                                        data={agents}
                                        isGlobalFilter={true}
                                        handleUserClick={handleUserClicks}
                                        customPageSize={10}
                                        className="custom-header-css"
                                    />

                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(commissionsAgent);
