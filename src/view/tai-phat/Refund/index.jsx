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
    InputNumber,
    Popconfirm,
    DatePicker
} from 'antd'
import { DocumentUpload, DocumentDownload } from 'iconsax-react'
import Axios from '@/Axios'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery } from '@apollo/client'
import {
    REFUND_HISTORIES,
    REFUND_STATUS,
    CHANNELS,
    toCurrency,
    colors,
    currencyFormatter
} from '@/constants'
import { SyncOutlined } from '@ant-design/icons'
import { getUserInfo } from 'helpers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import FilterItem from 'layout/components/FilterItem'
dayjs.extend(utc)

const { Column } = Table

const user = getUserInfo()

export default function Inventory({}) {
    const [filter, setFilter] = useState({})
    const [packs, setPacks] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalDiscountOpen, setIsModalDiscountOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [data, setData] = useState({ channel: 1, simtype: 0 })
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [listData, setListData] = useState()
    const [getAll] = useLazyQuery(REFUND_HISTORIES)
    const [loading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState()
    const [balanceLoading, setBalanceLoading] = useState(false)
    const [totalData, setTotalData] = useState()
    const [users, setUsers] = useState([])

    useEffect(() => {
        setLoading(true)
        Axios.get('users')
            .then((res) => {
                setUsers(res?.data)
            })
            .finally(() => setLoading(false))
    }, [])

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
            title: 'SĐT',
            key: 'phone_number',
            sorter: (a, b) => a.phone_number - b.phone_number,
            sortDirections: ['descend'],
            render: (text, record) => (
                <span style={{ color: record?.is_duplicate ? 'red' : 'black' }}>
                    {text}
                </span>
            )
        },
        {
            title: 'TIỀN HOÀN',
            key: 'amount',
            render: (_, record) => toCurrency(record?.amount || 0)
        },
        {
            title: 'THỰC HOÀN',
            key: 'amount_tran',
            render: (_, record) =>
                record?.amount_tran ? (
                    toCurrency(record?.amount_tran)
                ) : record?.id_tran && record?.refcode ? (
                    <Button
                        onClick={() =>
                            refreshTicket(record?.id_tran, record?.refcode)
                        }
                        shape="circle"
                        icon={
                            <SyncOutlined
                                spin={loading}
                                style={{ fontWeight: 'bold' }}
                            />
                        }
                    />
                ) : null
        },

        user?.role < 3
            ? {
                  title: 'CHIẾT KHẤU',
                  key: 'amount_discount',
                  render: (_, record) =>
                      record?.channel === 1 && record?.amount_discount
                          ? toCurrency(record?.amount_discount || 0)
                          : null,
                  onCell: (record, rowIndex) => {
                      return {
                          onClick: (ev) => {
                              setData(record)
                              setIsModalDiscountOpen(true)
                          }
                      }
                  }
              }
            : null,
        user?.role < 3
            ? {
                  title: '%',
                  render: (_, record) =>
                      record?.channel === 1 &&
                      record?.amount_discount &&
                      record?.amount_tran
                          ? (
                                (1 -
                                    record?.amount_discount /
                                        record?.amount_tran) *
                                100
                            ).toFixed(1) + '%'
                          : null
              }
            : null,
        {
            title: '',
            key: 'is_exist',
            render: (text, record) => (
                <span style={{ color: text ? 'green' : 'red' }}>
                    {text ? 'Có' : 'Không'}
                </span>
            )
        },
        {
            title: 'TRẠNG THÁI',
            key: 'status',
            render: (_, record) => {
                if (record?.status !== null) {
                    const index = REFUND_STATUS.findIndex(
                        (item) => item.value === record?.status
                    )

                    return (
                        <Tag color={colors[index]}>
                            {REFUND_STATUS[index]?.label}
                        </Tag>
                    )
                } else {
                    return user?.role < 3 ? (
                        <>
                            <Button
                                style={{ marginRight: 5 }}
                                type="primary"
                                size="small"
                                onClick={() => approveRequest(record?.id)}>
                                Duyệt
                            </Button>
                            <Button
                                danger
                                size="small"
                                onClick={() => deleteRequest(record?.id)}>
                                Không duyệt
                            </Button>
                        </>
                    ) : (
                        'Chờ duyệt'
                    )
                }
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
            key: ['channel'],
            render(text, record) {
                return <Tag>{text === 1 ? 'Mặc định' : 'EZ'}</Tag>
            }
        },
        {
            title: 'KÊNH ĐĂNG KÝ',
            key: ['register_channel']
        },
        {
            title: 'NGÀY TẠO',
            key: 'created_at',
            render: (text) => <Tag>{text}</Tag>
        },
        {
            title: 'TẶNG SIM',
            key: 'gift_type',
            render: (text, record) =>
                text === 1 ? (
                    <Tag>Sim không gói</Tag>
                ) : text === 2 ? (
                    <Tag>Sim có gói</Tag>
                ) : null
        },
        {
            title: 'ACCOUNT',
            key: ['refundAccount', 'username']
        }
    ]

    useEffect(() => {
        if (data?.code) {
            const number = packs?.find((i) => i?.code === data?.code)
            setData({ ...data, amount: number?.amount })
        }
    }, [data?.code])

    const approveRequest = (id) => {
        setLoading(true)
        Axios.post(`refund/approve`, { id })
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    message.success(data?.message || 'Cập nhật thành công')
                    const tmpData = [...listData]
                    const index = tmpData.findIndex((item) => item?.id === id)
                    tmpData[index].status = parseInt(data?.status)
                    setListData(tmpData)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const deleteRequest = (id) => {
        setLoading(true)
        Axios.delete(`refund/delete/${id}`)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    message.success('Cập nhật thành công')
                    const tmpData = listData?.filter((i) => i?.id !== id)
                    setListData(tmpData)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const refreshTicket = (id_tran, refcode) => {
        setLoading(true)
        Axios.post(`refund/refresh`, { id_tran, refcode })
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    message.success(data?.message || '')
                    const tmpData = [...listData]
                    const index = tmpData.findIndex(
                        (item) => item?.id_tran === id_tran
                    )
                    tmpData[index].amount_tran = data?.amoutran
                    tmpData[index].status = parseInt(data?.status)
                    setListData(tmpData)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getBalance = () => {
        setBalanceLoading(true)
        Axios.get('refund/balance')
            .then((res) => {
                setAccounts(res?.data?.accounts)
            })
            .finally(() => {
                setBalanceLoading(false)
            })
    }

    useEffect(() => {
        Axios.get('all-code').then((res) => {
            localStorage.setItem('@packs', JSON.stringify(res?.data))
            setPacks(res?.data)
        })
    }, [])

    useEffect(() => {
        getBalance()
    }, [])

    const getTotalAmount = () => {
        Axios.post('refund/total-amount').then((res) => {
            setTotalData(res?.data)
        })
    }

    useEffect(() => {
        getTotalAmount()
    }, [])

    const showModal = () => {
        setIsModalOpen(true)
    }

    const getData = () => {
        setLoading(true)
        getAll({
            variables: {
                ...filter,
                page,
                limit,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                const response = res?.data?.RefundHistoryList
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

    const editDiscountAmount = () => {
        const params = {
            ...data
        }

        Axios.post('refund/update', params)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    getData()
                    message.success(data?.message || 'Thành công')
                }
            })
            .finally(() => {
                setIsModalDiscountOpen(false)
            })
    }

    const createRefund = () => {
        if (!data?.code) {
            message.error('Vui lòng chọn gói cước')
            return
        } else if (data?.channel === 1 && data?.gift_type) {
            message.error('Không thể tặng sim cho kênh mặc định')
            return
        } else if (parseInt(data?.amount) < 150000 && data?.gift_type === 2) {
            message.error(
                'Không thể tặng sim có gói cho hoàn tiền dưới 150,000'
            )
            return
        } else if (
            parseInt(data?.amount) < 50000 &&
            parseInt(data?.gift_type) === 1
        ) {
            message.error(
                'Không thể tặng sim không gói cho hoàn tiền dưới 50,000'
            )
            return
        } else if (!data?.phone?.match(/^0\d{8,9}$/)) {
            message.error('Số điện thoại không hợp lệ')
            return
        }

        setModalLoading(true)
        const params = {
            ...data
        }

        Axios.post('refund/create', params)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    setListData([
                        { ...data, user: { name: user?.name } },
                        ...listData
                    ])
                    message.success(
                        data?.message || 'Tạo yêu cầu hoàn tiền thành công'
                    )
                }
            })
            .finally(() => {
                setIsModalOpen(false)
                setModalLoading(false)
            })
    }

    const onChange = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        setData({ ...data, [name]: value })
    }

    const exportExcel = () => {
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Lịch sử hoàn tiền.xlsx'

        Axios.post('export/refund_history', filter, {
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
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Hoàn tiền"
                            breadCrumbActive={
                                <>
                                    Danh sách hoàn tiền
                                    <Button
                                        type="primary"
                                        onClick={getBalance}
                                        shape="circle"
                                        size="small"
                                        style={{ marginLeft: 10 }}
                                        icon={
                                            <SyncOutlined
                                                spin={balanceLoading}
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        }
                                    />
                                </>
                            }
                        />

                        <Col span={24} md={12}>
                            <Row
                                gutter={[16, 16]}
                                justify="end"
                                className="hp-ecommerce-app-inventory-events">
                                <Col>
                                    <Button onClick={exportExcel} size="small">
                                        <DocumentDownload variant="Bulk" />
                                        <span className="hp-ml-8">
                                            Tải Excel
                                        </span>
                                    </Button>
                                </Col>
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
                                            Tạo hoàn tiền
                                        </span>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        shape="circle"
                                        size="small"
                                        icon={
                                            <SyncOutlined
                                                spin={loading}
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    {/* <h2>Danh sách hoàn tiền </h2> */}
                    {accounts?.map((i) => (
                        <h5>
                            {i?.username}: <Tag>{toCurrency(i?.amount)}</Tag>
                        </h5>
                    ))}
                </Col>

                <Col span={24}>
                    <Table
                        size="small"
                        dataSource={listData}
                        scroll={{ x: '100%' }}
                        pagination={false}
                        loading={loading}
                        title={() => (
                            <>
                                {user?.role < 2 ? (
                                    <>
                                        <h5>
                                            Tổng tiền hoàn :{' '}
                                            <Tag>
                                                {toCurrency(
                                                    totalData?.amount || 0
                                                )}
                                            </Tag>
                                        </h5>
                                        <h5>
                                            Tổng thực hoàn :{' '}
                                            <Tag>
                                                {toCurrency(
                                                    totalData?.amount_tran || 0
                                                )}
                                            </Tag>
                                        </h5>
                                    </>
                                ) : null}
                                <Row gutter={[8, 8]}>
                                    <FilterItem title="Từ ngày">
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
                                    </FilterItem>

                                    <FilterItem title="Đến ngày">
                                        <DatePicker
                                            size="small"
                                            style={{
                                                width: '100%'
                                            }}
                                            format="DD-MM-YYYY"
                                            disabledDate={(current) =>
                                                current.isBefore(
                                                    filter?.from_date
                                                )
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
                                    </FilterItem>
                                    <FilterItem title="Nhân viên">
                                        <Select
                                            size="small"
                                            allowClear
                                            showSearch
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="Nhân viên"
                                            optionFilterProp="children"
                                            onChange={(value) => {
                                                setFilter({
                                                    ...filter,
                                                    user_id: value
                                                })
                                            }}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '')
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase()
                                                    )
                                            }
                                            options={users?.map((d) => ({
                                                value: d.id,
                                                label: d.name
                                            }))}
                                        />
                                    </FilterItem>
                                    <FilterItem title="SĐT">
                                        <Input
                                            allowClear
                                            size="small"
                                            style={{
                                                width: '100%'
                                            }}
                                            placeholder="SĐT"
                                            value={filter?.phone_number}
                                            onChange={(e) => {
                                                setFilter({
                                                    ...filter,
                                                    phone_number: e.target.value
                                                })
                                            }}
                                        />
                                    </FilterItem>
                                    <FilterItem title="Có/Không">
                                        <Select
                                            size="small"
                                            allowClear
                                            style={{
                                                width: '100%'
                                            }}
                                            optionFilterProp="children"
                                            onChange={(value) => {
                                                setFilter({
                                                    ...filter,
                                                    is_exist: value
                                                })
                                            }}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '')
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase()
                                                    )
                                            }
                                            options={[
                                                {
                                                    value: 1,
                                                    label: 'Có'
                                                },
                                                {
                                                    value: 0,
                                                    label: 'Không'
                                                }
                                            ]}
                                        />
                                    </FilterItem>
                                    <FilterItem>
                                        <Button
                                            type="primary"
                                            onClick={getData}
                                            size="small">
                                            Tìm kiếm
                                        </Button>
                                    </FilterItem>
                                </Row>
                            </>
                        )}
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
                title="Tạo yêu cầu hoàn tiền"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={
                    <Popconfirm
                        title="Xác nhận thao tác"
                        onConfirm={createRefund}>
                        <Button type="primary" loading={modalLoading}>
                            Hoàn tiền
                        </Button>
                    </Popconfirm>
                }>
                <Spin size="large" spinning={modalLoading}>
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
                        <Form.Item label="Loại thuê bao">
                            <Select
                                allowClear
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Loại thuê bao"
                                optionFilterProp="children"
                                value={data?.simtype}
                                onChange={(value) =>
                                    setData({ ...data, simtype: value })
                                }
                                options={[
                                    { label: 'Thuê bao trả trước', value: 0 },
                                    { label: 'Thuê bao trả sau', value: 1 }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="Kênh nạp">
                            <Select
                                allowClear
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Kênh nạp"
                                optionFilterProp="children"
                                value={data?.channel}
                                onChange={(value) =>
                                    setData({ ...data, channel: value })
                                }
                                options={CHANNELS}
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
                        <Form.Item label="Số tiền hoàn">
                            <InputNumber
                                style={{
                                    width: '100%'
                                }}
                                value={data.amount}
                                name="amount"
                                {...currencyFormatter}
                                allowClear
                                onChange={(number) =>
                                    setData({ ...data, amount: number })
                                }
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
                                onChange={(value) => {
                                    setData({ ...data, gift_type: value })
                                }}
                                options={[
                                    { label: 'Tặng sim không gói', value: 1 },
                                    { label: 'Tặng sim kèm gói', value: 2 }
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
            <Modal
                title="Sửa chiết khấu"
                open={isModalDiscountOpen}
                onCancel={() => setIsModalDiscountOpen(false)}
                footer={
                    <Popconfirm
                        title="Xác nhận thao tác"
                        onConfirm={editDiscountAmount}>
                        <Button type="primary">Sửa chiết khấu</Button>
                    </Popconfirm>
                }>
                <Spin size="large" spinning={modalLoading}>
                    <Form
                        layout="vertical"
                        name="basic"
                        initialValues={{ remember: true }}>
                        <Form.Item label="Chiết khấu">
                            <InputNumber
                                value={data?.discount}
                                name="discount"
                                onChange={(number) =>
                                    setData({
                                        ...data,
                                        discount: number,
                                        amount_discount:
                                            data?.amount_tran -
                                            (data?.amount_tran * number) / 100
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Số tiền hoàn">
                            <InputNumber
                                style={{
                                    width: '100%'
                                }}
                                readOnly
                                value={data.amount_tran}
                                name="amount_tran"
                                {...currencyFormatter}
                            />
                        </Form.Item>
                        <Form.Item label="Số tiền chiết khấu">
                            <InputNumber
                                style={{
                                    width: '100%'
                                }}
                                readOnly
                                value={data.amount_discount}
                                name="amount_discount"
                                {...currencyFormatter}
                                // onChange={(number) =>
                                //     setData({
                                //         ...data,
                                //         discount_amount: number
                                //     })
                                // }
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}
