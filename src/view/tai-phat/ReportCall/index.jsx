import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Form,
    Pagination,
    message,
    Tag,
    Table,
    Typography,
    DatePicker,
    Select
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    CALL_HISTORIES,
    UPDATE_UPGRADE_HISTORY,
    UPDATE_UPGRADE_HISTORY_STATUS,
    toCurrency
} from '@/constants'
import { getUserInfo, formatDate } from 'helpers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Axios from '@/Axios'

dayjs.extend(utc)
const { Column } = Table
const { Title } = Typography
const packs = JSON.parse(localStorage.getItem('@packs'))
const user = getUserInfo()
const branches = JSON.parse(localStorage.getItem('@branches'))

export default function Inventory({}) {
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [users, setUsers] = useState([])
    const [selectedPack, setSelectedPack] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [data, setData] = useState({ channel: 1, simtype: 0 })
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [listData, setListData] = useState()
    const [getAll] = useLazyQuery(CALL_HISTORIES)
    const [updateUpgrade] = useMutation(UPDATE_UPGRADE_HISTORY)
    const [updateUpgradeStatus] = useMutation(UPDATE_UPGRADE_HISTORY_STATUS)
    const [loading, setLoading] = useState(false)
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

    function toHoursAndMinutes(totalSeconds) {
        const totalMinutes = Math.floor(totalSeconds / 60)

        const seconds = totalSeconds % 60
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        return hours + ':' + minutes + ':' + seconds
    }

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'NGÀY GỌI',
            key: 'created_at',
            render: (text) => <Tag>{formatDate(text)}</Tag>
        },
        {
            title: 'LINE',
            key: ['accountcode']
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user_name'],
            render: (text) => (text ? <Tag>{text}</Tag> : null)
        },
        {
            title: 'CN',
            key: ['branch_name'],
            render: (text) => (text ? <Tag>{text}</Tag> : null)
        },
        {
            title: 'TỔNG SỐ CUỘC GỌI',
            key: ['count']
        },
        {
            title: 'TỔNG THỜI GIAN',
            key: ['totalDuration'],
            render: (text, record) =>
                toHoursAndMinutes(text - record?.totalWaitingTime)
        },
        {
            title: 'GỌI NHỠ',
            key: ['totalWaitingTime']
        }
    ]

    useEffect(() => {
        if (data?.code) {
            const number = packs?.find((i) => i?.code === data?.code)
            setData({ ...data, amount: number?.amount })
        }
    }, [data?.code])

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
                const response = res?.data?.CallHistoryList
                setListData(response)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        Axios.get('users')
            .then((res) => {
                setUsers(res?.data)
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        getData()
    }, [page, limit, filter])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Từ ngày</Title>
                <DatePicker
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
            {user?.role < 3 ? (
                <>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Title level={5}>Chi nhánh</Title>
                        <Select
                            allowClear
                            showSearch
                            style={{
                                width: '100%'
                            }}
                            placeholder="Chi nhánh"
                            optionFilterProp="children"
                            onChange={(value) => {
                                setFilter({
                                    ...filter,
                                    branch_id: value
                                })
                            }}
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={branches?.map((d) => ({
                                value: d.id,
                                label: d?.display_name || d?.name
                            }))}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Title level={5}>Nhân viên</Title>
                        <Select
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
                                    .includes(input.toLowerCase())
                            }
                            options={users?.map((d) => ({
                                value: d.id,
                                label: d.name
                            }))}
                        />
                    </Col>
                </>
            ) : null}
        </Row>
    )

    return (
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                {/* <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Báo cáo"
                            breadCrumbActive="Báo cáo cuộc gọi"
                        />
                    </Row>
                </Col>

                <Col span={24}>
                    <h2>Báo cáo cuộc gọi</h2>
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
        </>
    )
}
