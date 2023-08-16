import axios from "axios";
import { get, post } from "helpers/api_helper";
import React, { useState } from "react";
import * as url from "./url";
import {ALL_PAYMENTS_STUDENT, SORT_REPORT_BY_DATE, VERIFY_PAYMENT} from "./url";




/*const config = {
    xsrfHeaderName: "X-XSRF-TOKEN",
    withCredentials: true,
    Authorization: `Bearer ${token}`,
};*/

//student call reports
const getAllCallReports = async () => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.get(url.ALL_CALL_STUDNET_STATUS_REPORT, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}
//sort date base on custom date
const sortAllCallReports = async (data) => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.SORT_REPORT_BY_DATE, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}

//agent vice
const sortAllCallReportsByagent = async (data) => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.SORT_REPORT_BY_DATE_CALL_STATUS, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'agentagentagentagent');
            responseData = resp;
        })
    })
    return responseData;
}

//payment reports
const getAllPayments = async () => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.get(url.ALL_PAYMENTS, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}
//sort date base on custom date
const sortPaymentReports = async (data) => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.SORT_REPORT_BY_DATE, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}

//payment reports by date range
const filterPaymentsByDate = async (data) => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.FILTER_PAYMENTS_BY_DATE, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}

//commissions by agent
const getCommissionsByAgents = async (data) => {
    await  localStorage.getItem('auth-token');
    let responseData;
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.GET_ALL_COMMISSIONS_BY_AGENT, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}

//commissions reports for current month
const getAllCurrentMonthCommissions = async (data) => {
    await  localStorage.getItem('auth-token');
    let responseData;
    console.log(data, 'data------------');
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.ALL_COMMISSIONS, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}

//commissions reports for date range
const getAllDateRangeCommissions = async (data) => {
    await  localStorage.getItem('auth-token');
    console.log('range ----')
    let responseData;
    console.log(data, 'data------------');
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.ALL_COMMISSIONS_BY_DATE_RANGE, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}

//commissions for individual agent
const agentsIndividualCommissionsCurrent = async (data) => {
    await  localStorage.getItem('auth-token');
    console.log('range ----')
    let responseData;
    console.log(data, 'data------------');
    const response = await axios.get(url.SANCTUM_URL).then(async res => {
        await axios.post(url.INDIVIDUAL_COMMISSIONS_CURRENT, data,{ headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
            console.log(resp, 'response');
            responseData = resp;
        })
    })
    return responseData;
}
const ReportService = {
    getAllCallReports,
    sortAllCallReports,
    sortAllCallReportsByagent,
    getAllPayments,
    getAllCurrentMonthCommissions,
    getAllDateRangeCommissions,
    filterPaymentsByDate,
    getCommissionsByAgents,
    agentsIndividualCommissionsCurrent
}

export default ReportService;
