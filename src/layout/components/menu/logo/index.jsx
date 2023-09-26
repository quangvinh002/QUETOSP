import { Link, useLocation } from 'react-router-dom'

import logo from '@/assets/images/logo/logo.png'
import { Button, message, Upload } from 'antd'
import { getUserInfo } from 'helpers'
import { UploadOutlined } from '@ant-design/icons'

const userInfo = getUserInfo()
const API_URL = process.env.REACT_APP_API_URL

export default function MenuLogo(props) {
    const location = useLocation()

    const propsUpload = {
        name: 'file',
        action: process.env.REACT_APP_API_URL + 'api/upload-banner',
        beforeUpload: (file) => {
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg']
            const isPNG = validImageTypes?.includes(file.type)
            if (!isPNG) {
                message.error(`${file.type} is not a png file`)
            }

            return isPNG || Upload.LIST_IGNORE
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`)
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`)
            }
        }
    }

    return process.env.REACT_APP_ENV === 'clone' ? null : (
        <>
            <div className="hp-header-logo hp-d-flex hp-align-items-center">
                <Link
                    to="/"
                    onClick={props.onClose}
                    className="hp-position-relative hp-d-flex">
                    <img className="hp-logo" src={logo} alt="logo" />
                </Link>
            </div>
            {!location.pathname.includes('login') && (
                <div>
                    <img
                        src={`${API_URL}storage/images/banner.jpg?${Date.now()}`}
                        alt="logo"
                    />
                    <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                        {userInfo?.role < 3 && (
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />} />
                            </Upload>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
