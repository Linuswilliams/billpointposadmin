import axiosBase from 'axios'

export const axios = axiosBase.create({
    baseURL:'http://localhost:3001/api/'
})