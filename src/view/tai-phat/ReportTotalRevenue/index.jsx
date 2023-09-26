import React, { useEffect, useState } from 'react'
import { Row, Col, Table, DatePicker, Button, Select } from 'antd'
import FilterItem from '@/layout/components/FilterItem'
import Axios from '@/Axios'
import { toCurrency, getUserInfo, formatDate } from 'helpers'
import dayjs from 'dayjs'
import { REGISTER_REPORT_CHANNELS, REPORT_TYPE } from '@/constants'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
const branches = JSON.parse(localStorage.getItem('@branches'))
const userInfo = getUserInfo()
const MIN_REVENUE = 30000000

const hasDuplicated = (list) => {
    const duplicatedDelete = list?.filter(
        (fruit, index) =>
            list.findIndex((item) => item?.user_id === fruit?.user_id) === index
    )
    return duplicatedDelete
}

const channels = ['KH27', 'KH23', 'KH29', 'GA27']

export default function Inventory({}) {
    const [sumData, setSumData] = useState([])
    const [sumUniqueData, setSumUniqueData] = useState([])
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [reportType, setReportType] = useState('detail')

    const columns = [
        {
            title: 'STT',
            width: '60px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'MÃ NV',
            minWidth: '150px',
            render: (text, record) => <span>{record?.user_code}</span>
        },
        {
            title: 'NHÂN VIÊN',
            minWidth: '150px',
            render: (text, record) => <span>{record?.name}</span>
        },
        {
            title: 'DOANH THU',
            minWidth: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a?.revenue - b?.revenue,
            render: (text, record) => <span>{toCurrency(record?.revenue)}</span>
        },
        userInfo?.role < 3
            ? {
                  title: 'DOANH THU THẬT',
                  minWidth: '150px',
                  render: (text, record) => (
                      <span>{toCurrency(record?.pack_revenue || 0)}</span>
                  )
              }
            : {},
        {
            title: 'TIỀN HOÀN',
            children: [
                {
                    title: 'THỰC HOÀN',
                    minWidth: '150px',
                    render: (text, record) => (
                        <span>{toCurrency(record?.amount_tran || 0)}</span>
                    )
                },
                {
                    title: 'HOÀN DƯ',
                    minWidth: '150px',
                    render: (text, record) => (
                        <span
                            style={{
                                color:
                                    record?.res_amount > 0
                                        ? '#87d068'
                                        : record?.res_amount < 0
                                        ? '#cd201f'
                                        : '',
                                fontWeight: 'bold'
                            }}>
                            {toCurrency(record?.res_amount)}
                        </span>
                    )
                },
                {
                    title: 'HOÀN LỖI',
                    minWidth: '150px',
                    render: (text, record) =>
                        record?.err_amount ? (
                            <span
                                style={{
                                    color: '#cd201f',
                                    fontWeight: 'bold'
                                }}>
                                {toCurrency(record?.err_amount)}
                            </span>
                        ) : (
                            toCurrency(0)
                        )
                }
            ]
        },
        {
            title: 'CHI NHÁNH',
            minWidth: '150px',
            render: (text, record) => <span>{record?.display_name}</span>
        },
        {
            title: 'SĐT',
            minWidth: '150px',
            render: (text, record) => <span>{record?.phone_number}</span>
        },
        {
            title: 'CODE',
            minWidth: '150px',
            render: (text, record) => <span>{record?.code}</span>
        },
        {
            title: 'KÊNH ĐKÝ',
            minWidth: '150px',
            render: (text, record) => <span>{record?.register_channel}</span>
        },

        {
            title: 'TẶNG SIM',
            children: [
                {
                    title: 'SIM KO GÓI',
                    minWidth: '150px',
                    render: (text, record) => (
                        <span>{record?.gift_type === 1 ? '1' : '0'}</span>
                    )
                },
                {
                    title: 'SIM CÓ GÓI',
                    minWidth: '150px',
                    render: (text, record) => (
                        <span>{record?.gift_type === 2 ? '1' : '0'}</span>
                    )
                }
            ]
        },
        {
            title: 'NGÀY',
            width: '120px',
            render: (text, record) => (
                <span>{formatDate(record?.created_at, false)}</span>
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
            minWidth: '150px',
            render: (text, record) => (
                <span
                    style={{
                        color:
                            record?.totalRevenue < MIN_REVENUE ? 'red' : 'black'
                    }}>
                    {record?.name}
                </span>
            )
        },
        {
            title: 'TỔNG SỐ GÓI',
            minWidth: '150px',
            render: (text, record) => {
                const userData = sumData?.filter(
                    (i) => i?.user_id === record?.user_id
                )

                return userData?.length
            }
        },
        {
            title: 'TỔNG DOANH THU',
            minWidth: '400px',
            sortOrder: 'descend',
            sorter: (a, b) => parseInt(a?.totalRevenue - b?.totalRevenue),
            render: (text, record) => {
                return (
                    <span
                        style={{
                            color:
                                record?.totalRevenue < MIN_REVENUE
                                    ? 'red'
                                    : 'black'
                        }}>
                        {toCurrency(record?.totalRevenue || 0)}
                    </span>
                )
            }
        },
        userInfo?.role < 3
            ? {
                  title: 'TỔNG DOANH THU THẬT',
                  minWidth: '400px',
                  render: (text, record) => {
                      const userData = sumData?.filter(
                          (i) => i?.user_id === record?.user_id
                      )

                      const sumOfRevenue = userData?.reduce(
                          (acc, cur) => acc + cur?.pack_revenue,
                          0
                      )
                      return toCurrency(sumOfRevenue || 0)
                  }
              }
            : {},
        {
            title: 'TIỀN HOÀN',
            children: [
                {
                    title: 'THỰC HOÀN',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) => i?.user_id === record?.user_id
                        )

                        const sum = userData?.reduce(
                            (acc, cur) => acc + cur?.amount_tran,
                            0
                        )

                        return toCurrency(sum)
                    }
                },
                {
                    title: 'HOÀN DƯ',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) => i?.user_id === record?.user_id
                        )

                        const sum = userData?.reduce(
                            (acc, cur) => acc + cur?.res_amount,
                            0
                        )
                        return (
                            <span
                                style={{
                                    color:
                                        sum > 0
                                            ? '#87d068'
                                            : sum < 0
                                            ? '#cd201f'
                                            : 'black'
                                }}>
                                {toCurrency(sum)}
                            </span>
                        )
                    }
                },
                {
                    title: 'HOÀN LỖI',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) => i?.user_id === record?.user_id
                        )

                        const sum = userData?.reduce(
                            (acc, cur) => acc + cur?.err_amount,
                            0
                        )
                        return sum ? (
                            <span
                                style={{
                                    color: '#cd201f'
                                }}>
                                {toCurrency(sum)}
                            </span>
                        ) : (
                            toCurrency(0)
                        )
                    }
                }
            ]
        },
        {
            title: 'KÊNH ĐKÝ',
            children: [
                {
                    title: 'KH',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                channels.includes(i?.register_channel) &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                },
                {
                    title: 'OTP',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                i?.register_channel === 'OTP' &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                },
                {
                    title: 'GH',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                i?.register_channel === 'GH' &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                },
                {
                    title: 'CODE',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                i?.register_channel === 'CODE' &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                },
                {
                    title: 'KHÁC',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                !channels.includes(i?.register_channel) &&
                                i?.register_channel !== 'OTP' &&
                                i?.register_channel !== 'GH' &&
                                i?.register_channel !== 'CODE' &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                }
            ]
        },

        {
            title: 'TẶNG SIM',
            children: [
                {
                    title: 'SIM KO GÓI',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                i?.gift_type === 1 &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                },
                {
                    title: 'SIM CÓ GÓI',
                    minWidth: '150px',
                    render: (text, record) => {
                        const userData = sumData?.filter(
                            (i) =>
                                i?.gift_type === 2 &&
                                i?.user_id === record?.user_id
                        )
                        return userData?.length
                    }
                }
            ]
        }
    ]

    useEffect(() => {
        if (reportType === 'all') {
            let uniqueData = hasDuplicated(sumData)

            uniqueData = uniqueData?.map((item) => {
                const userData = sumData?.filter(
                    (i) => i?.user_id === item?.user_id
                )

                const sum = userData?.reduce(
                    (acc, cur) => acc + cur?.revenue,
                    0
                )

                return {
                    ...item,
                    totalRevenue: sum
                }
            })

            const a = uniqueData?.sort((a, b) => {
                console.log(
                    a?.totalRevenue +
                        ' - ' +
                        b?.totalRevenue +
                        ' = ' +
                        parseInt(b?.totalRevenue - a?.totalRevenue)
                )
                return !!parseInt(b?.totalRevenue - a?.totalRevenue)
            })

            setSumUniqueData(a)
        }
    }, [reportType])

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
            Axios.post('report/total-revenue', {
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
        link.download = 'Báo cáo doanh thu.xlsx'

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
            ) : null}
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
                    clearIcon={<button>X</button>}
                    options={REGISTER_REPORT_CHANNELS}
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
            <FilterItem>
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

    const sumOfRevenue = sumData?.reduce((acc, cur) => acc + cur?.revenue, 0)
    const sumOfPackRevenue = sumData?.reduce(
        (acc, cur) => acc + cur?.pack_revenue,
        0
    )
    const sumOfAmountTran = sumData?.reduce(
        (acc, cur) => acc + cur?.amount_tran,
        0
    )
    const sumOfResAmount = sumData?.reduce(
        (acc, cur) => acc + cur?.res_amount,
        0
    )
    const sumOfErrAmount = sumData?.reduce(
        (acc, cur) => acc + cur?.err_amount,
        0
    )

    const sumSim = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.gift_type === 1 ? 1 : 0),
        0
    )

    const sumSimPack = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.gift_type === 2 ? 1 : 0),
        0
    )

    const sumOfKH = sumData?.filter((i) =>
        channels.includes(i?.register_channel)
    )?.length

    const sumOfOTP = sumData?.filter(
        (i) => i?.register_channel === 'OTP'
    )?.length

    const sumOfGH = sumData?.filter((i) => i?.register_channel === 'GH')?.length

    const sumOfCode = sumData?.filter(
        (i) => i?.register_channel === 'CODE'
    )?.length

    const sumOfOther = sumData?.filter(
        (i) =>
            !channels.includes(i?.register_channel) &&
            i?.register_channel !== 'OTP' &&
            i?.register_channel !== 'GH' &&
            i?.register_channel !== 'CODE'
    )?.length

    return (
        <Row gutter={[8, 8]}>
            {/* <Col span={24}>
                <Row gutter={[32, 32]} justify="space-between">
                    <BreadCrumbs
                        breadCrumbParent="Báo cáo"
                        breadCrumbActive="Báo cáo doanh thu"
                    />
                </Row>
            </Col> */}

            <Col span={24}>
                <Table
                    size="small"
                    bordered
                    dataSource={
                        reportType === 'detail' ? sumData : sumUniqueData
                    }
                    pagination={false}
                    loading={loading}
                    title={() => filterHeader}
                    scroll={{ x: 'calc(1000px + 50%)', y: 1000 }}
                    columns={reportType === 'detail' ? columns : columnTotals}
                    summary={() => (
                        <Table.Summary fixed="top">
                            <Table.Summary.Row>
                                <Table.Summary.Cell
                                    index={0}
                                    colSpan={reportType === 'detail' ? 3 : 2}>
                                    Tổng
                                </Table.Summary.Cell>
                                {reportType === 'all' && (
                                    <Table.Summary.Cell index={1}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {sumData?.length}
                                        </span>
                                    </Table.Summary.Cell>
                                )}
                                <Table.Summary.Cell index={1}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfRevenue || 0)}
                                    </span>
                                </Table.Summary.Cell>

                                <Table.Summary.Cell index={13}>
                                    {userInfo?.role < 3 ? (
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(sumOfPackRevenue || 0)}
                                        </span>
                                    ) : null}
                                </Table.Summary.Cell>

                                <Table.Summary.Cell index={2}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfAmountTran || 0)}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfResAmount || 0)}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfErrAmount || 0)}
                                    </span>
                                </Table.Summary.Cell>

                                {reportType === 'all' ? (
                                    <>
                                        <Table.Summary.Cell index={8}>
                                            {sumOfKH}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={9}>
                                            {sumOfOTP}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={10}>
                                            {sumOfGH}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={11}>
                                            {sumOfCode}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={12}>
                                            {sumOfOther}
                                        </Table.Summary.Cell>
                                    </>
                                ) : (
                                    <Table.Summary.Cell
                                        index={8}
                                        colSpan={4}></Table.Summary.Cell>
                                )}

                                <Table.Summary.Cell index={5}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {sumSim}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {sumSimPack}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell
                                    index={7}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </Col>
        </Row>
    )
}
