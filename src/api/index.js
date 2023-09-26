import axios from 'axios'
//Purpose: function  for setUp api calling structure
const api = axios.create({
  baseURL: 'http://localhost:3050/',
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
