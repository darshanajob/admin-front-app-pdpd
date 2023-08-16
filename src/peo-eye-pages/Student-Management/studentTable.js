import React, { Component, useEffect } from "react";

import { Row, Col, Card, CardBody, CardTitle, Button, Table, Input } from "reactstrap";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withRouter } from "react-router-dom";
import { useState } from "react";
import StudentServices from "peo-eye-services/studentServices";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker"
import * as moment from "moment"
import { Type } from "../../pages/Crypto/CryptoOrders/CryptoCol"

// const students = [
//     { id: 1, number: 'ewfw', name: 'fwf', message: 'fwfwe' },
//     { id: 2, number: '', name: '', message: '' },
//     { id: 3, number: '', name: '', message: '' }
// ];




const StudentTable = props => {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedInformation, setSelectedInformation] = useState('WhatsApp');
    const [selectedSource, setSelectedSource] = useState('WhatsApp');
    const columns = [
        {
            dataField: "id",
            text: "NO",
        },
        {
            dataField: "mobileNo",
            text: "Mobile",
            validator: (newValue, row, column) => {
                //console.log(row, 'row');
                console.log(newValue.length, 'newValue');
                if (isNaN(newValue)) {
                    return {
                        valid: false,
                        message: 'Mobile Number should be numeric'
                    };
                }
                if (newValue.length > 15) {
                    return {
                        valid: false,
                        message: 'Please Enter valid Mobile Number'
                    };
                }
                for (var i = 0; i < row.id; i++) {
                    console.log(students[i].mobileNo, 'arr');
                    if (newValue !== '') {
                        if (students[i].mobileNo == newValue) {
                            return {
                                valid: false,
                                message: 'This Mobile Number is already in the table'
                            };
                            // break;
                        }
                    }
                }
                // if (newValue === '') {
                //     return {
                //       valid: false,
                //       message: 'Price should bigger than 2000'
                //     };
                //   }
                return true;
            }
        },
        {
            dataField: "fullName",
            text: "Name",
        },
        {
            dataField: "message",
            text: "Message",
        },
       /* {
            dataField: "updated_at",
            text: "Date ggg",
            formatter: (cell) => {
                let dateObj = cell;
                if (typeof cell !== 'object') {
                    dateObj = new Date(cell);
                }
                return `${('0' + dateObj.getUTCDate()).slice(-2)}/${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${dateObj.getUTCFullYear()}`;
            },
            editor: {
                type: Type.DATE
            }
        },*/

        /*{
            dataField: "information",
            text: "Information of Information",
            editable: false,
            formatter: (cell,row,rowIndex) => {
                return(<select value={selectedInformation} name="cars" id="cars" onChange={(date) => handleInformationChange(event.target.value,rowIndex)}>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Hotline">Hotline</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Tiktok">Tiktok</option>
                </select>)
            },
        },*/
        { dataField: "created_at", text: "Published", editable: false, formatter: (cell,row,rowIndex) => {
                //console.log(cell, 'cell');
                let dateObj = cell;
                if (typeof cell !== 'object') {
                    dateObj = new Date(cell);
                    console.log(dateObj, 'dateObj')
                }
           return(<DatePicker className="form-control" selected={startDate} onChange={(date) => handleDateChange(date,rowIndex)} dateFormat="yyyy-MM-dd" />)
            }
            }
    ];
    const [updated_at, setUpdated_at] = useState();

    const handleDateChange = (date, rowIndex)=> {
        const date1 = moment(new Date(date)).format("YYYY-MM-DD");
        setStartDate(new Date(date))
        console.log(date1, 'date changed');
        console.log(rowIndex, 'rowIndex');
        console.log(students, 'students first');
        var foundIndex = students.findIndex(x => x.id-1 === rowIndex);
        students[foundIndex].created_at=date1;
        var obj = students[foundIndex];
        students[foundIndex] =obj;
        console.log(students, 'students second')
    }
    useEffect(() => {
        const date = new Date().toISOString().slice(0, 10);
        console.log(date, 'hha');
        console.log(new Date());
    }, [])

    function handleInformationChange(event, rowIndex) {
        console.log(rowIndex,'rowIndex');
        console.log(event,"event");
        setSelectedInformation(event);

        console.log(students, 'students first');
        var foundIndex = students.findIndex(x => x.id-1 === rowIndex);
        students[foundIndex].information=event;
        var obj = students[foundIndex];
        students[foundIndex] =obj;
        console.log(students, 'students second')

    }
    function handleSourceChange(event) {
        console.log(event,"event");
        console.log(students, 'students first');
        students.forEach(single =>{
            single.source=event;
        })
        console.log(students, 'students second')
        setSelectedSource(event);


    }
    const saveData = () => {

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

        let val = students.filter(e => e.mobileNo === '');
        val.forEach(f => students.splice(students.findIndex(e => e.mobileNo === f.mobileNo), 1));
        // students.splice(students.findIndex(e => e.mobileNo === null));
        console.log(students, 'students1');

        const data = { data: students }
        console.log(data, 'stu');


        StudentServices.registerStudentArray(data).then(res => {
            console.log(res, 'response');
            if (res.status === 201) {
                setStudents([{ id: 1, mobileNo: '', fullName: '', message: '', information: 'WhatsApp', user_id: '', updated_at: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString().slice(0, 10) ,source:'WhatsApp'}])

                Swal.close();
                Swal.fire(
                    'Student Created Successfully!',
                    '',
                    'success'
                )
            }
        })
    }

    const [students, setStudents] = useState([
        { id: 1, mobileNo: '', fullName: '', message: '',information: 'WhatsApp', user_id: '', updated_at: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString().slice(0, 10) ,source:'WhatsApp'},
        { id: 2, mobileNo: '', fullName: '', message: '',information: 'WhatsApp', user_id: '', updated_at: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString().slice(0, 10),source:'WhatsApp' },
        { id: 3, mobileNo: '', fullName: '', message: '',information: 'WhatsApp', user_id: '', updated_at: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString().slice(0, 10),source:'WhatsApp' },
        { id: 4, mobileNo: '', fullName: '', message: '',information: 'WhatsApp', user_id: '', updated_at: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString().slice(0, 10),source:'WhatsApp' },
        { id: 5, mobileNo: '', fullName: '', message: '',information: 'WhatsApp', user_id: '', updated_at: new Date().toISOString().slice(0, 10), created_at: new Date().toISOString().slice(0, 10),source:'WhatsApp' },
    ]);

    const addCell = () => {
         console.log('hi');
        // students.push({ id: students.length + 1, number: '', name: '', message: '' })
        setStudents([
            ...students,
            {
                id: students.length + 1, mobileNo: "",source:'WhatsApp',
                fullName: "", message: "",information: "WhatsApp", user_id: "",created_at: new Date().toISOString().slice(0, 10)
            },
        ]);
    }

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
//            console.log(students, 'students')
            //console.log(`clicked on row with index: ${rowIndex}`);
            //addCell();
        },
        /*onMouseEnter: (e, row, rowIndex) => {
            console.log(`enter on row with index: ${rowIndex}`);
        }*/
    };
    //meta title
    document.title = "Student Registration | Peo Eye Admin Panel";
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tables" breadcrumbItem="Student Registration Table" />

                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    {/*<CardTitle className="h4">Student Registration Table </CardTitle>*/}
                                    <Row className="mb-3">
                                        <label className="col-md-2 col-form-label">Source of Information</label>
                                        <div className="col-sm-4">
                                            <select className="form-control" value={selectedSource} onChange={(date) => handleSourceChange(event.target.value,)}>
                                                <option value="WhatsApp">WhatsApp</option>
                                                <option value="Facebook">Facebook</option>
                                                <option value="Hotline">Hotline</option>
                                                <option value="Telegram">Telegram</option>
                                                <option value="Tiktok">Tiktok</option>
                                            </select>
                                        </div>
                                    </Row>

                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={students}
                                            columns={columns}
                                            rowEvents={rowEvents}
                                            cellEdit={cellEditFactory({
                                                mode: "click",
                                                blurToSave: true,
                                                afterSaveCell: (oldValue, newValue, row, column) => {
                                                    //console.log('After Saving Cell!!');
                                                    console.log(column, 'col');
                                                    if (column.dataField === 'mobileNo') {
                                                        addCell();
                                                    }
                                                }

                                            })}
                                        />
                                    </div>
                                    <Button onClick={() => addCell()}>Add</Button>
                                </CardBody>
                            </Card>
                            <Button onClick={() => saveData()}>Save</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(StudentTable);
