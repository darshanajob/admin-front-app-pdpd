import http from './http-common'
import { get, post } from "../helpers/api_helper"
import * as url from "./url"
import axios from "axios";
import {ALL_AGENT_BY_ADMIN} from "./url";
const token = localStorage.getItem('auth-token');
const register = () => {
  const res =  http.get("/sanctum/csrf-cookie").then((response) => {});
  console.log(res, 'lobhdbfhudsbfu')
  return res;
};

// get agents
const getAll = () => get(url.ALL_ADMINS, config)

/*const getAllAgents = async () => {
  let some;
  const response = await get(url.SANCTUM_URL).then(async response => {
    console.log('HIIIIIIIIIIIIIIIIIIIIIIi');

    await axios.get(url.ALL_AGENT_BY_ADMIN, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
      console.log(resp, 'response');
      responseData = resp;
    })


    await axios.get(url.ALL_AGENT_BY_ADMIN).then(res => {
      console.log(res);
      some = res;
    }, []).catch(error => {
      some = error;
    });


  })
  return some;

};*/

const getAllAgents = async () => {
  let responseData;
  await  localStorage.getItem('auth-token');
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    if (authUser?.roles[0]?.name === 'super-admin' || authUser?.roles[0]?.name === 'normal-admins') {
      await axios.get(url.ALL_AGENT_BY_ADMIN, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    }else{
      await axios.get(url.ALL_AGENT_BY_AGENT, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    }

  })
  return responseData;
}
// add agents
export const addNewAgent = async admin => {
  await get(url.SANCTUM_URL)
  return await post(url.REGISTER_AGENT, admin)
}

// update admin
const verifyAdmin = async link => {
  console.log(link, 'link')
  await get(url.SANCTUM_URL)
  return await post(url.VERIFY_ADMIN, link) // add config part and xsrfHeaderName: "X-XSRF-TOKEN", header if its not working
}

//all agents

const AgentService = {
  register,
  verifyAdmin,
  addNewAgent,
  getAllAgents
}

export default AgentService
