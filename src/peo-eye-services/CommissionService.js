import http from './http-common'
import { get, post } from "../helpers/api_helper"
import * as url from "./url"
import axios from "axios";
import {ALL_AGENT_BY_ADMIN, GET_COMMISSIONS_BY_AGENT} from "./url";
import accessToken from "../helpers/jwt-token-access/accessToken";

//pass new generated access token here
const token = accessToken;
const config = {
  Authorization: token,
  xsrfHeaderName: "X-XSRF-TOKEN", // change the name of the header to "X-XSRF-TOKEN" and it should works
  withCredentials: true,
}


/*const update = async data => {
  console.log(data, 'data')
  await get(url.SANCTUM_URL)
  return await post(url.UPDATE_COMMISSIONS, data) // add config part and xsrfHeaderName: "X-XSRF-TOKEN", header if its not working
}*/

// update commissions
const update = async (data) => {
  let responseData;
  await  localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.UPDATE_COMMISSIONS ,data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}

const getCommissions = async () => {
  let responseData;
  await  localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.GET_COMMISSIONS_BY_AGENT, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      console.log(resp, 'response');
      responseData = resp;
    })
  })
  return responseData;
}


// get commissions
const getAllCommissionTypes = async () => {
  let responseData;
  await localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.GET_ALL_COMMISSION_TYPES, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}
const CommissionService = {
  getAllCommissionTypes,
  update,
  getCommissions
}


export default CommissionService
