import axiosBase from 'axios'

export const axios = axiosBase.create({
    baseURL:'https://blord-admin-server.onrender.com/api/'
})