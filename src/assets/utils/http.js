import axios from "axios"
axios.defaults.baseURL = 'http://42.194.173.140:8080/reader3'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 20000
//响应拦截器
axios.interceptors.response.use(response => {
    return response.data
}
)
export default axios