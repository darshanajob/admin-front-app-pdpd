import React, { useEffect, useState } from "react"
import { Formik, Field, Form, ErrorMessage } from "formik"
import { Row, Col, Card, CardBody, CardTitle, Label, Input, Button, FormFeedback } from "reactstrap"

// Editable
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import { withRouter } from "react-router-dom"
import CommissionService from "../../peo-eye-services/CommissionService"
import * as Yup from "yup"
import Swal from "sweetalert2"

const columns = [
  {
    dataField: "id",
    text: "ID",
    editable: false
  },
  {
    dataField: "initial_agent_self_found_full",
    text: "Initial agent - Self Found Student - Full Payment"
  },
  {
    dataField: "sub_agent_self_found_full",
    text: "Sub Agent - Self Found Student - Full Payment"
  },
  {
    dataField: "initial_agent_self_found_half",
    text: "Initial agent - Self Found Student - Half Payment"
  },
  {
    dataField: "sub_agent_self_found_half",
    text: "Sub Agent - Self Found Student - Half Payment"
  },
  {
    dataField: "initial_agent_admin_allocated_full",
    text: "Initial Agent - Admin Allocated Student - Full Payment"
  },
  {
    dataField: "sub_agent_admin_allocated_full",
    text: "Sub Agent - Admin Allocated Student - Full Payment"
  },
  {
    dataField: "initial_agent_admin_allocated_half",
    text: "Initial Agent - Admin Allocated Student - Half Payment"
  },
  {
    dataField: "sub_agent_admin_allocated_half",
    text: "Sub Agent - Admin Allocated Student - Half Payment"
  }
]
const ManageCommissions = props => {
  //meta title
  document.title = "Manage Commissions | Skote - React Admin & Dashboard Template"
  const [commissions, setCommissions] = useState({})
  const [error, setError] = useState(null)
  const [load, setLoad] = useState(false)
  const ValidationSchema = Yup.object().shape({
    initial_agent_self_found_full: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    sub_agent_self_found_full: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    initial_agent_self_found_half: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    sub_agent_self_found_half: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    initial_agent_admin_allocated_full: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    sub_agent_admin_allocated_full: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    initial_agent_admin_allocated_half: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
    sub_agent_admin_allocated_half: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),

    sub_agent_self_found_full_share: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),

    sub_agent_self_found_half_share: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),

    sub_agent_admin_allocated_full_share: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),

    sub_agent_admin_allocated_half_share: Yup.number()
      .min(0, "Invalid Percentage")
      .max(100,"Invalid Percentage" )
      .required(" Required"),
  })
  useEffect(() => {
    getCommissions()
  }, [])

  const getCommissions = () => {
    CommissionService.getAllCommissionTypes()
      .then((response) => {
        console.log(response , 'response')
        response.data.data[0] ? setLoad(true) : setLoad(false)
        setCommissions(response.data.data[0])
        console.log(response.data.data[0], "data")
        console.log(commissions.initial_agent_admin_allocated_half, "commissions")
      })
      .catch((e) => {
        console.log(e)
      })
  }
  return (
    <React.Fragment>
      {load && <Formik
        initialValues={{
          id:commissions.id,
          initial_agent_self_found_full: commissions.initial_agent_self_found_full,
          sub_agent_self_found_full: commissions.sub_agent_self_found_full,
          initial_agent_self_found_half: commissions.initial_agent_self_found_half,
          sub_agent_self_found_half: commissions.sub_agent_self_found_half,
          initial_agent_admin_allocated_full: commissions.initial_agent_admin_allocated_full,
          sub_agent_admin_allocated_full: commissions.sub_agent_admin_allocated_full,
          initial_agent_admin_allocated_half: commissions.initial_agent_admin_allocated_half,
          sub_agent_admin_allocated_half: commissions.sub_agent_admin_allocated_half,

          sub_agent_self_found_full_share:commissions.sub_agent_self_found_full_share,
          sub_agent_self_found_half_share:commissions.sub_agent_self_found_half_share,
          sub_agent_admin_allocated_full_share:commissions.sub_agent_admin_allocated_full_share,
          sub_agent_admin_allocated_half_share:commissions.sub_agent_admin_allocated_half_share
        }}
        validationSchema={ValidationSchema}
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
          console.log(values);
          await CommissionService.update(values).then(r =>{
            console.log(r, 'response');
            Swal.close();
            Swal.fire(
              "Updated!",
              "",
              "success"
            )

          }).catch(e => {
            console.log(e.response.data)          })
        }}>
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <div className="page-content">
            <div className="container-fluid">
              {/* <Breadcrumbs title="Tables" breadcrumbItem="Manage Commissions" />*/}
              {/*<Row>
            <Col>
              <Card>
                <CardBody>
                   <CardTitle className="h4">cccc</CardTitle>

                  <div className="table-responsive">
                    <BootstrapTable
                      keyField="id"
                      data={commissions}
                      columns={columns}
                      cellEdit={cellEditFactory({
                        mode: "click",
                        blurToSave: true,
                        afterSaveCell: (oldValue, newValue, row, column) => {
                          console.log("After Saving Cell!!")
                          console.log(oldValue, "oldValue")
                          console.log(newValue, "newValue")
                          console.log(row, "row")
                          console.log(column, "column")
                        }
                      })}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>*/}
              <Row>
                <Col xl={7}>
                  <Card>
                    <CardBody>
                      <CardTitle className="mb-4">Manage Commissions</CardTitle>
                      <Form>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial agent - Self Found Student - Full Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="initial_agent_self_found_full"
                              name="initial_agent_self_found_full"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.initial_agent_self_found_full}
                              invalid={errors?.initial_agent_self_found_full && touched?.initial_agent_self_found_full ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.initial_agent_self_found_full && touched?.initial_agent_self_found_full ? (
                              <FormFeedback type="invalid">{errors?.initial_agent_self_found_full}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Sub Agent - Self Found Student - Full Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_self_found_full"
                              name="sub_agent_self_found_full"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_self_found_full}
                              invalid={errors?.sub_agent_self_found_full && touched?.sub_agent_self_found_full ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_self_found_full && touched?.sub_agent_self_found_full ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_self_found_full}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial agent - Self Found Student - Half Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="initial_agent_self_found_half"
                              name="initial_agent_self_found_half"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.initial_agent_self_found_half}
                              invalid={errors?.initial_agent_self_found_half && touched?.initial_agent_self_found_half ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.initial_agent_self_found_half && touched?.initial_agent_self_found_half ? (
                              <FormFeedback type="invalid">{errors?.initial_agent_self_found_half}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Sub Agent - Self Found Student - Half Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_self_found_half"
                              name="sub_agent_self_found_half"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_self_found_half}
                              invalid={errors?.sub_agent_self_found_half && touched?.sub_agent_self_found_half ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_self_found_half && touched?.sub_agent_self_found_half ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_self_found_half}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial Agent - Admin Allocated Student - Full Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="initial_agent_admin_allocated_full"
                              name="initial_agent_admin_allocated_full"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.initial_agent_admin_allocated_full}
                              invalid={errors?.initial_agent_admin_allocated_full && touched?.initial_agent_admin_allocated_full ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.initial_agent_admin_allocated_full && touched?.initial_agent_admin_allocated_full ? (
                              <FormFeedback type="invalid">{errors?.initial_agent_admin_allocated_full}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Sub Agent - Admin Allocated Student - Full Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_admin_allocated_full"
                              name="sub_agent_admin_allocated_full"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_admin_allocated_full}
                              invalid={errors?.sub_agent_admin_allocated_full && touched?.sub_agent_admin_allocated_full ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_admin_allocated_full && touched?.sub_agent_admin_allocated_full ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_admin_allocated_full}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial Agent - Admin Allocated Student - Half Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="initial_agent_admin_allocated_half"
                              name="initial_agent_admin_allocated_half"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.initial_agent_admin_allocated_half}
                              invalid={errors?.initial_agent_admin_allocated_half && touched?.initial_agent_admin_allocated_half ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.initial_agent_admin_allocated_half && touched?.initial_agent_admin_allocated_half ? (
                              <FormFeedback type="invalid">{errors?.initial_agent_admin_allocated_half}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Sub Agent - Admin Allocated Student - Half Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_admin_allocated_half"
                              name="sub_agent_admin_allocated_half"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_admin_allocated_half}
                              invalid={errors?.sub_agent_admin_allocated_half && touched?.sub_agent_admin_allocated_half ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_admin_allocated_half && touched?.sub_agent_admin_allocated_half ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_admin_allocated_half}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial Agents share for -> Sub Agent - Self Found Student - Full Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_self_found_full_share"
                              name="sub_agent_self_found_full_share"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_self_found_full_share}
                              invalid={errors?.sub_agent_self_found_full_share && touched?.sub_agent_self_found_full_share ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_self_found_full_share && touched?.sub_agent_self_found_full_share ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_self_found_full_share}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>

                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial Agents share for -> Sub Agent - Self Found Student - Half Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_self_found_half_share"
                              name="sub_agent_self_found_half_share"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_self_found_half_share}
                              invalid={errors?.sub_agent_self_found_half_share && touched?.sub_agent_self_found_half_share ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_self_found_half_share && touched?.sub_agent_self_found_half_share ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_self_found_half_share}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>

                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial Agents share for -> Sub Agent - Admin Allocated - Full Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_admin_allocated_full_share"
                              name="sub_agent_admin_allocated_full_share"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_admin_allocated_full_share}
                              invalid={errors?.sub_agent_admin_allocated_full_share && touched?.sub_agent_admin_allocated_full_share ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_admin_allocated_full_share && touched?.sub_agent_admin_allocated_full_share ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_admin_allocated_full_share}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>

                        <Row className="mb-4">
                          <Label
                            htmlFor="horizontal-firstname-Input"
                            className="col-sm-7 col-form-label"
                          >
                            Initial Agents share for -> Sub Agent - Admin Allocated - Half Payment
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              id="sub_agent_admin_allocated_half_share"
                              name="sub_agent_admin_allocated_half_share"
                              className="form-control"
                              placeholder="Enter Your"
                              onChange={handleChange}
                              value={values?.sub_agent_admin_allocated_half_share}
                              invalid={errors?.sub_agent_admin_allocated_half_share && touched?.sub_agent_admin_allocated_half_share ? true : false}
                              onBlur={handleBlur}
                              min={0}
                              max={100}
                            />
                            {errors?.sub_agent_admin_allocated_half_share && touched?.sub_agent_admin_allocated_half_share ? (
                              <FormFeedback type="invalid">{errors?.sub_agent_admin_allocated_half_share}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="justify-content-end">
                          <Col sm={4}>
                            <div>
                              <Button
                                type="submit"
                                color="primary"
                                className="w-md"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Formik>}
    </React.Fragment>
  )

}

export default withRouter(ManageCommissions)
