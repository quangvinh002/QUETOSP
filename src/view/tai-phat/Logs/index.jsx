import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    Form,
    Modal,
    Spin,
    Typography,
    Pagination,
    message,
    Tag,
    Select,
    Table,
    InputNumber,
    DatePicker
} from 'antd'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery } from '@apollo/client'
import { LOGS, REFUND_STATUS, toCurrency, colors } from '@/constants'
import { SyncOutlined } from '@ant-design/icons'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { Title } = Typography
const { Column } = Table

export default function Inventory({ history }) {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [listData, setListData] = useState()
    const [getAll] = useLazyQuery(LOGS)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user', 'name']
        },
        {
            title: 'NỘI DUNG',
            key: ['logType', 'description'],
            render: (text, record) => {
                const params = record?.params?.split(',')
                let paramsText = text
                if (params?.length) {
                    params.forEach((i, index) => {
                        paramsText = paramsText?.replace('${' + index + '}', i)
                    })
                }
                return <span>{paramsText}</span>
            }
        },
        {
            title: 'NGÀY TẠO',
            key: 'created_at',
            render: (text) => <Tag>{text}</Tag>
        }
    ]

    useEffect(() => {
        setLoading(true)
        Axios.get('users')
            .then((res) => {
                setUsers(res?.data)
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
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
                const response = res?.data?.Logs
                setListData(response?.data)
                setTotal(response?.total)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [page, limit, filter])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    return (
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Logs"
                            breadCrumbActive="Báo cáo tra cứu"
                        />
                    </Row>
                </Col>

                <Col span={24}>
                    <Row gutter={[8, 8]}>
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
                                disabledDate={(current) =>
                                    current.isBefore(filter?.from_date)
                                }
                                format="DD-MM-YYYY"
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
                    </Row>
                </Col>

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
