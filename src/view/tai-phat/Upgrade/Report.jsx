import React, { useEffect, useState } from 'react'
import { Row, Col, Table, DatePicker, Button, Select, Tag } from 'antd'
import FilterItem from '@/layout/components/FilterItem'
import Axios from '@/Axios'
import { toCurrency, getUserInfo, formatDate } from 'helpers'
import dayjs from 'dayjs'
import { REGISTER_CHANNELS, REPORT_TYPE } from '@/constants'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { Column } = Table
const branches = JSON.parse(localStorage.getItem('@branches'))
const userInfo = getUserInfo()

const hasDuplicated = (list) => {
    const duplicatedDelete = list.filter(
        (fruit, index) =>
            list.findIndex((item) => item?.user_id === fruit?.user_id) === index
    )
    return duplicatedDelete
}

export default function Inventory({}) {
    const [sumData, setSumData] = useState([])
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [reportType, setReportType] = useState('detail')

    const columns = [
        {
            title: '',
            width: '50px',
            render: (item, record, index) => (
                <span style={{ fontSize: 11 }}>{index + 1}</span>
            )
        },
        {
            title: 'NGÀY',
            width: '110px',
            key: 'created_at',
            render: (text) => (
                <span style={{ fontSize: 12 }}>{formatDate(text, false)}</span>
            )
        },
        {
            title: 'NHÂN VIÊN',
            width: '150px',
            key: ['user', 'name'],
            render: (text) => <span style={{ fontSize: 12 }}>{text}</span>
        },
        {
            title: 'DOANH THU',
            width: '150px',
            sortOrder: 'descend',
            sorter: (a, b) => a?.revenue - b?.revenue,
            render: (text, record) => (
                <span>
                    {toCurrency(
                        record?.err_amount
                            ? 0
                            : parseInt(record?.revenue || 0) -
                                  parseInt(
                                      record?.amount >= record?.standard_amount
                                          ? record?.standard_amount
                                          : record?.amount
                                  )
                    )}
                </span>
            )
        },
        userInfo?.role < 3 && {
            title: 'DOANH THU THẬT',
            width: '150px',
            render: (text, record) => (
                <span>{toCurrency(record?.real_revenue)}</span>
            )
        },
        {
            title: 'HOÀN DƯ',
            width: '130px',
            render: (_, record) => {
                const resAmount = parseInt(record?.res_amount)
                return (
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
                )
            }
        },
        {
            title: 'HOÀN LỖI',
            width: '130px',
            render: (_, record) =>
                record?.err_amount ? (
                    <Tag color="#cd201f">{toCurrency(record?.err_amount)}</Tag>
                ) : (
                    toCurrency(0)
                )
        },
        {
            title: 'SĐT',
            width: '115px',
            key: 'phone_number',
            render: (text) => <span style={{ fontSize: 13 }}>{text}</span>
        },
        {
            title: 'CODE',
            width: '80px',
            key: 'code',
            render: (text) => <span style={{ fontSize: 13 }}>{text}</span>
        },
        {
            title: 'KÊNH NẠP',
            width: '80px',
            key: ['refund', 'channel'],
            render(text, record) {
                return (
                    <span style={{ fontSize: 13 }}>
                        {text === 1 ? 'M.định' : 'EZ'}
                    </span>
                )
            }
        },
        {
            title: 'K.ĐKÝ',
            width: '65px',
            key: ['refund', 'register_channel'],
            render: (text) => <span style={{ fontSize: 13 }}>{text}</span>
        },
        {
            title: 'TẶNG SIM',
            width: '80px',
            key: ['refund', 'gift_type'],
            render: (text, record) => (
                <span style={{ fontSize: 13 }}>
                    {text === 1 ? 'Ko gói' : text === 2 ? 'Có gói' : null}
                </span>
            )
        }
    ]

    const columnTotals = [
        {
            title: 'STT',
            width: '60px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user', 'name']
        },
        {
            title: 'DOANH THU',
            minWidth: '150px',
            sortOrder: 'descend',
            sorter: (a, b) => a?.revenue - b?.revenue,
            render: (text, record) => {
                const datas = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )
                const sum = datas?.reduce(
                    (acc, cur) =>
                        acc +
                        (parseInt(cur?.revenue || 0) -
                            parseInt(
                                cur?.amount >= cur?.standard_amount
                                    ? cur?.standard_amount
                                    : cur?.amount
                            )),
                    0
                )
                return <span>{toCurrency(sum)}</span>
            }
        },
        userInfo?.role < 3 && {
            title: 'DOANH THU THẬT',
            minWidth: '150px',
            render: (text, record) => {
                const datas = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )
                const sum = datas?.reduce(
                    (acc, cur) => acc + parseInt(cur?.real_revenue || 0),
                    0
                )
                return <span>{toCurrency(sum)}</span>
            }
        },
        {
            title: 'HOÀN DƯ',
            minWidth: '150px',
            render: (text, record) => {
                const datas = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )
                const sum = datas?.reduce(
                    (acc, cur) => acc + parseInt(cur?.res_amount),
                    0
                )

                return (
                    <Tag color={sum > 0 ? '#cd201f' : sum < 0 ? 'green' : ''}>
                        {toCurrency(sum)}
                    </Tag>
                )
            }
        },
        {
            title: 'HOÀN LỖI',
            minWidth: '150px',
            render: (text, record) => {
                const datas = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )
                const sum = datas?.reduce(
                    (acc, cur) => acc + parseInt(cur?.err_amount),
                    0
                )

                return sum ? (
                    <Tag color="#cd201f">{toCurrency(sum)}</Tag>
                ) : (
                    toCurrency(0)
                )
            }
        },
        {
            title: 'SIM KO GÓI',
            render: (text, record) => {
                const datas = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )
                const sum = datas?.reduce(
                    (acc, cur) =>
                        acc + parseInt(record?.refund?.gift_type === 1 ? 1 : 0),
                    0
                )
                return <span>{sum}</span>
            }
        },
        {
            title: 'SIM KÈM GÓI',
            render: (text, record) => {
                const datas = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )
                const sum = datas?.reduce(
                    (acc, cur) =>
                        acc + parseInt(record?.refund?.gift_type === 2 ? 1 : 0),
                    0
                )
                return <span>{sum}</span>
            }
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

    const search = () => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('report/upgrade', {
                ...filter,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            })
                .then((res) => {
                    setReportType('detail')
                    setSumData(res?.data?.data)
                })
                .finally(() => setLoading(false))
        } else {
            setSumData([])
        }
    }

    const exportExcel = () => {
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Báo cáo nâng cấp.xlsx'

        Axios.post(
            'export/upgrade-report',
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
            </FilterItem>
            {userInfo?.role < 3 ? (
                <>
                    <FilterItem title="Chi nhánh">
                        <Select
                            size="small"
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
                                    .includes(input.toLowerCase())
                            }
                            options={users?.map((d) => ({
                                value: d.id,
                                label: d.name
                            }))}
                        />
                    </FilterItem>
                </>
            ) : null}
            <FilterItem title="Kênh đăng ký">
                <Select
                    size="small"
                    allowClear
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    placeholder="Kênh đăng ký"
                    optionFilterProp="children"
                    onChange={(value) => {
                        setFilter({ ...filter, register_channel: value })
                    }}
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    options={REGISTER_CHANNELS}
                />
            </FilterItem>

            <FilterItem title="Loại báo cáo">
                <Select
                    size="small"
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
            </FilterItem>
            <FilterItem title="Tải Excel">
                <Button type="primary" block onClick={exportExcel} size="small">
                    Tải Excel
                </Button>
            </FilterItem>
            <FilterItem>
                <Button type="primary" onClick={search} size="small">
                    Tìm kiếm
                </Button>
            </FilterItem>
        </Row>
    )

    const sumOfRevenue = sumData
        ?.filter((i) => !i?.err_amount)
        ?.reduce((acc, cur) => acc + cur?.real_revenue, 0)

    const sumOfPrice = sumData
        ?.filter((i) => !i?.err_amount)
        ?.reduce((acc, cur) => acc + cur?.revenue, 0)

    const sumOfAmount = sumData
        ?.filter((i) => !i?.err_amount)
        ?.reduce(
            (acc, cur) =>
                acc +
                parseInt(
                    cur?.amount >= cur?.standard_amount
                        ? cur?.standard_amount
                        : cur?.amount
                ),
            0
        )

    const sumOfResAmount = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.amount ? cur?.res_amount : 0),
        0
    )

    const sumOfErrorAmount = sumData?.reduce(
        (acc, cur) => acc + cur?.err_amount,
        0
    )

    const sumSim = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.refund?.gift_type === 1 ? 1 : 0),
        0
    )

    const sumSimPack = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.refund?.gift_type === 2 ? 1 : 0),
        0
    )

    const uniqueData = hasDuplicated(sumData)

    return (
        <Row gutter={[8, 8]}>
            {/* <Col span={24}>
                <Row gutter={[32, 32]} justify="space-between">
                    <BreadCrumbs
                        breadCrumbParent="Nâng cấp"
                        breadCrumbActive="Báo cáo nâng cấp"
                    />
                </Row>
            </Col> */}

            <Col span={24}>
                <Table
                    size="small"
                    bordered
                    dataSource={reportType === 'detail' ? sumData : uniqueData}
                    pagination={false}
                    loading={loading}
                    title={() => (userInfo?.role < 3 ? filterHeader : null)}
                    scroll={{ x: 'calc(700px + 50%)', y: 800 }}
                    summary={() => (
                        <Table.Summary fixed="top">
                            <Table.Summary.Row>
                                <Table.Summary.Cell
                                    index={0}
                                    colSpan={reportType === 'detail' ? 3 : 2}>
                                    Tổng
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfPrice - sumOfAmount)}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>
                                    {userInfo?.role < 3 ? (
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(sumOfRevenue || 0)}
                                        </span>
                                    ) : null}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfResAmount || 0)}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfErrorAmount || 0)}
                                    </span>
                                </Table.Summary.Cell>
                                {reportType === 'detail' ? (
                                    <Table.Summary.Cell
                                        index={4}
                                        colSpan={5}></Table.Summary.Cell>
                                ) : (
                                    <>
                                        <Table.Summary.Cell index={4}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 500
                                                }}>
                                                {sumSim}
                                            </span>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 500
                                                }}>
                                                {sumSimPack}
                                            </span>
                                        </Table.Summary.Cell>
                                    </>
                                )}
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}>
                    {reportType === 'detail'
                        ? columns?.map((i) => (
                              <Column {...i} dataIndex={i?.key} />
                          ))
                        : columnTotals?.map((i) => (
                              <Column {...i} dataIndex={i?.key} />
                          ))}
                </Table>
            </Col>
        </Row>
    )
}
