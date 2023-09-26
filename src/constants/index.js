export * from './queries'
export * from './mutations'

export const ROLES = [
    'Admin',
    'Quản lý hệ thống',
    'Quản lý chi nhánh',
    'Nhân viên'
]

export const CHANNELS = [
    { label: 'Mặc định', value: 1 },
    { label: 'EZ', value: 2 }
]

export const USER_TYPES = [
    {
        value: 1,
        label: 'Full time'
    },
    {
        value: 2,
        label: 'Part time'
    }
]

export const USER_ACTIVE_TYPES = [
    {
        value: 0,
        label: 'Đã khóa'
    },
    {
        value: 1,
        label: 'Đang hoạt động'
    }
]

export const PACK_CODES = [
    {
        value: '6C90N',
        label: '6C90N'
    },
    {
        value: '12C90N',
        label: '12C90N'
    }
]

export const REGISTER_CHANNELS = [
    {
        value: 'KH23',
        label: 'KH23'
    },
    {
        value: 'KH29',
        label: 'KH29'
    },
    {
        value: 'KH27',
        label: 'KH27'
    },
    {
        value: 'GA27',
        label: 'GA27'
    },
    {
        value: 'OTP',
        label: 'OTP'
    }
]

export const REGISTER_REPORT_CHANNELS = [
    {
        value: 'KH',
        label: 'KH'
    },
    {
        value: 'GA',
        label: 'GA'
    },
    {
        value: 'OTP',
        label: 'OTP'
    },
    {
        value: 'GH',
        label: 'GH'
    },
    {
        value: 'CODE',
        label: 'CODE'
    }
]

export const UPGRADE_STATUS = [
    { value: 0, label: 'Chờ duyệt' },
    { value: 1, label: 'Duyệt thành công' },
    { value: 402, label: 'Không thành công' },
    { value: 500, label: 'Không duyệt' }
]

export const REPORT_TYPE = [
    { value: 'all', label: 'Tổng hợp' },
    { value: 'detail', label: 'Chi tiết' }
]

export const REFUND_STATUS = [
    { value: -1, label: 'Không tồn tại giao dịch trong ngày' },
    { value: 0, label: 'Đã nhận, chờ xử lý' },
    { value: 1, label: 'Đã nhận, đang xử lý' },
    { value: 2, label: 'Hoàn thành' },
    { value: 3, label: 'Hoàn tiền' },
    { value: 91, label: 'Vượt quá số tiền nhận tối đa trong ngày' },
    { value: 92, label: 'Độ dài của số điện thoại không đúng (9 / 10 / 11)' },
    { value: 93, label: 'Sai mệnh giá hệ thống quy định' },
    {
        value: 94,
        label: 'Thông tin nhà mạng không đúng (VIETTEL, MOBI, VINA)'
    },
    { value: 95, label: 'Đang tạm dừng dịch vụ cho nhà mạng này' },
    { value: 96, label: 'Không được gửi đơn liên tiếp cùng một số' },
    { value: 97, label: 'Số dư không đủ để thực hiện giao dịch' },
    { value: 98, label: 'Giao dịch không thành công' },
    { value: 99, label: 'Giao dịch bị từ chối' },
    { value: 401, label: 'Hoàn lỗi' }
]

export const CALL_STATUS = [
    {
        value: 1,
        label: 'Đăng ký thành công'
    },
    {
        value: 2,
        label: 'Không nghe máy'
    },
    {
        value: 3,
        label: 'Thuê bao'
    },
    {
        value: 9,
        label: 'Không nhu cầu'
    },
    {
        value: 6,
        label: 'Tham khảo'
    },
    {
        value: 10,
        label: 'Đã đăng ký rồi'
    },
    {
        value: 5,
        label: 'Hẹn gọi lại'
    },
    {
        value: 8,
        label: 'Hẹn nạp tiền'
    },
    {
        value: 4,
        label: 'Khác'
    },
    {
        value: 0,
        label: 'Chưa lấy số'
    },
    {
        value: 7,
        label: 'Đã lấy số'
    }
]

export const CALL_INPUT_STATUS = [
    {
        value: 1,
        label: 'Đăng ký thành công'
    },
    {
        value: 2,
        label: 'Không nghe máy'
    },
    {
        value: 3,
        label: 'Thuê bao'
    },
    {
        value: 9,
        label: 'Không nhu cầu'
    },
    {
        value: 6,
        label: 'Tham khảo'
    },
    {
        value: 10,
        label: 'Đã đăng ký rồi'
    },
    {
        value: 5,
        label: 'Hẹn gọi lại'
    },
    {
        value: 8,
        label: 'Hẹn nạp tiền'
    },
    {
        value: 4,
        label: 'Khác'
    }
]

export const colors = [
    'pink',
    'red',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'lime',
    'silver',
    'olive',
    'darkblue'
]
export const toCurrency = (_number) => {
    const number = parseInt(_number)
    return number !== null
        ? number.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
          })
        : ''
}

export const currencyFormatter = {
    formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
    controls: false
}
