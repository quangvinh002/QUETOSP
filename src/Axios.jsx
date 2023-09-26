import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL + 'api/'

axios.defaults.baseURL = API_URL
axios.defaults.timeout = 1000 * 60 * 30 // 10 phút
axios.defaults.headers.common.Accept = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

axios.interceptors.request.use((config) => {
    if (localStorage.getItem('@token')) {
        config.headers.Authorization =
            'Bearer ' + localStorage.getItem('@token') || ''
    }
    return config
})

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error?.response?.status === 401) {
            if (
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/'
            ) {
                alert('Tính năng cần xác thực, vui lòng đăng nhập để tiếp tục')
                localStorage.removeItem('@current_user')
                localStorage.removeItem('@token')
                window.location.href = `/login`
            }
        }
        return error?.response
    }
)

export default axios
