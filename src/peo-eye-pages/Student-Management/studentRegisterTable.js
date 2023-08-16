import { withRouter } from "react-router-dom"
import { Button, Card, CardBody, Col, FormFeedback, Input, Row, Table } from "reactstrap";
import React from "react";
import { useState } from "react";
import StudentServices from "peo-eye-services/studentServices";
import Swal from "sweetalert2";


const StudentRegisterTable = props => {

    const [rows, setRows] = useState([
        { id: 1, mobileNo: '', fullName: '', message: '', user_id: '' },
    ]);

    const handleInputChangeMobile = (e, index) => {
        // setDisable(false);
        // console.log(e.target, 'hi');
        const { name, value } = e.target;
        const list = [...rows];
        list[index][name] = value;
        setRows(list);
    };

    const handleInputChangeName = (e, index) => {
        // setDisable(false);
        console.log(e.target, 'hi');
        const { name, value } = e.target;
        const list = [...rows];
        list[index][name] = value;
        setRows(list);
    };

    const handleInputChangeMessage = (e, index) => {
        // setDisable(false);
        const { name, value } = e.target;
        const list = [...rows];
        list[index][name] = value;
        setRows(list);
    };

    const handleAdd = () => {
        setRows([
            ...rows,
            {
                id: rows.length + 1, mobileNo: "",
                fullName: "", message: "", user_id: ""
            },
        ]);
        // setEdit(true);
    };

    
    const [valid, setValid] = useState();

    const validateEmail = (e, index) => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        // const { name, value, invalid } = e.target;
        
        // const list = [...rows];
        // list[index][name] = value;
        // setRows(list);

        // aria-invalid
        if (emailRegex.test(e.target.value)) {
            setValid('has-success');
        } else {
            setValid('has-danger');
        }
    }

    const [found, setFound] = useState(false);

    const checkMobileNo = (e, index) => {
        setFound(false);
        // let length = rows.length-1;
        // const result = rows.includes({mobileNo:e.target.value});
            console.log(e.target.value, 'lll');
            console.log(index, 'index');
            const { name, value } = e.target;
        for(var i = 0; i < index; i++) {
            console.log(rows[i].mobileNo, 'arr');
            if (rows[i].mobileNo == e.target.value) {
                setFound(true);
                const list = [...rows];
                list[index][name] = '';
                break;
            }
        }
        console.log(found, 'stu');

    }

    const saveData = () => {
        const data = { data: rows }
        console.log(data, 'stu');

        StudentServices.registerStudentArray(data).then(res => {
            console.log(res, 'response');
            if (res.status === 201) {
                Swal.fire(
                    'Student Created Successfully!',
                    '',
                    'success'
                )
            }
        });
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Row>
                    <Col>
                        <h3>Student Management</h3>
                        <Card>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Mobile No</th>
                                                <th>Name</th>
                                                <th>Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((st, i) => (
                                                <tr key={st.id}>
                                                    <th scope="row">{i + 1}</th>
                                                    <td><Input type="number"
                                                        name="mobileNo"
                                                        invalid={valid === 'has-danger'}
                                                        onChange={(e) => {handleInputChangeMobile(e, i);}}
                                                        onBlur={(e) => checkMobileNo(e, i)}
                                                        value={st.mobileNo} required />
                                                        <FormFeedback key={i}>
                                                            Uh oh! Looks like there is an issue with your email.
                                                        </FormFeedback></td>
                                                    <td><Input type="text"
                                                        name="fullName"
                                                        onChange={(e) => handleInputChangeName(e, i)}
                                                        value={st.fullName} /></td>
                                                    <td><Input type="text"
                                                        name="message"
                                                        onChange={(e) => handleInputChangeMessage(e, i)}
                                                        value={st.message} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <Button onClick={() => handleAdd()}>Add</Button>
                                </div>
                            </CardBody>
                        </Card>
                        <Button onClick={() => saveData()}>Save</Button>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    )

}

export default withRouter(StudentRegisterTable);
