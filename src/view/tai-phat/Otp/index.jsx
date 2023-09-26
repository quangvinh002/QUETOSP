import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    Form,
    Modal,
    Spin,
    Pagination,
    message,
    notification,
    Select,
    Table,
    Tag,
    Popconfirm
} from 'antd'
import { DocumentUpload, DocumentDownload } from 'iconsax-react'
import Axios from '@/Axios'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery, useQuery } from '@apollo/client'
import { CTV_USERS, SEND_OTP_HISTORIES } from '@/constants'
import { getUserInfo } from 'helpers'

const { Column } = Table
const packs = JSON.parse(localStorage.getItem('@packs'))
const userInfo = getUserInfo()

export default function Inventory({ history }) {
    const [filter, setFilter] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [modalLoading, setModalLoading] = useState(false)
    const [token, setToken] = useState()
    const [data, setData] = useState({})
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [selectedUser, setSelectedUser] = useState()
    const [listData, setListData] = useState()
    const [getAll] = useLazyQuery(SEND_OTP_HISTORIES)
    const [loading, setLoading] = useState(false)
    const ctvList = useQuery(CTV_USERS)
    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'SỐ THUÊ BAO',
            key: 'phone_number',
            sorter: (a, b) => a.phone_number - b.phone_number,
            sortDirections: ['descend']
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user', 'name'],
            render: (text) => <Tag>{text}</Tag>
        },
        { title: 'GÓI CƯỚC', key: 'code' },
        { title: 'NGÀY TẠO', key: 'created_at' },
        {
            title: 'TRẠNG THÁI',
            key: 'status',
            render: (text) =>
                text === 1 ? (
                    <Tag color="magenta">Thành công</Tag>
                ) : (
                    <Tag>Thất bại</Tag>
                )
        }
    ]
    const showModal = () => {
        setIsModalOpen(true)
    }

    useEffect(() => {
        setLoading(true)
        getAll({
            variables: {
                ...filter,
                page,
                limit
            }
        })
            .then((res) => {
                const resp = res?.data?.SendOtpHistories
                setListData(resp?.data)
                setTotal(resp?.total)
            })
            .finally(() => setLoading(false))
    }, [page, limit, filter])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const confirmCodeRegister = () => {
        setModalLoading(true)
        const params = {
            token,
            email: selectedUser,
            ...data
        }

        Axios.post('otp/confirm-otp', params)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data?.success) {
                    notification.success({
                        title: 'Đăng ký thành công',
                        description: data?.message
                    })
                } else {
                    message.error(data?.message || 'Api lỗi xử lý !')
                }
            })
            .finally(() => {
                setIsModalOpen(false)
                setModalLoading(false)
            })
    }

    const getOTPCode = () => {
        setModalLoading(true)
        const params = {
            token,
            email: selectedUser,
            ...data
        }

        Axios.post('otp/get-otp', params)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data?.success) {
                    message.success('Đã gửi otp thành công!')
                } else {
                    message.error(data?.message || 'Có lỗi xảy ra !')
                }
            })
            .finally(() => {
                setModalLoading(false)
            })
    }

    const onChange = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        setData({ ...data, [name]: value })
    }

    const selectCTV = (email) => {
        setModalLoading(true)
        setSelectedUser(email)
        const params = {
            email
        }
        Axios.post('otp/login', params)
            .then((res) => {
                const _data = res?.data?.data
                if (_data?.success) {
                    const token = _data?.data?.token
                    setToken(token)
                    setStep(2)
                    console.log(' _data?.branch_id', res?.data?.branch_id)
                    localStorage.setItem('@branch_id', res?.data?.branch_id)
                    localStorage.setItem('@otpToken', token)
                }

                if (_data?.message) {
                    message.warning(`Thông báo API: ${_data?.message}`)
                }
            })
            .finally(() => setModalLoading(false))
    }

    const exportExcel = () => {
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Lịch sử OTP.xlsx'

        Axios.post('export/otp_history', {
            responseType: 'blob'
        })
            .then((res) => {
                link.href = URL.createObjectURL(new Blob([res.data]))
                link.click()
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Spin spinning={loading} size="large">
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Quản lý"
                            breadCrumbActive="Mời gói cước"
                        />

                        <Col span={24} md={12}>
                            <Row
                                gutter={[16, 16]}
                                justify="end"
                                className="hp-ecommerce-app-inventory-events">
                                {userInfo?.role < 3 && (
                                    <Col>
                                        <Button
                                            onClick={exportExcel}
                                            size="small">
                                            <DocumentDownload variant="Bulk" />
                                            <span className="hp-ml-8">
                                                Xuất Excel
                                            </span>
                                        </Button>
                                    </Col>
                                )}
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={showModal}
                                        size="small">
                                        <DocumentUpload
                                            color="#fff"
                                            variant="Bulk"
                                        />
                                        <span className="hp-ml-8">
                                            Đăng ký OTP
                                        </span>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                {/* <Col span={24}>
                    <h2>Danh sách OTP</h2>
                    {userInfo?.role < 3 && (
                        <Button
                            onClick={() => {
                                if (!token) {
                                    message.error(
                                        'Vui lòng chọn tài khoản trước khi thực hiện thao tác'
                                    )
                                    return
                                }

                                setLoading(true)
                                const params = {
                                    token
                                }

                                Axios.post('otp/transactions', params)
                                    .then((res) => {
                                        return res?.data?.data
                                    })
                                    .then((data) => {
                                        console.log('data = ', data)
                                    })
                                    .finally(() => {
                                        setLoading(false)
                                    })
                            }}>
                            Đồng bộ OSP 3 ngày
                        </Button>
                    )}
                </Col> */}
                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        dataSource={listData}
                        scroll={{
                            x: '100%'
                        }}
                        pagination={false}
                        footer={() => (
                            <Pagination
                                pageSize={limit}
                                showSizeChanger
                                onShowSizeChange={onShowSizeChange}
                                total={total}
                                onChange={onPageChange}
                                pageSizeOptions={['50', '100', '500', '1000']}
                            />
                        )}>
                        {columns?.map((i) => (
                            <Column {...i} dataIndex={i?.key} />
                        ))}
                    </Table>
                </Col>
            </Row>
            <Modal
                title="Mời gói cước"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={
                    step === 1 ? (
                        'Chọn tài khoản CTV để tiếp tục'
                    ) : (
                        <>
                            <Popconfirm
                                title="Xác nhận thao tác"
                                onConfirm={getOTPCode}>
                                <Button>Lấy OTP</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Xác nhận thao tác"
                                onConfirm={confirmCodeRegister}>
                                <Button type="primary">Đăng ký gói cước</Button>
                            </Popconfirm>
                        </>
                    )
                }>
                <Spin size="large" spinning={modalLoading}>
                    {step === 1 ? (
                        <Select
                            placeholder="Chọn tài khoản"
                            value={selectedUser}
                            style={{
                                width: '100%'
                            }}
                            onChange={selectCTV}
                            options={ctvList?.data?.CtvUsers?.map((i) => ({
                                value: i?.email,
                                label: i?.display_name || i?.email
                            }))}
                        />
                    ) : (
                        <Form
                            layout="vertical"
                            name="basic"
                            initialValues={{ remember: true }}>
                            <Form.Item label="Số điện thoại" name="phone">
                                <Input
                                    value={data.phone}
                                    name="phone"
                                    onChange={onChange}
                                />
                            </Form.Item>
                            <Form.Item label="Gói cước">
                                <Select
                                    allowClear
                                    showSearch
                                    style={{
                                        width: '100%'
                                    }}
                                    placeholder="Mã gói cước"
                                    optionFilterProp="children"
                                    onChange={(value) =>
                                        setData({ ...data, code: value })
                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? '')
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={(packs || []).map((d) => ({
                                        value: d.code,
                                        label: d.code
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item label="OTP">
                                <Input
                                    value={data.otp}
                                    name="otp"
                                    onChange={onChange}
                                />
                            </Form.Item>
                        </Form>
                    )}
                </Spin>
            </Modal>
        </Spin>
    )
}
