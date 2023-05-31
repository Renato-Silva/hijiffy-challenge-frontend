import axios from 'axios'

const axiosIns = axios.create({
// You can add your headers here
// ================================
  baseURL: 'http://localhost:8000/api/'
})

axiosIns.interceptors.request.use(config => {
  // Retrieve the value from local storage and add it to the request headers
  const token = JSON.parse(localStorage.getItem('token'))
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
})

export default axiosIns
