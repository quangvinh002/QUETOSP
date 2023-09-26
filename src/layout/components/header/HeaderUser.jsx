import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { Dropdown, Col, Divider, Row, Avatar } from 'antd'
import { getAcronym } from 'helpers'

const userInfo = JSON.parse(localStorage.getItem('@current_user'))
export default function HeaderUser() {
    const history = useHistory()

    const menu = (
        <div className="hp-user-dropdown hp-border-radius hp-bg-black-0 hp-bg-dark-100 hp-border-color-dark-80 hp-py-24 hp-px-18 hp-mt-16">
            <span className="hp-d-block h5 hp-font-weight-500 hp-text-color-black-100 hp-text-color-dark-0 hp-mb-16">
                Thiết lập thông tin
            </span>

            <Link
                to="/pages/profile/personel-information"
                className="hp-p1-body hp-font-weight-500 hp-hover-text-color-primary-2">
                Thông tin tài khoản
            </Link>

            <Divider className="hp-mb-18 hp-mt-12" />

            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <div
                        onClick={() => {
                            localStorage.clear()
                            history.push('/login')
                        }}
                        className="hp-p1-body hp-font-weight-500 hp-hover-text-color-primary-2">
                        Đăng xuất
                    </div>
                </Col>
            </Row>
        </div>
    )

    return (
        <Col>
            <Dropdown overlay={menu} placement="bottomLeft">
                <div className="hp-border-radius-xl hp-cursor-pointer hp-border-1 hp-border-color-dark-80">
                    <div
                        className="hp-border-radius-lg hp-overflow-hidden hp-bg-info-4 hp-m-4 hp-d-flex"
                        style={{ minWidth: 32, width: 32, height: 32 }}>
                        <Avatar shape="square" size={48}>
                            {getAcronym(userInfo?.name) || ''}
                        </Avatar>
                    </div>
                </div>
            </Dropdown>
        </Col>
    )
}
