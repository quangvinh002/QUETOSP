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
    Tag,
    Select,
    Table,
    Typography,
    InputNumber,
    DatePicker,
    Upload,
    Alert,
    List
} from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { DocumentUpload } from 'iconsax-react'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    UPGRADE_HISTORIES,
    UPGRADE_STATUS,
    CREATE_UPGRADE_HISTORY,
    UPDATE_UPGRADE_HISTORY,
    UPDATE_UPGRADE_HISTORY_STATUS,
    DELETE_UPGRADE_HISTORY,
    UPLOAD_FILE_UPGRADE,
    toCurrency,
    colors,
    currencyFormatter,
    CHANNELS
} from '@/constants'
import { getUserInfo } from 'helpers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Axios from '@/Axios'
import * as XLSX from 'xlsx'

dayjs.extend(utc)
const { Column } = Table
const { Title } = Typography
const { Paragraph } = Typography
const packs = JSON.parse(localStorage.getItem('@packs'))
const user = getUserInfo()

export default function Inventory({}) {
    const [filter, setFilter] = useState({})
    const [selectedPack, setSelectedPack] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [data, setData] = useState({ channel: 1, simtype: 0 })
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [listData, setListData] = useState()
    const [getAll] = useLazyQuery(UPGRADE_HISTORIES)
    const [createUpgrade] = useMutation(CREATE_UPGRADE_HISTORY)
    const [updateUpgrade] = useMutation(UPDATE_UPGRADE_HISTORY)
    const [deleteUpgrade] = useMutation(DELETE_UPGRADE_HISTORY)
    const [updateUpgradeStatus] = useMutation(UPDATE_UPGRADE_HISTORY_STATUS)
    const [uploadUpgradeFile] = useMutation(UPLOAD_FILE_UPGRADE)
    const [loading, setLoading] = useState(false)
    const [loadingIndex, setLoadingIndex] = useState()
    const [duplicateDatas, setDuplicateDatas] = useState()
    const [form] = Form.useForm()

    useEffect(() => {
        if (selectedPack) {
            form.setFieldsValue({
                ...selectedPack,
                register_channel: selectedPack?.refund?.register_channel,
                gift_type: selectedPack?.refund?.gift_type
            })
        } else {
            form.resetFields()
        }
    }, [selectedPack])

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user', 'name'],
            render: (text) => <Tag>{text}</Tag>
        },
        {
            title: 'SỐ THUÊ BAO',
            key: 'phone_number',
            render(text, record) {
                return (
                    <span style={{ display: 'flex' }}>
                        {text}
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                const otpToken =
                                    localStorage.getItem('@otpToken')
                                console.log('otp = ', otpToken)
                                if (otpToken) {
                                    const params = {
                                        id: record?.id,
                                        token: otpToken,
                                        phone_number: text
                                    }

                                    setLoadingIndex(record?.id)
                                    Axios.post('otp/transactions', params)
                                        .then((res) => {
                                            return res?.data?.data
                                        })
                                        .then((data) => {
                                            if (data?.length) {
                                                message.success(
                                                    `Cập nhật sđt ${text} thành công`
                                                )
                                            } else {
                                                message.error(
                                                    `Không tìm thấy sđt ${text}`
                                                )
                                            }
                                        })
                                        .finally(() => setLoadingIndex(null))
                                } else {
                                    message.error(
                                        'Vui lòng chọn tài khoản trước khi thực hiện thao tác'
                                    )
                                    return
                                }
                            }}
                            size="small"
                            shape="circle"
                            style={{ marginLeft: 5 }}
                            icon={
                                <SyncOutlined
                                    spin={loadingIndex === record?.id}
                                    style={{ fontWeight: 'bold' }}
                                />
                            }
                        />
                    </span>
                )
            }
        },
        {
            title: 'CODE',
            key: ['pack', 'code'],
            render(text, record) {
                return <span>{text || record?.code}</span>
            }
        },
        {
            title: 'KÊNH NẠP',
            key: ['refund', 'channel'],
            render(text, record) {
                return <span>{text === 1 ? 'Mặc định' : 'EZ'}</span>
            }
        },
        {
            title: 'KÊNH ĐĂNG KÝ',
            key: ['refund', 'register_channel']
        },

        {
            title: 'TIỀN HOÀN',
            key: 'amount',
            render: (_, record) => toCurrency(record?.amount || 0)
        },
        {
            title: 'HOÀN DƯ',
            render: (_, record) => {
                const resAmount = parseInt(record?.res_amount)
                return resAmount ? (
                    <Tag
                        color={
                            resAmount > 0
                                ? '#87d068'
                                : resAmount < 0
                                ? '#cd201f'
                                : ''
                        }>
                        {toCurrency(resAmount)}
                    </Tag>
                ) : (
                    toCurrency(0)
                )
            }
        },
        {
            title: 'HOÀN LỖI',
            render: (_, record) =>
                record?.err_amount ? (
                    <Tag color="#cd201f">{toCurrency(record?.err_amount)}</Tag>
                ) : (
                    toCurrency(0)
                )
        },
        {
            title: 'TẶNG SIM',
            key: ['refund', 'gift_type'],
            render: (text, record) =>
                text === 1 ? (
                    <Tag>Sim không gói</Tag>
                ) : text === 2 ? (
                    <Tag>Sim có gói</Tag>
                ) : null
        },
        {
            title: 'TRẠNG THÁI',
            key: 'status',
            render: (_, record) => {
                if (record?.status) {
                    const index = UPGRADE_STATUS.findIndex(
                        (item) => item.value === record?.status
                    )

                    return (
                        <Tag color={colors[index]}>
                            {UPGRADE_STATUS[index]?.label}
                        </Tag>
                    )
                } else {
                    return user?.role < 3 ? (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => approveRequest(record?.id)}>
                            Duyệt
                        </Button>
                    ) : (
                        'Chờ duyệt'
                    )
                }
            }
        },
        {
            title: 'KHÔNG DUYỆT',
            key: 'status',
            render: (_, record) => {
                return user?.role < 3 ? (
                    <Button
                        danger
                        size="small"
                        onClick={() => unApproveRequest(record?.id)}>
                        Không duyệt
                    </Button>
                ) : null
            }
        },
        {
            title: 'THAO TÁC',
            render: (_, record) => {
                return user?.role < 3 && !record?.refund?.gift_type ? (
                    <>
                        <Button
                            block
                            type="danger"
                            size="small"
                            onClick={() => fallRequest(record?.id)}>
                            Hoàn lỗi
                        </Button>
                    </>
                ) : null
            }
        },
        {
            title: 'NGÀY TẠO',
            key: 'created_at',
            render: (text) => <Tag>{text}</Tag>
        }
    ]

    useEffect(() => {
        if (data?.code) {
            const number = packs?.find((i) => i?.code === data?.code)
            setData({ ...data, amount: number?.amount })
        }
    }, [data?.code])

    const fallRequest = (id) => {
        setLoading(true)
        Axios.post(`refund/fall-request/${id}`)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    message.success('Cập nhật thành công')
                    getData()
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const unApproveRequest = (id) => {
        setLoading(true)
        Axios.post(`refund/unapprove-request/${id}`)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    message.success('Cập nhật thành công')
                    getData()
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const approveRequest = (id) => {
        setLoading(true)
        updateUpgradeStatus({
            variables: {
                id,
                status: 1
            }
        })
            .then((res) => {
                if (res?.data?.updateUpgradeHistory?.id) {
                    message.open({
                        content: 'Cập nhật yêu cầu thành công',
                        type: 'success'
                    })

                    getData()
                } else {
                    message.open({
                        content: 'Cập nhật yêu cầu thất bại',
                        type: 'error'
                    })
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const updateRequest = (values) => {
        setLoading(true)
        updateUpgrade({
            variables: {
                ...selectedPack,
                ...values,
                register_channel: values?.register_channel?.toUpperCase()
            }
        })
            .then((res) => {
                if (res?.data?.updateUpgradeHistory?.id) {
                    message.open({
                        content: 'Cập nhật yêu cầu thành công',
                        type: 'success'
                    })

                    getData()
                } else {
                    message.open({
                        content: 'Cập nhật yêu cầu thất bại',
                        type: 'error'
                    })
                }
            })
            .finally(() => {
                setLoading(false)
                setIsModalOpen(false)
            })
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const exportExcel = () => {
        if (!filter?.from_date || !filter?.to_date) {
            message.error('Vui lòng chọn ngày xuất')
            return
        }
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Báo cáo nâng cấp.xlsx'

        Axios.post(
            'export/upgrades',
            {
                ...filter,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            },
            {
                responseType: 'blob'
            }
        )
            .then((res) => {
                link.href = URL.createObjectURL(new Blob([res.data]))
                link.click()
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getData = () => {
        setLoading(true)
        getAll({
            variables: {
                page,
                limit,
                status: filter?.status,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                const response = res?.data?.UpgradeHistoryList
                setListData(response?.data)
                setTotal(response?.total)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getData()
    }, [page, limit])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const syncOSP = () => {
        setLoading(true)
        Axios.get(
            `refund/sync-upgrade-osp/${localStorage.getItem(
                '@otpToken'
            )}/${localStorage.getItem('@branch_id')}`
        )
            .then((res) => {
                return res?.data
            })
            .then((data) => {
                if (data?.data) {
                    message.success(
                        'Đồng bộ thành công, đã đồng bộ ' +
                            parseInt(data?.count) +
                            ' số'
                    )
                } else {
                    message.error('Đồng bộ lỗi')
                }
            })
            .catch((err) => message.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const fileUpload = (file, channel) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            var workbook = XLSX.read(e.target.result)
            var first_ws = workbook.Sheets[workbook.SheetNames[0]]
            const data = XLSX.utils.sheet_to_json(first_ws, {
                raw: false,
                dateNF: 'MM/DD/YYYY',
                header: 0,
                defval: ''
            })

            let dateFlag = true
            const list = data?.map((i) => {
                let phone_number = Object.values(i)[0]
                const code = Object.values(i)[1]
                const created_at = Object.values(i)[2]

                if (!dayjs(created_at, 'MM/DD/YYYY').isValid()) {
                    dateFlag = false
                }

                phone_number =
                    phone_number?.substring(0, 2) === '84'
                        ? '0' + phone_number?.slice(2)
                        : phone_number

                return {
                    phone_number,
                    code,
                    created_at: dayjs(created_at, 'MM/DD/YYYY')
                        .local()
                        .format('YYYY-MM-DD')
                }
            })

            if (!dateFlag) {
                message.error(
                    'Định dạng ngày tháng năm không hợp lệ (tháng/ngày/năm)'
                )
                return
            }
            setLoading(true)
            uploadUpgradeFile({
                variables: {
                    list,
                    channel
                }
            })
                .then((res) => {
                    if (res?.data?.uploadUpgradeFile) {
                        const data = res?.data?.uploadUpgradeFile
                        message.success('Upload file thành công')

                        if (data?.length) {
                            setDuplicateDatas(data)
                            message.error(
                                'Số điện thoại không tìm thấy vui lòng kiểm tra lại'
                            )
                        } else {
                            setDuplicateDatas([])
                        }
                    }
                })
                .catch((err) => {
                    message.error('Upload file thất bại')
                })
                .finally(() => setLoading(false))
        }

        reader.readAsArrayBuffer(file)

        return false
    }

    const otpProps = {
        accept: '.csv, .xls, .xlsx',
        showUploadList: false,
        beforeUpload(file, fileList) {
            if (file) {
                fileUpload(file, 'OTP')
            } else if (file.status === 'error') {
                message.error(`${file.name} file upload failed.`)
            }
        }
    }

    const khProps = {
        accept: '.csv, .xls, .xlsx',
        showUploadList: false,
        beforeUpload(file, fileList) {
            if (file) {
                fileUpload(file, 'KH')
            } else if (file.status === 'error') {
                message.error(`${file.name} file upload failed.`)
            }
        }
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Từ ngày</Title>
                <DatePicker
                    size="small"
                    style={{
                        width: '100%'
                    }}
                    format="DD-MM-YYYY"
                    placeholder="Từ ngày"
                    value={filter?.from_date}
                    onChange={(date, dateString) => {
                        setFilter({
                            ...filter,
                            from_date: date
                        })
                    }}
                />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Đến ngày</Title>
                <DatePicker
                    size="small"
                    style={{
                        width: '100%'
                    }}
                    format="DD-MM-YYYY"
                    disabledDate={(current) =>
                        current.isBefore(filter?.from_date)
                    }
                    placeholder="Đến ngày"
                    value={filter?.to_date}
                    onChange={(date, dateString) => {
                        setFilter({
                            ...filter,
                            to_date: date
                        })
                    }}
                />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Select
                    size="small"
                    allowClear
                    style={{
                        width: '100%'
                    }}
                    onChange={(value) => {
                        setFilter({ ...filter, status: value })
                    }}
                    placeholder="Trạng thái"
                    options={[
                        { value: 0, label: 'Chưa duyệt' },
                        { value: 1, label: 'Đã duyệt' }
                    ]}
                />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Upload {...otpProps}>
                    <Button block size="small">
                        <DocumentUpload variant="Bulk" />
                        <span className="hp-ml-8">Tải lên file excel OTP</span>
                    </Button>
                </Upload>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Upload {...khProps}>
                    <Button block size="small">
                        <DocumentUpload variant="Bulk" />
                        <span className="hp-ml-8">Tải lên file excel KH</span>
                    </Button>
                </Upload>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Button type="primary" block onClick={exportExcel} size="small">
                    Tải Excel
                </Button>
            </Col>
            {user?.role < 3 && (
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Button block onClick={syncOSP} size="small">
                        <DocumentUpload variant="Bulk" />
                        <span className="hp-ml-8">Đồng bộ OSP 30 ngày</span>
                    </Button>
                </Col>
            )}
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Button type="primary" onClick={getData} size="small">
                    Tìm kiếm
                </Button>
            </Col>
        </Row>
    )

    return (
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                {/* <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Nâng cấp"
                            breadCrumbActive="Danh sách nâng cấp"
                        />

                        {user?.role < 2 && (
                            <Col span={24} md={12}>
                                <Row
                                    gutter={[16, 16]}
                                    justify="end"
                                    className="hp-ecommerce-app-inventory-events">
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={showModal}>
                                            <DocumentUpload
                                                color="#fff"
                                                variant="Bulk"
                                            />
                                            <span className="hp-ml-8">
                                                Gửi yêu cầu
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Col> */}
                {duplicateDatas?.length ? (
                    <Col span={24}>
                        <Alert
                            closable
                            message={
                                duplicateDatas?.length
                                    ? 'Số điện thoại không tìm thấy'
                                    : null
                            }
                            description={
                                <List
                                    grid={{
                                        gutter: 16,
                                        xs: 1,
                                        sm: 2,
                                        md: 4,
                                        lg: 4,
                                        xl: 6,
                                        xxl: 3
                                    }}
                                    dataSource={duplicateDatas}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Paragraph copyable>
                                                {item}
                                            </Paragraph>
                                        </List.Item>
                                    )}
                                />
                            }
                            type="error"
                            showIcon
                        />
                    </Col>
                ) : null}
                {/* <Col span={24}>
                    <h2>Danh sách nâng cấp</h2>
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
                        loading={loading}
                        title={() => filterHeader}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    if (user?.role < 3) {
                                        setSelectedPack(record)
                                        showModal()
                                    }
                                }
                            }
                        }}
                        footer={() => (
                            <Pagination
                                pageSize={limit}
                                showSizeChanger
                                onShowSizeChange={onShowSizeChange}
                                total={total}
                                onChange={onPageChange}
                            />
                        )}>
                        {columns?.map((i) => (
                            <Column {...i} dataIndex={i?.key} />
                        ))}
                    </Table>
                </Col>
            </Row>
            <Modal
                title={selectedPack ? 'Cập nhật nâng cấp' : 'Tạo nâng cấp'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}>
                <Spin size="large" spinning={modalLoading}>
                    <Form
                        form={form}
                        onFinish={selectedPack ? updateRequest : null}
                        layout="vertical"
                        initialValues={{ remember: true }}>
                        <Form.Item
                            label="Số thuê bao"
                            name="phone_number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone!'
                                }
                            ]}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Kênh nạp" name="channel">
                            <Select
                                disabled
                                allowClear
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Kênh nạp"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={CHANNELS}
                            />
                        </Form.Item>
                        <Form.Item label="Gói cước" name="code">
                            <Select
                                disabled
                                allowClear
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Gói cước"
                                optionFilterProp="children"
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
                        <Form.Item
                            label="Kênh đăng ký:"
                            name="register_channel">
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Hoàn dư :" name="res_amount">
                            <InputNumber
                                style={{ width: '100%' }}
                                {...currencyFormatter}
                            />
                        </Form.Item>
                        <Form.Item label="Hoàn lỗi :" name="err_amount">
                            <InputNumber
                                style={{ width: '100%' }}
                                {...currencyFormatter}
                            />
                        </Form.Item>
                        <Form.Item label="Tặng sim" name="gift_type">
                            <Select
                                allowClear
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Tặng sim"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={[
                                    { label: 'Tặng sim không gói', value: 1 },
                                    { label: 'Tặng sim kèm gói', value: 2 }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                {selectedPack
                                    ? 'Cập nhật nâng cấp'
                                    : 'Tạo nâng cấp'}
                            </Button>
                        </Form.Item>
                        {user?.role < 2 && (
                            <Form.Item>
                                <Button
                                    block
                                    type="danger"
                                    onClick={() => {
                                        deleteUpgrade({
                                            variables: {
                                                id: selectedPack?.id
                                            }
                                        }).then((res) => {
                                            if (
                                                res?.data?.deleteUpgradeHistory
                                            ) {
                                                const newData =
                                                    listData?.filter(
                                                        (i) =>
                                                            i?.id !==
                                                            selectedPack?.id
                                                    )
                                                setListData(newData)
                                                message.open({
                                                    content: 'Xóa thành công',
                                                    type: 'success'
                                                })
                                                setIsModalOpen(false)
                                            }
                                        })
                                    }}>
                                    Xóa
                                </Button>
                            </Form.Item>
                        )}
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}
