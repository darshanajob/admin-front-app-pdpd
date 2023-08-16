import axios from "axios";
import { get, post } from "helpers/api_helper";
import React, { useState } from "react";
import * as url from "./url";


const token = localStorage.getItem('auth-token');

const config = {
  xsrfHeaderName: "X-XSRF-TOKEN",
  withCredentials: true,
  Authorization: `Bearer ${token}`,
};


const authUser = JSON.parse(localStorage.getItem('authUser'));
// console.log(JSON.parse(localStorage.getItem('authUser')),'hiii');



const registerStudent = async (data) => {
  // console.log(data, 'data')
  // const response = await get(url.SANCTUM_URL, config).then(response => {
  //   console.log(response.status , 'response')
  //   return post(url.STUDENT_REGISTER, data, {
  //     xsrfHeaderName: "X-XSRF-TOKEN", 
  //     withCredentials: true,
  //     Authorization: `Bearer ${token}`,
  //   });
  // })

  let responseData;
  const token = localStorage.getItem('auth-token');
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const response = await axios.get(url.SANCTUM_URL).then(async response => {

    if (authUser?.roles[0]?.name === 'super-admin') {
      await axios.post(url.STUDENT_REGISTER_SUPER, data, { headers: { "Authorization": `Bearer ${token}` } }).then(res => {
        console.log('super-admin');
        responseData = res;
      });
    } else if (authUser?.roles[0]?.name === 'normal-admins') {
      await axios.post(url.STUDENT_REGISTER_NORMAL, data, { headers: { "Authorization": `Bearer ${token}` } }).then(res => {
        console.log('normal-admins');
        responseData = res;
      });
    } else if (authUser?.roles[0]?.name === 'agent') {
      await axios.post(url.STUDENT_REGISTER_AGENT, data, { headers: { "Authorization": `Bearer ${token}` } }).then(res => {
        console.log('agent');
        responseData = res;
      });
    }
  })
  return responseData;
};

const getAllStudents = async (pageNumber) => {
  console.log(pageNumber, 'page number--')
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const token = localStorage.getItem('auth-token');
  let responseData;
  //console.log(authUser?.roles[0]?.name, 'responseAuthUser');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    if (authUser?.roles[0]?.name === 'super-admin') {
      await axios.get(url.GET_ALL_STUDENTS_SUPER + pageNumber, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'super-admin');
        responseData = resp;
      })
    } else if (authUser?.roles[0]?.name === 'normal-admins') {
      await axios.get(url.GET_ALL_STUDENTS_NORMAL + pageNumber, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'normal-admins');
        responseData = resp;
      })
    } else if (authUser?.roles[0]?.name === 'agent') {
      await axios.get(url.GET_ALL_STUDENTS_AGENT + pageNumber, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'agent');
        responseData = resp;
      })
    }
  })
  return responseData;
}

const getAgentAllStudents = async (pageNumber) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.get(url.GET_AGENTS_ALL_STUDENTS + pageNumber, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
  })
  return responseData;
}

const getAdminAllStudents = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.get(url.GET_ADMIN_ALL_STUDENTS, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
  })
  return responseData;
}

const getAllAgents = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  console.log(token, 'response');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    if (authUser?.roles[0]?.name === 'super-admin') {
      await axios.get(url.GET_ALL_AGENTS_SUPER, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    } else if (authUser?.roles[0]?.name === 'normal-admins') {
      await axios.get(url.GET_ALL_AGENTS_NORMAL, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    }
  })
  return responseData;
}

const getNoAgentAllAgents = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  console.log(token, 'response');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {

    // if (authUser?.roles[0]?.name === 'super-admin') {
      await axios.get(url.GET_NO_AGENT_ALL_STUDENTS, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    // } else if (authUser?.roles[0]?.name === 'normal-admins') {
    //   await axios.get(url.GET_ALL_AGENTS_NORMAL, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
    //     console.log(resp, 'response');
    //     responseData = resp;
    //   })
    // }
  })
  return responseData;
}

const getAllAgentsWithStudentCount = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.get(url.GET_ALL_AGENTS_STU_COUNT, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
  })
  return responseData;
}

const getAllBatches = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.get(url.GET_ALL_BATCHES, { headers: { "Authorization": `Bearer ${token}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
  })
  return responseData;
}

const deleteStudent = async (id) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    if (authUser?.roles[0]?.name === 'super-admin') {
      await axios.delete(url.DELETE_STUDENT_SUPER + id, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}`,"Content-Type":"application/x-www-form-urlencoded"  } }).then(resp => {
        console.log(resp, 'responseqqq');
        responseData = resp;
      })
    } else if (authUser?.roles[0]?.name === 'normal-admins') {
      console.log(url.DELETE_STUDENT_NORMAL + id, 'response');
      await axios.delete(url.DELETE_STUDENT_NORMAL + id, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}`,"Content-Type":"application/x-www-form-urlencoded"  } }).then(resp => {
        responseData = resp;
      })
    } 
  })
  return responseData;
}

const editStudent = async (id, data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  console.log(id, 'responsedata');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    if (authUser?.roles[0]?.name === 'super-admin') {
      console.log(localStorage.getItem('auth-token'),'here-------------------------')
      await axios.put(url.EDIT_STUDENT_SUPER + id, data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        responseData = resp;
      })
    } else if (authUser?.roles[0]?.name === 'normal-admins') {
      console.log(token, 'responsedataadmin');
      await axios.put(url.EDIT_STUDENT_NORMAL + id, data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    } else if (authUser?.roles[0]?.name === 'agent') {
      await axios.put(url.EDIT_STUDENT_AGENT + id, data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
    }
  })
  return responseData;
}

const registerStudentArray = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  console.log(data, 'response');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.post(url.REGISTER_STUDENTS_ARRAY, data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
  })
  return responseData;
}

const allocateStudentsToAgent = async (data) => {
  let responseData;
  console.log(data, 'response');
  const token = localStorage.getItem('auth-token');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
      await axios.post(url.ALLOCATE_STUDENTS_TO_AGENT, data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
        console.log(resp, 'response');
        responseData = resp;
      })
  })
  return responseData;
}
const filterStudents = async (data) => {
  let responseData;
  const token = localStorage.getItem('auth-token');
  console.log(data, 'response');
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.FILTER_STUDENTS, data, { headers: { "Authorization": `Bearer ${localStorage.getItem('auth-token')}` } }).then(resp => {
      console.log(resp, 'response');
      responseData = resp;
    })
  })
  return responseData;
}
const StudentServices = {
  
  registerStudent,
  getAllStudents,
  getAllAgents,
  getAllAgentsWithStudentCount,
  deleteStudent,
  editStudent,
  getAgentAllStudents,
  registerStudentArray,
  getNoAgentAllAgents,
  allocateStudentsToAgent,
  getAdminAllStudents,
  getAllBatches,
  filterStudents
}

export default StudentServices;
