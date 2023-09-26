import userDashboards from './user-dashboards'
import taiPhatDashboards from './taiPhat-dashboards'
import locgoiDashboards from './locgoi-dashboards'

const navigation =
    process.env.REACT_APP_ENV === 'clone'
        ? locgoiDashboards
        : JSON.parse(localStorage.getItem('@current_user'))?.role < 3
        ? taiPhatDashboards
        : userDashboards

// ? [...navigation, ...dashboards, ...apps, ...pages, ...userInterface]

export default navigation
