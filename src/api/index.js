import axios from 'axios'
//Purpose: function  for setUp api calling structure
const api = axios.create({
  baseURL: 'https://www.salesmind.work/',
  // baseURL: 'https://sales-mind-app-test.herokuapp.com/',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: () => true,
})
//Purpose: attache authorized token with apis

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
export { api }
