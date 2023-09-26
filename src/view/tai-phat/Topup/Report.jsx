import React, { useEffect, useState } from 'react'
import { Row, Col, Tag, Table, DatePicker, Typography, Spin } from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { toCurrency } from '@/constants'
import { getUserInfo } from 'helpers'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { Title } = Typography
const { Column } = Table
const user = getUserInfo()

export default function Inventory({}) {
    const [data, setData] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs().startOf('month'),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState()
    const [totalData, setTotalData] = useState()

    const getBalance = () => {
        Axios.get('refund/balance').then((res) => {
            setAccounts(res?.data?.accounts)
        })
    }

    const getTotalAmount = () => {
        Axios.post('refund/total-amount', {
            from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
            to_date: filter?.to_date?.local().format('YYYY-MM-DD')
        }).then((res) => {
            setTotalData(res?.data)
        })
    }

    useEffect(() => {
        getBalance()
    }, [])

    useEffect(() => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('topup/report', {
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            })
                .then((res) => {
                    setData(res?.data?.data)
                })
                .finally(() => setLoading(false))

            getTotalAmount()
        } else {
            setData([])
        }
    }, [filter])

    const sumOf24HIn = data?.reduce(
        (acc, cur) =>
            acc + parseInt(cur?.data?.find((i) => i?.type === 1)?.inTotal || 0),
        0
    )

    const sumOf24HOut = data?.reduce(
        (acc, cur) =>
            acc +
            parseInt(cur?.data?.find((i) => i?.type === 1)?.outTotal || 0),
        0
    )

    const sumOfEZHIn = data?.reduce(
        (acc, cur) =>
            acc + parseInt(cur?.data?.find((i) => i?.type === 2)?.inTotal || 0),
        0
    )

    const sumOfEZHOut = data?.reduce(
        (acc, cur) =>
            acc +
            parseInt(cur?.data?.find((i) => i?.type === 2)?.outTotal || 0),
        0
    )

    return (
        <Spin spinning={loading} size="large">
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Tiền nạp"
                            breadCrumbActive="Báo cáo"
                        />
                    </Row>
                </Col>
                <Col span={24}>
                    {accounts?.map((i) => (
                        <h5>
                            Số dư tài khoản {i?.username}:{' '}
                            <Tag>{toCurrency(i?.amount)}</Tag>
                        </h5>
                    ))}
                </Col>

                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {user?.role < 2 ? (
                                <>
                                    <h5>
                                        Tổng tiền hoàn :{' '}
                                        <Tag>
                                            {toCurrency(totalData?.amount || 0)}
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
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        dataSource={[
                            { key: 'in', label: 'NHẬP' },
                            { key: 'out', label: 'XUẤT' }
                        ]}
                        scroll={{
                            x: '100%'
                        }}
                        pagination={false}
                        loading={loading}
                        title={() => <span style={{ fontSize: 24 }}>Tổng</span>}
                        summary={() => (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell
                                        index={0}
                                        colSpan={1}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(
                                                sumOf24HIn - sumOf24HOut
                                            )}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(
                                                sumOfEZHIn - sumOfEZHOut
                                            )}
                                        </span>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}>
                        <Column
                            title="KÊNH"
                            render={(text, record, index) => text?.label}
                        />
                        <Column
                            title="24H"
                            render={(text, record, index) => {
                                if (record?.key === 'in') {
                                    return <span>{toCurrency(sumOf24HIn)}</span>
                                }
                                return <span>{toCurrency(sumOf24HOut)}</span>
                            }}
                        />
                        <Column
                            title="EZ"
                            render={(text, record, index) => {
                                if (record?.key === 'in') {
                                    return <span>{toCurrency(sumOfEZHIn)}</span>
                                }
                                return <span>{toCurrency(sumOfEZHOut)}</span>
                            }}
                        />
                    </Table>
                </Col>

                {data?.map((item) => {
                    const data24H = item?.data?.find((i) => i?.type === 1)
                    const dataEZ = item?.data?.find((i) => i?.type === 2)
                    const sumOf24H =
                        parseInt(item?.lastRevenue?.i24h_balance) +
                        (parseInt(data24H?.inTotal) -
                            parseInt(data24H?.outTotal))

                    const sumOfEZ =
                        parseInt(item?.lastRevenue?.ez_balance) +
                        (parseInt(dataEZ?.inTotal) - parseInt(dataEZ?.outTotal))

                    return (
                        <Col span={24}>
                            <Table
                                size="small"
                                bordered
                                dataSource={[
                                    { key: 'in', label: 'NHẬP' },
                                    { key: 'out', label: 'XUẤT' },
                                    {
                                        key: 'balance',
                                        label: `TỒN THÁNG ${item?.lastRevenue?.month}`
                                    }
                                ]}
                                scroll={{
                                    x: '100%'
                                }}
                                pagination={false}
                                loading={loading}
                                title={() => (
                                    <span style={{ fontSize: 24 }}>
                                        {item?.name}
                                    </span>
                                )}
                                summary={() => (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell
                                                index={0}
                                                colSpan={
                                                    1
                                                }></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <span
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 500
                                                    }}>
                                                    {toCurrency(sumOf24H || 0)}
                                                </span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <span
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 500
                                                    }}>
                                                    {toCurrency(sumOfEZ || 0)}
                                                </span>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}>
                                <Column
                                    title="KÊNH"
                                    render={(text, record, index) =>
                                        text?.label
                                    }
                                />
                                <Column
                                    title="24H"
                                    render={(text, record, index) => {
                                        const findItem = data24H
                                        if (record?.key === 'in') {
                                            return (
                                                <span>
                                                    {toCurrency(
                                                        parseInt(
                                                            findItem?.inTotal
                                                        ) || 0
                                                    )}
                                                </span>
                                            )
                                        } else if (record?.key === 'out') {
                                            return (
                                                <span>
                                                    {toCurrency(
                                                        parseInt(
                                                            findItem?.outTotal
                                                        ) || 0
                                                    )}
                                                </span>
                                            )
                                        }

                                        return (
                                            <span>
                                                {' '}
                                                {toCurrency(
                                                    parseInt(
                                                        item?.lastRevenue
                                                            ?.i24h_balance
                                                    ) || 0
                                                )}
                                            </span>
                                        )
                                    }}
                                />
                                <Column
                                    title="EZ"
                                    render={(text, record, index) => {
                                        const findItem = dataEZ

                                        if (record?.key === 'in') {
                                            return (
                                                <span>
                                                    {toCurrency(
                                                        parseInt(
                                                            findItem?.inTotal
                                                        ) || 0
                                                    )}
                                                </span>
                                            )
                                        } else if (record?.key === 'out') {
                                            return (
                                                <span>
                                                    {toCurrency(
                                                        parseInt(
                                                            findItem?.outTotal
                                                        ) || 0
                                                    )}
                                                </span>
                                            )
                                        }

                                        return (
                                            <span>
                                                {' '}
                                                {toCurrency(
                                                    parseInt(
                                                        item?.lastRevenue
                                                            ?.ez_balance
                                                    ) || 0
                                                )}
                                            </span>
                                        )
                                    }}
                                />
                            </Table>
                        </Col>
                    )
                })}
            </Row>
        </Spin>
    )
}
