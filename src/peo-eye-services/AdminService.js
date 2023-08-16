import http from "./http-common"
import { del, get, post, put } from "../helpers/api_helper"
import * as url from "./url"


import accessToken from "../helpers/jwt-token-access/accessToken";
import axios from "axios";

//pass new generated access token here
const token = accessToken;
const config = {
  Authorization: token,
  xsrfHeaderName: "X-XSRF-TOKEN", // change the name of the header to "X-XSRF-TOKEN" and it should works
  withCredentials: true,
}

// get admins
const getAll = () => get(url.ALL_ADMINS, config)

// get all admins
const getAllAdmins = async () => {
  await  localStorage.getItem('auth-token');
  let responseData;
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.ALL_ADMINS, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      console.log(resp, 'response');
      responseData = resp;
    })
  })
  return responseData;
}

const getAllLinks = async (id) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.get(url.USER_LINKS + id, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        responseData = resp;
        console.log(resp, 'respkonaetoken');
      })
  })
  return responseData;
}

/*const updateAdmin = async (data) => {
  const response = await get(url.SANCTUM_URL, config).then(response => {
    console.log(response.status, 'rrrrrrrrrr')
    return post(url.ADMIN_UPDATE_STATUS,data,{
      xsrfHeaderName: "X-XSRF-TOKEN", // change the name of the header to "X-XSRF-TOKEN" and it should works
      withCredentials: true,
      Authorization: `Bearer ${token}`,
    });
  });
};*/

/*
// add users
export const addNewAdmin = async admin => {
  await get(url.SANCTUM_URL)
  return await post(url.REGISTER_ADMIN, admin)
}
*/

// update admin
const addNewAdmin = async (admin) => {
  let responseData;
  await  localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.REGISTER_ADMIN ,admin, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}
// update admin
const updateAdmin = async (id) => {
  let responseData;
  await  localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.ADMIN_UPDATE_STATUS ,id, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}

/*// add course link
const addCourseLink = async data => {
  await get(url.SANCTUM_URL)//
  return await post(url.COURSE_LINK, data)
}*/

// add course link
const addCourseLink = async (data) => {
  let responseData;
  await  localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.COURSE_LINK ,data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}

/*// get all course links
const getAllCourseLinks = () => {
  return get(url.COURSE_LINK)
}*/

// get all course links
const getAllCourseLinks = async () => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.COURSE_LINK, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}

/*
// change status course link
const statusChangeCourseLink = async (id) => {
  await get(url.SANCTUM_URL)
  return await get(url.COURSE_LINK_STATUS_CHANGE + id)
}
*/

// change status course link
const statusChangeCourseLink = async (id) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.COURSE_LINK_STATUS_CHANGE + id, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      responseData = resp;
    })
  })
  return responseData;
}

// delete course link
const deleteCourseLink = async(id) => {
  let responseData;
  //return del(url.COURSE_LINK + id)
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.delete(url.COURSE_LINK + id, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      console.log(resp, 'responseqqq');
      responseData = resp;
    })
  })
}





const AdminService = {
  getAll,
  addNewAdmin,
  updateAdmin,
  getAllLinks,
  addCourseLink,
  getAllCourseLinks,
  statusChangeCourseLink,
  deleteCourseLink,
  getAllAdmins
}

export default AdminService
