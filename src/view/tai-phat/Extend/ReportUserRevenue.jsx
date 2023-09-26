import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Typography, DatePicker, Button, Select } from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import Axios from '@/Axios'
import { toCurrency, getUserInfo, formatDate } from 'helpers'
import { REPORT_TYPE } from '@/constants'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const { Title } = Typography

const { Column } = Table
const branches = JSON.parse(localStorage.getItem('@branches'))
const userInfo = getUserInfo()
const extendPacks = JSON.parse(localStorage.getItem('@extendPacks'))

export default function Inventory({}) {
    const [sumData, setSumData] = useState([])
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)

    const columnDetails = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'NHÂN VIÊN',
            key: 'name'
        },
        {
            title: 'TỔNG TIỀN',
            key: 'revenue',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a?.revenue - b?.revenue,
            render: (text, record) => <span>{toCurrency(text)}</span>
        },
        userInfo?.role < 3 && {
            title: 'DOANH THU THẬT',
            key: 'pack_revenue',
            render: (text, record) => <span>{toCurrency(text)}</span>
        },
        {
            title: 'SĐT',
            key: 'phone_number'
        },
        {
            title: 'CODE',
            key: 'pack_code',
            sorter: (a, b) => a.pack_code - b.pack_code,
            sortDirections: ['descend']
        },
        {
            title: 'CHI NHÁNH',
            key: 'display_name'
        },
        {
            title: 'NGÀY',
            key: 'created_at',
            render: (text) => formatDate(text, false)
        }
    ]

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'NHÂN VIÊN',
            key: 'name'
        },
        {
            title: 'TỔNG TIỀN',
            key: 'revenue',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a?.revenue - b?.revenue,
            render: (text, record) => <span>{toCurrency(text)}</span>
        },
        userInfo?.role < 3 && {
            title: 'DOANH THU THẬT',
            key: 'pack_revenue',
            render: (text, record) => (
                <span>{toCurrency(text * record?.total)}</span>
            )
        },
        {
            title: 'CODE',
            key: 'pack_code',
            sorter: (a, b) => a.pack_code - b.pack_code,
            sortDirections: ['descend']
        },
        {
            title: 'CHI NHÁNH',
            key: 'display_name'
        },
        {
            title: 'SỐ LƯỢNG',
            key: 'total'
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
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('extend-pack/report-user-revenue', {
                ...filter,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            })
                .then((res) => {
                    setSumData(res?.data?.data)
                })
                .finally(() => setLoading(false))
        } else {
            setSumData([])
        }
    }, [filter])

    const exportExcel = () => {
        if (!filter?.from_date || !filter?.to_date) {
            message.error('Vui lòng chọn ngày xuất')
            return
        }
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Báo cáo gia hạn.xlsx'

        Axios.post(
            'export/extend-report',
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

    const filterHeader = (
        <Row gutter={[8, 8]}>
            {userInfo?.role < 3 ? (
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
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Mã gói</Title>
                <Select
                    allowClear
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    placeholder="Mã gói"
                    optionFilterProp="children"
                    onChange={(value) => {
                        setFilter({ ...filter, pack_code: value })
                    }}
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    options={(extendPacks || []).map((d) => ({
                        value: d?.code,
                        label: d?.code
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

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Loại báo cáo</Title>
                <Select
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    placeholder="Loại báo cáo"
                    optionFilterProp="children"
                    onChange={(value) => {
                        setFilter({
                            ...filter,
                            report_type: value
                        })
                    }}
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    value={filter?.report_type}
                    options={REPORT_TYPE}
                />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <Button type="primary" block onClick={exportExcel}>
                    Tải Excel
                </Button>
            </Col>
        </Row>
    )

    const sumOfAmount = sumData?.reduce((acc, cur) => acc + cur?.total, 0)
    const sumOfRevenue = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.revenue),
        0
    )
    const sumOfPackRevenue =
        filter?.report_type === 'detail'
            ? sumData?.reduce(
                  (acc, cur) => acc + parseInt(cur?.pack_revenue),
                  0
              )
            : sumData?.reduce(
                  (acc, cur) => acc + parseInt(cur?.pack_revenue) * cur?.total,
                  0
              )

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Gia hạn"
                            breadCrumbActive="Báo cáo doanh thu nhân viên"
                        />
                    </Row>
                </Col>

                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        dataSource={sumData}
                        pagination={false}
                        loading={loading}
                        title={() => filterHeader}
                        scroll={{ y: 500, x: '100%' }}
                        summary={() => (
                            <Table.Summary fixed="top">
                                <Table.Summary.Row>
                                    <Table.Summary.Cell
                                        index={0}
                                        colSpan={2}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(sumOfRevenue)}
                                        </span>
                                    </Table.Summary.Cell>
                                    {userInfo?.role < 3 && (
                                        <Table.Summary.Cell index={4}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 500
                                                }}>
                                                {toCurrency(sumOfPackRevenue)}
                                            </span>
                                        </Table.Summary.Cell>
                                    )}
                                    <Table.Summary.Cell
                                        index={3}
                                        colSpan={3}></Table.Summary.Cell>
                                    {filter?.report_type !== 'detail' && (
                                        <Table.Summary.Cell index={1}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 500
                                                }}>
                                                {sumOfAmount}
                                            </span>
                                        </Table.Summary.Cell>
                                    )}
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}>
                        {filter?.report_type === 'detail'
                            ? columnDetails?.map((i) => (
                                  <Column {...i} dataIndex={i?.key} />
                              ))
                            : columns?.map((i) => (
                                  <Column {...i} dataIndex={i?.key} />
                              ))}
                    </Table>
                </Col>
            </Row>
        </>
    )
}
