import axios from "axios"
import { get, post } from "helpers/api_helper"
import React, { useState } from "react"
import * as url from "./url"
import { ALL_PAYMENTS_STUDENT, SORT_REPORT_BY_DATE, VERIFY_PAYMENT } from "./url"

const token = localStorage.getItem("auth-token")

const config = {
  xsrfHeaderName: "X-XSRF-TOKEN",
  withCredentials: true,
  Authorization: `Bearer ${token}`
}

//batches
const getAllBatches = async () => {
  let responseData
  await localStorage.getItem("auth-token")
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.GET_BATCHES, { headers: { "Authorization": `Bearer ${localStorage.getItem("auth-token")}` } }).then(resp => {
//      console.log(resp, 'response');
      responseData = resp
    })
  })
  return responseData
}

/*
// add and update batch
export const addNewBatch = async admin => {
  await get(url.SANCTUM_URL)
  return await post(url.ADD_BATCH, admin)
}
*/

// add and update batch
const addNewBatch = async (admin) => {
  let responseData
  await localStorage.getItem("auth-token")
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.ADD_BATCH, admin, { headers: { "Authorization": `Bearer ${localStorage.getItem("auth-token")}` } }).then(resp => {
      responseData = resp
    })
  })
  return responseData
}

/*// change status of a batch
export const changeStatus = async admin => {
  await get(url.SANCTUM_URL)
  return await post(url.UPDATE_STATUS_BATCH, admin)
}*/

// add and update batch
const changeStatus = async (admin) => {
  let responseData
  await localStorage.getItem("auth-token")
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.UPDATE_STATUS_BATCH, admin, { headers: { "Authorization": `Bearer ${localStorage.getItem("auth-token")}` } }).then(resp => {
      responseData = resp
    })
  })
  return responseData
}

// save batch image
const saveBatchImage = async (data) => {
  let responseData
  await localStorage.getItem("auth-token")
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.post(url.SAVE_BATCH_IMAGE, data, {
      headers:
        {
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
          "Accept": "application/json",
          "Content-Type": "multipart/form-data"
        }
    }).then(resp => {
      responseData = resp
    })
  })
  return responseData
}
// get batch image
const getBatchImage = async () => {
  let responseData
  await localStorage.getItem("auth-token")
  const response = await axios.get(url.SANCTUM_URL).then(async res => {
    await axios.get(url.GET_BATCH_IMAGE, { headers: { "Authorization": `Bearer ${localStorage.getItem("auth-token")}` } }).then(resp => {
//      console.log(resp, 'response');
      responseData = resp
    })
  })
  return responseData
}
const BatchService = {
  getAllBatches,
  addNewBatch,
  changeStatus,
  saveBatchImage,
  getBatchImage
}

export default BatchService
