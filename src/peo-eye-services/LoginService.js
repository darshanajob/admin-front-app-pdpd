import { get, post } from "../helpers/api_helper"
import * as url from "./url"
import axios from "axios";


/*const login = async (data) => {
    console.log(data, 'data')
    const response = await get(url.SANCTUM_URL).then(response => {
        console.log(response.status, 'test')
       let some = post(url.COMMON_LOGIN,data);
        return some;

    })


};*/
const login = async (data) => {
    let some;
    const response = await get(url.SANCTUM_URL).then(async response => {
        /* console.log(response.status, 'test')
        let some = post(url.COMMON_LOGIN,data);
         console.log(some);
         return some;*/
        await axios.post(url.COMMON_LOGIN, data).then(res => {
            console.log(res);
            some = res;
        }).catch(error => {
            some = error;
        });


    })
    return some;

};

const logout = async () => {
    let logout;
    const response = await get(url.SANCTUM_URL).then(async response => {
        /* console.log(response.status, 'test')
        let some = post(url.COMMON_LOGIN,data);
         console.log(some);
         return some;*/
        await axios.post(url.COMMON_LOGIN, data).then(res => {
            console.log(res);
            logout = res;
        }).catch(error => {
            logout = error;
        });


    })
    return logout;
}

const getSanctum= () => get(url.SANCTUM_URL);
const LoginService = {
    login,
    getSanctum
}

export default LoginService
