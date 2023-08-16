import axios from "axios";
import { get, post } from "helpers/api_helper";
import React, { useState } from "react";
import * as url from "./url";
import {ALL_PAYMENTS_STUDENT, VERIFY_PAYMENT} from "./url";

const token = localStorage.getItem('auth-token');

const config = {
    xsrfHeaderName: "X-XSRF-TOKEN",
    withCredentials: true,
    Authorization: `Bearer ${token}`,
};

/*const getAgentAllPayment = async (data) => {
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.get(url.GET_AGENTS_ALL_STUDENTS, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}*/
const getAllPayment = async () => {
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.get(url.ALL_PAYMENTS_STUDENT, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}
//verify the payment
const changeStatus = async (id, data) => {
    let responseData;
    console.log(id, 'id service');
    console.log(data, 'data service');
    const response = await axios.get(url.SANCTUM_URL).then(async res => {

        await axios.post(url.VERIFY_PAYMENT + id,data, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
            responseData = resp;
        })
    })
    return responseData;
}



const PaymentService = {
    getAllPayment,
    changeStatus
}

export default PaymentService;
