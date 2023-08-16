import axios from 'axios'

export default axios.create({
  baseURL: process.env.REACT_APP_BACKEND_ENDPOINT,
  headers: {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    'Content-Type': 'application/json',
  },
})
