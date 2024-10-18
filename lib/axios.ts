import axiosBase from 'axios'

export const axios = axiosBase.create({
    baseURL:'https://api.billpointpos.co/api/'
})