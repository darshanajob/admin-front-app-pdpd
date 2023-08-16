import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardTitle, Button, Table, Input, Modal, Label } from "reactstrap";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter } from "react-router-dom";
import { useState } from "react";
import StudentServices from "peo-eye-services/studentServices";
import Swal from "sweetalert2";
import { useEffect } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import ReactLoading from 'react-loading';

// const students = [
//     { id: 1, number: 'ewfw', name: 'fwf', message: 'fwfwe' },
//     { id: 2, number: '', name: '', message: '' },
//     { id: 3, number: '', name: '', message: '' }
// ];



const AllocateAgentTable = props => {


    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [state, setState] = useState([]);
    const [allAgents, setAllAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState();
    const [loading1, setLoading1] = useState(true);

    const [modal_standard, setmodal_standard] = useState(false);

    function tog_standard() {
        setmodal_standard(!modal_standard);
        // removeBodyCss();
    }

    //get all agents with students count
    useEffect(() => {
        allAgentsForAllocate();
    }, []);

    const allAgentsForAllocate = () => {
        StudentServices.getAllAgentsWithStudentCount().then(res => {
            res.data.agent.sort(function (a, b) {
                return a.NoOfStd - b.NoOfStd;
            })
            console.log(res.data.agent, 'agentData');
            setAllAgents(res.data.agent)
            setSelectedAgent(res.data.agent[0].id)
        })
    }


    //get no agent all students 
    useEffect(() => {
        getNoAgentAllAgents();
    }, []);

    const getNoAgentAllAgents = () => {
        StudentServices.getNoAgentAllAgents().then(res => {
            console.log(res, 'getAgentAllStudents');
            setStudents(res.data.students)
            setLoading1(false)
        })
    }

    const columns = [
        {
            dataField: "id",
            text: "NO",
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
            dataField: "message",
            text: "Message",
        },
    ];

    const handleOnSelect = (row, isSelect) => {
        console.log(row, 'row');

        if (isSelect) {
            setSelectedStudents([
                ...selectedStudents, row,
            ]);
        } else {
            setSelectedStudents(selectedStudents.filter(obj => obj.id !== row.id))
            console.log(selectedStudents, 'selectedStudents');
        }
    }

    const handleOnSelectAll = (isSelect, row) => {
        const ids = row.map(r => r.id);
        if (isSelect) {
            //   this.setState(() => ({
            //     selected: ids
            //   }));
            setSelectedStudents(ids)
        } else {
            setSelectedStudents([])
        }
    }

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll,
        hideSelectAll: true,
        classes: 'selection-row',
        style: { backgroundColor: '#c8e6c9' }
    };

    const saveData = () => {
        if (selectedStudents.length > 0) {
            setmodal_standard(true);
        } else {
            Swal.fire(
                "Please Select Students!",
                "",
                "warning"
            )
        }

    }

    const allocateAgent = () => {

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

        console.log(selectedAgent, 'students1');

        selectedStudents.map(function (x) {
            x.agent_id = selectedAgent;
            x.status = 'ALLOCATED_TO_AGENT';
            return x
        });


        console.log(selectedStudents, 'selectedAgent');
        const data = { data: selectedStudents }

        StudentServices.allocateStudentsToAgent(data).then(res => {
            console.log(res, 'response');
            if (res.status === 201) {
                setmodal_standard(false);

                Swal.close();
                Swal.fire(
                    'Students Allocated Successfully!',
                    '',
                    'success'
                )

                setSelectedStudents([])
                getNoAgentAllAgents();
                allAgentsForAllocate();
            }
        })

    }

    const handleAddrTypeChange = (e) => {
        console.log(e.target.value)
        setSelectedAgent(e.target.value)
    }


    //meta title
    document.title = "Allocate Students | Peo Eye Admin Panel";
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="Student Management" />

                    <Row>
                        <Modal isOpen={modal_standard}
                            toggle={() => {
                                tog_standard();
                            }}>

                            <div className="modal-header">
                                <h5 className="modal-title mt-0" id="myModalLabel">
                                    Select Agent
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
                                    <Row>
                                        <Col md={12}>
                                            <div className="mb-3">
                                                <Input
                                                    type="select"
                                                    id="agent"
                                                    name="agent"
                                                    className="form-control"
                                                    onChange={(e) => handleAddrTypeChange(e)}
                                                    value={selectedAgent}
                                                >
                                                    {allAgents.map((agent) => (
                                                        <option key={agent.id} value={agent.id}>{agent.name} - Students({agent.NoOfStd})</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div>
                                        <button type="submit" onClick={() => allocateAgent()} className="btn btn-primary w-md">
                                            Allocate
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>

                        </Modal>


                        {loading1 ? <>
                            <center>
                                <ReactLoading type='bubbles' color='#000' height={'5%'} width={'5%'} />
                            </center>
                        </>
                            :
                            <>
                                {students.length > 0 ?
                                    <Col>
                                        <Card>
                                            <CardBody>
                                                <CardTitle className="h4">Student Allocation Table </CardTitle>


                                                <div className="table-responsive">
                                                    <BootstrapTable
                                                        keyField="id"
                                                        data={students}
                                                        columns={columns}
                                                        selectRow={selectRow}
                                                        pagination={paginationFactory()}
                                                    />
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <Button onClick={() => saveData()}>Agent List</Button>
                                    </Col>
                                    :
                                    <Col>
                                        <Card>
                                            <CardBody>
                                                <div>
                                                    <center><h3>No Students to Allocate</h3></center>
                                                </div>
                                            </CardBody>

                                        </Card>
                                    </Col>
                                }
                            </>}

                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(AllocateAgentTable);
