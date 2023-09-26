import React, { useState } from 'react'
import {
    Row,
    Col,
    Button,
    Spin,
    Tag,
    Select,
    Table,
    Typography,
    DatePicker
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { REFUND_STATUS, toCurrency, colors } from '@/constants'
import Axios from '@/Axios'
import { formatDate, getUserInfo } from 'helpers'

const { Column } = Table
const { Title } = Typography

const branches = JSON.parse(localStorage.getItem('@branches'))
const user = getUserInfo()

export default function ReportRefund() {
    const [filter, setFilter] = useState({})
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    const expandedRowRender = (record, index, indent, expanded) => {
        const sub_columns = [
            {
                title: 'Mã NV',
                render: (text, record) => {
                    return <span>{record?.user?.user_code}</span>
                }
            },
            {
                title: 'Tên nhân viên',
                render: (text, record) => {
                    return <Tag>{record?.user?.name}</Tag>
                }
            },
            {
                title: 'Số thuê bao',
                render(text, record) {
                    return <span>{record?.phone_number}</span>
                }
            },
            {
                title: 'Số tiền hoàn',
                render: (text, record) => {
                    return <span>{toCurrency(record?.amount)}</span>
                }
            },
            {
                title: 'Số thực hoàn',
                render: (text, record) => {
                    return <span>{toCurrency(record?.amount_tran)}</span>
                }
            },
            {
                title: 'TK hoàn tiền',
                render(text, record) {
                    return <span>{record?.refund_account?.username}</span>
                }
            },
            {
                title: 'Kênh nạp',
                render(text, record) {
                    return (
                        <span>{record?.channel === 1 ? 'Mặc định' : 'EZ'}</span>
                    )
                }
            },
            {
                title: 'Trạng thái',
                render: (text, record) => {
                    const index = REFUND_STATUS.findIndex(
                        (item) => item.value === record?.status
                    )

                    return (
                        <Tag color={colors[index]}>
                            {REFUND_STATUS[index]?.label}
                        </Tag>
                    )
                }
            },
            {
                title: 'Ngày tạo',
                render: (text, record) => (
                    <Tag>{formatDate(record?.created_at)}</Tag>
                )
            }
        ]
        return (
            <Table
                size="small"
                columns={sub_columns}
                dataSource={record?.subData}
                pagination={true}
            />
        )
    }

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'Chi nhánh',
            key: 'display_name'
        },
        {
            title: 'Tổng tiền hoàn',
            key: 'total',
            render: (text, record) => {
                return <span>{toCurrency(text)}</span>
            }
        },
        {
            title: 'Tổng thực hoàn',
            key: 'total_tran',
            render: (text, record) => {
                return <span>{toCurrency(text)}</span>
            }
        }
    ]

    const searchByFilter = () => {
        setLoading(true)
        Axios.post('report/th', filter)
            .then((res) => {
                const _b =
                    user?.role < 2
                        ? [
                              ...branches,
                              { id: null, display_name: 'Không có chi nhánh' }
                          ]
                        : branches?.filter(
                              (item) => item?.id === user?.branch_id
                          )
                const data = _b?.map((item, index) => {
                    const subData = res?.data?.data?.filter(
                        (subItem) => subItem?.user?.branch_id === item?.id
                    )

                    return {
                        ...item,
                        key: index.toString(),
                        subData,
                        total: subData?.reduce(
                            (total, item) => total + item?.amount,
                            0
                        ),
                        total_tran: subData?.reduce(
                            (total, item) => total + item?.amount_tran,
                            0
                        )
                    }
                })

                data?.push({
                    key: 'total',
                    display_name: 'Tổng',
                    total: data?.reduce(
                        (total, item) => total + item?.total,
                        0
                    ),
                    total_tran: data?.reduce(
                        (total, item) => total + item?.total_tran,
                        0
                    )
                })

                setData(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const exportExcel = () => {
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Báo cáo tiền hoàn.xlsx'

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

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <Col span={5}>
                <Title level={5}>Từ ngày</Title>
                <DatePicker
                    style={{
                        width: '100%'
                    }}
                    placeholder="Từ ngày"
                    onChange={(_date, dateString) => {
                        setFilter({
                            ...filter,
                            from_date: dateString
                        })
                    }}
                />
            </Col>

            <Col span={5}>
                <Title level={5}>Đến ngày</Title>
                <DatePicker
                    style={{
                        width: '100%'
                    }}
                    placeholder="Đến ngày"
                    onChange={(_date, dateString) => {
                        setFilter({
                            ...filter,
                            to_date: dateString
                        })
                    }}
                />
            </Col>
            <Col span={6}>
                <Title level={5}>Trạng thái</Title>
                <Select
                    style={{
                        width: '100%'
                    }}
                    value={filter?.status}
                    placeholder="Trạng thái"
                    onChange={(value) => {
                        setFilter({ ...filter, status: value })
                    }}
                    options={REFUND_STATUS}
                />
            </Col>
            <Col span={4}>
                <Title level={5}>Tìm kiếm</Title>
                <Button
                    type="primary"
                    onClick={searchByFilter}
                    style={{
                        width: '100%'
                    }}>
                    Tìm kiếm
                </Button>
            </Col>
            <Col span={4}>
                <Title level={5}>Tải về</Title>
                <Button
                    onClick={exportExcel}
                    style={{
                        width: '100%'
                    }}>
                    Tải Excel
                </Button>
            </Col>
        </Row>
    )

    return (
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Báo cáo"
                            breadCrumbActive="Báo cáo tiền hoàn"
                        />
                    </Row>
                </Col>

                <Col span={24}>
                    <h2>Báo cáo tiền hoàn</h2>
                </Col>

                <Col span={24}>
                    <Spin
                        tip="Đang tổng hợp báo cáo, dữ liệu rất lớn vui lòng đợi trong ít phút..."
                        size="large"
                        spinning={loading}>
                        <Table
                            size="small"
                            bordered
                            dataSource={data}
                            expandable={{
                                expandedRowRender
                            }}
                            scroll={{
                                x: '100%'
                            }}
                            pagination={false}
                            title={() => filterHeader}>
                            {columns?.map((i) => (
                                <Column {...i} dataIndex={i?.key} />
                            ))}
                        </Table>
                    </Spin>
                </Col>
            </Row>
        </>
    )
}
