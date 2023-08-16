import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";
const token = localStorage.getItem('auth-token');
//pass new generated access token here

console.log(localStorage.getItem('auth-token') , 'api helper access token')
export const  getToken =  () => {
  return localStorage.getItem("auth-token")
    ? localStorage.getItem("auth-token")
    : null
}

//apply base url for axios
const API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { Authorization: `Bearer ${getToken()}`},
});
console.log()
axiosApi.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url, data, config = {}) {
  return  await axiosApi.post(url, { ...data }, { ...config }).then(response => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data);
}
