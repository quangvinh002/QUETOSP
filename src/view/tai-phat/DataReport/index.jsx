import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Pagination,
    Tag,
    Table,
    Typography,
    DatePicker,
    Select,
    Button
} from 'antd'
import { getUserInfo, formatDate } from 'helpers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Axios from '@/Axios'
import { useLazyQuery } from '@apollo/client'
import { DATA_LOGS, DATA_LOGS_TOTAL, REPORT_TYPE } from '@/constants'
import FilterItem from '@/layout/components/FilterItem'
import { DocumentDownload } from 'iconsax-react'
import * as XLSX from 'xlsx'

dayjs.extend(utc)
const { Column } = Table
const user = getUserInfo()
const branches = JSON.parse(localStorage.getItem('@branches'))

export default function Inventory({}) {
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [total, setTotal] = useState(0)
    const [listData, setListData] = useState()
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [loading, setLoading] = useState(false)
    const [reportType, setReportType] = useState('detail')
    const [getAll] = useLazyQuery(DATA_LOGS)
    const [getAllTotal] = useLazyQuery(DATA_LOGS_TOTAL)

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'NGÀY',
            key: 'created_at',
            render: (text) => <Tag>{formatDate(text)}</Tag>
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user', 'name'],
            render: (text) => (text ? <Tag>{text}</Tag> : null)
        },
        {
            title: 'SĐT',
            key: 'phone_number'
        }
    ]

    const columnsTotal = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'NHÂN VIÊN',
            key: ['user', 'name'],
            render: (text) => (text ? <Tag>{text}</Tag> : null)
        },
        {
            title: 'TỔNG LẤY SỐ',
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

    const getTotalData = () => {
        setLoading(true)
        getAllTotal({
            variables: {
                ...filter,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                const response = res?.data?.DataLogsTotal
                setListData(response)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getDetailData = () => {
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
                const response = res?.data?.DataLogs
                setListData(response?.data)
                setTotal(response?.total)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const search = () => {
        if (reportType === 'detail') {
            getDetailData()
        } else {
            getTotalData()
        }
    }

    useEffect(() => {
        search()
    }, [page, limit])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const formatDataBeforeDownload = (listData) => {
        if (reportType === 'detail') {
            const newData = listData?.map((item) => {
                return {
                    Ngày: item.created_at,
                    'Nhân viên': item?.user?.name,
                    'Số điện thoại': item.phone_number
                }
            })

            return newData
        }

        const newData = listData?.map((item) => {
            return {
                'Nhân viên': item?.user?.name,
                'Tổng lấy số': item?.total
            }
        })

        return newData
    }

    const exportFile = () => {
        const ws = XLSX.utils.json_to_sheet(formatDataBeforeDownload(listData))
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Data')
        XLSX.writeFileXLSX(
            wb,
            `Báo cáo data ${
                reportType === 'detail' ? 'chi tiết' : 'tổng hợp'
            }.xlsx`
        )
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
            </FilterItem>
            {user?.role < 2 ? (
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
            <FilterItem title="Loại báo cáo">
                <Select
                    size="small"
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    placeholder="Loại báo cáo"
                    optionFilterProp="children"
                    onChange={setReportType}
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
                <>
                    <Button type="secondary" onClick={exportFile} size="small">
                        Tải kết quả
                    </Button>
                    <Button type="primary" onClick={search} size="small">
                        Tìm kiếm
                    </Button>
                </>
            </FilterItem>
        </Row>
    )

    return (
        <Table
            size="small"
            dataSource={listData}
            scroll={{
                x: '100%'
            }}
            pagination={false}
            loading={loading}
            title={() => filterHeader}
            footer={() =>
                reportType === 'detail' ? (
                    <Pagination
                        pageSize={limit}
                        showSizeChanger
                        onShowSizeChange={onShowSizeChange}
                        total={total}
                        onChange={onPageChange}
                    />
                ) : null
            }>
            {reportType === 'detail'
                ? columns?.map((i) => <Column {...i} dataIndex={i?.key} />)
                : columnsTotal?.map((i) => (
                      <Column {...i} dataIndex={i?.key} />
                  ))}
        </Table>
    )
}
