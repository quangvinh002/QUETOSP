import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Typography, DatePicker, Tag, Select } from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import Axios from '@/Axios'
import { formatDate, toCurrency } from 'helpers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { REPORT_TYPE } from '@/constants'

dayjs.extend(utc)

const { Title } = Typography
const branches = JSON.parse(localStorage.getItem('@branches'))

const hasDuplicated = (list) => {
    const duplicatedDelete = list.filter(
        (fruit, index) =>
            list.findIndex(
                (item) =>
                    item.display_name === fruit.display_name &&
                    item.date === fruit.date
            ) === index
    )
    return duplicatedDelete
}

const hasBranchDuplicated = (list) => {
    const duplicatedDelete = list.filter(
        (fruit, index) =>
            list.findIndex(
                (item) => item.display_name === fruit.display_name
            ) === index
    )
    return duplicatedDelete
}

export default function Inventory({}) {
    const [sumData, setSumData] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [reportType, setReportType] = useState('detail')

    const columns = [
        {
            title: 'STT',
            width: '70px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'NGÀY',
            width: '120px',
            key: 'date',
            render: (text, record) => (
                <span>{formatDate(record?.date, false)}</span>
            )
        },
        {
            title: 'CHI NHÁNH',
            width: '120px',
            render: (text, record) => <span>{record?.display_name}</span>
        },
        {
            title: 'TỔNG GÓI',
            render: (text, record) => {
                const records6C90N = sumData?.filter(
                    (i) =>
                        i?.date === record?.date &&
                        i?.display_name === record?.display_name
                )

                const total6C90N = records6C90N?.reduce(
                    (total, item) => total + parseInt(item?.total),
                    0
                )

                return total6C90N
            }
        },
        {
            title: 'TỔNG TIỀN',
            render: (text, record) => {
                const records6C90N = sumData?.filter(
                    (i) =>
                        i?.date === record?.date &&
                        i?.display_name === record?.display_name
                )

                const total6C90N = records6C90N?.reduce(
                    (total, item) => total + parseInt(item?.revenue),
                    0
                )

                return toCurrency(total6C90N)
            }
        },
        {
            title: '6C90N',
            children: [
                {
                    title: 'NÂNG CẤP',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.date === record?.date &&
                                i?.display_name === record?.display_name &&
                                i?.type === 1 &&
                                i?.pack_code === '6C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                },
                {
                    title: 'GIA HẠN',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.date === record?.date &&
                                i?.display_name === record?.display_name &&
                                i?.type === 2 &&
                                i?.pack_code === '6C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                }
            ]
        },
        {
            title: '12C90N',
            children: [
                {
                    title: 'NÂNG CẤP',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.date === record?.date &&
                                i?.display_name === record?.display_name &&
                                i?.type === 1 &&
                                i?.pack_code === '12C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                },
                {
                    title: 'GIA HẠN',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.date === record?.date &&
                                i?.display_name === record?.display_name &&
                                i?.type === 2 &&
                                i?.pack_code === '12C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                }
            ]
        }
    ]

    const columnTotals = [
        {
            title: 'STT',
            width: '70px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'CHI NHÁNH',
            width: '120px',
            render: (text, record) => <span>{record?.display_name}</span>
        },
        {
            title: 'TỔNG GÓI',
            render: (text, record) => {
                const records6C90N = sumData?.filter(
                    (i) => i?.display_name === record?.display_name
                )

                const total6C90N = records6C90N?.reduce(
                    (total, item) => total + parseInt(item?.total),
                    0
                )

                return total6C90N
            }
        },
        {
            title: 'TỔNG TIỀN',
            render: (text, record) => {
                const records6C90N = sumData?.filter(
                    (i) => i?.display_name === record?.display_name
                )

                const total6C90N = records6C90N?.reduce(
                    (total, item) => total + parseInt(item?.revenue),
                    0
                )

                return toCurrency(total6C90N)
            }
        },
        {
            title: '6C90N',
            children: [
                {
                    title: 'NÂNG CẤP',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.display_name === record?.display_name &&
                                i?.type === 1 &&
                                i?.pack_code === '6C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                },
                {
                    title: 'GIA HẠN',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.display_name === record?.display_name &&
                                i?.type === 2 &&
                                i?.pack_code === '6C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                }
            ]
        },
        {
            title: '12C90N',
            children: [
                {
                    title: 'NÂNG CẤP',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.display_name === record?.display_name &&
                                i?.type === 1 &&
                                i?.pack_code === '12C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                },
                {
                    title: 'GIA HẠN',
                    width: '120px',
                    render: (text, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.display_name === record?.display_name &&
                                i?.type === 2 &&
                                i?.pack_code === '12C90N'
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                }
            ]
        }
    ]

    useEffect(() => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('pack-request/report-revenue', {
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

    const filterHeader = (
        <Row gutter={[8, 8]}>
            {/* <Col span={6}>
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
                            options={PACK_CODES}
                        />
                    </Col> */}
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
                        setFilter({ ...filter, branch_id: value })
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
                <Title level={5}>Loại báo cáo</Title>
                <Select
                    allowClear
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    placeholder="Loại báo cáo"
                    optionFilterProp="children"
                    onChange={(value) => {
                        setReportType(value)
                    }}
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    value={reportType}
                    options={REPORT_TYPE}
                />
            </Col>
        </Row>
    )

    const uniqueData = hasDuplicated(sumData)
    const uniqueTotalData = hasBranchDuplicated(sumData)
    const sumOf6CNC = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '6C90N' && cur?.type === 1
                ? acc + parseInt(cur?.total || 0)
                : acc,
        0
    )
    const sumOf6CGH = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '6C90N' && cur?.type === 2
                ? acc + parseInt(cur?.total || 0)
                : acc,
        0
    )
    const sumOf12CNC = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '12C90N' && cur?.type === 1
                ? acc + parseInt(cur?.total || 0)
                : acc,
        0
    )
    const sumOf12CGH = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '12C90N' && cur?.type === 2
                ? acc + parseInt(cur?.total || 0)
                : acc,
        0
    )
    const sumOfAmount = sumData?.reduce((acc, cur) => acc + cur?.total, 0)
    const sumOfRevenue = sumData?.reduce((acc, cur) => acc + cur?.revenue, 0)

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Chuyển code"
                            breadCrumbActive="Báo cáo doanh thu chi nhánh"
                        />
                    </Row>
                </Col>

                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        dataSource={
                            reportType === 'detail'
                                ? uniqueData || []
                                : uniqueTotalData || []
                        }
                        columns={
                            reportType === 'detail' ? columns : columnTotals
                        }
                        pagination={false}
                        loading={loading}
                        title={() => filterHeader}
                        scroll={{
                            x: 'calc(700px + 50%)',
                            y: 500
                        }}
                        summary={() => (
                            <Table.Summary fixed="top">
                                <Table.Summary.Row>
                                    <Table.Summary.Cell
                                        index={0}
                                        colSpan={
                                            reportType === 'detail' ? 3 : 2
                                        }></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {sumOfAmount}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(sumOfRevenue)}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {sumOf6CNC}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {sumOf6CGH}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {sumOf12CNC}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {sumOf12CGH}
                                        </span>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                </Col>
            </Row>
        </>
    )
}
