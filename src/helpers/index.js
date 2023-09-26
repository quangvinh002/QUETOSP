import dayjs from 'dayjs'
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

export const toCurrentTimezone = (date) => {
    // return dayjs.utc().isUTC() ? dayjs(date).add(7, 'h') : dayjs(date)
    return date
}

export const getAcronym = (name) => {
    return name
        ?.match(/\b(\w)/g)
        .slice(-2)
        .join('')
}

export const getAcronymBranch = (name) => {
    return name
        .split(/\s/)
        .reduce((response, word) => (response += word.slice(0, 1)), '')
}

export const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('@current_user'))
    return user
}

export const formatDate = (date, time = true) => {
    return dayjs(date).format(time ? 'DD/MM/YYYY hh:mm:ss A' : 'DD/MM/YYYY')
}

export const toCurrency = (_number) => {
    const number = parseInt(_number)
    return number !== null
        ? number.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
          })
        : ''
}
