import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Typography, DatePicker } from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const { Title } = Typography

const { Column } = Table

export default function Inventory({}) {
    const [sumData, setSumData] = useState([])
    const [adminData, setAdminData] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(new Date(2023, 3, 1)),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('pack-request/sum-pack-request', {
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            })
                .then((res) => {
                    setSumData(res?.data?.data)
                    setAdminData(res?.data?.admin)
                })
                .finally(() => setLoading(false))
        } else {
            setSumData([])
        }
    }, [filter])

    const uniqueSum = [...new Set(sumData.map((item) => item?.display_name))]
    const sumOfAmount6C90N = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '6C90N' ? acc + parseInt(cur?.sum) : acc,
        0
    )

    const sumOfAmount6C90NCount = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '6C90N' ? acc + parseInt(cur?.count) : acc,
        0
    )

    const sumOfAmount12C90N = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '12C90N' ? acc + parseInt(cur?.sum) : acc,
        0
    )

    const sumOfAmount12C90NCount = sumData?.reduce(
        (acc, cur) =>
            cur?.pack_code === '12C90N' ? acc + parseInt(cur?.count) : acc,
        0
    )

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
        </Row>
    )

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Chuyển code"
                            breadCrumbActive="Báo cáo tồn"
                        />
                    </Row>
                </Col>

                <Col span={24}>
                    <Table
                        loading={loading}
                        title={() => filterHeader}
                        size="small"
                        bordered
                        dataSource={uniqueSum}
                        scroll={{ x: '100%' }}
                        summary={() => (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell
                                        index={0}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <b style={{ fontSize: 18 }}>
                                            {parseInt(sumOfAmount6C90N || 0) -
                                                parseInt(
                                                    sumOfAmount6C90NCount || 0
                                                )}
                                        </b>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <b style={{ fontSize: 18 }}>
                                            {parseInt(sumOfAmount12C90N || 0) -
                                                parseInt(
                                                    sumOfAmount12C90NCount || 0
                                                )}
                                        </b>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                        pagination={false}>
                        <Column
                            title="Chi nhánh"
                            render={(text, record) => (
                                <span>{record || 'Tổng'}</span>
                            )}
                        />
                        <Column
                            title="6C90N"
                            render={(text, record) => {
                                const sdata = sumData?.find(
                                    (i) =>
                                        i?.display_name === record &&
                                        i?.pack_code === '6C90N'
                                )

                                const sum = sdata?.sum
                                const count = sdata?.count

                                return (
                                    <span>
                                        {parseInt(sum || 0) -
                                            parseInt(count || 0)}
                                    </span>
                                )
                            }}
                        />
                        <Column
                            title="12C90N"
                            render={(text, record) => {
                                const sdata = sumData?.find(
                                    (i) =>
                                        i?.display_name === record &&
                                        i?.pack_code === '12C90N'
                                )

                                const sum = sdata?.sum
                                const count = sdata?.count

                                return (
                                    <span>
                                        {parseInt(sum || 0) -
                                            parseInt(count || 0)}
                                    </span>
                                )
                            }}
                        />
                    </Table>
                </Col>
                <Col span={24}>
                    <Table
                        loading={loading}
                        size="small"
                        bordered
                        dataSource={[1]}
                        scroll={{ x: '100%' }}
                        pagination={false}>
                        <Column
                            title=""
                            render={(text, record) => <span>Kho Admin</span>}
                        />
                        <Column
                            title="6C90N"
                            render={(text, record) => {
                                return (
                                    <span>
                                        {parseInt(
                                            adminData?.countIn6C90N || 0
                                        ) -
                                            parseInt(
                                                adminData?.countOut6C90N || 0
                                            )}
                                    </span>
                                )
                            }}
                        />
                        <Column
                            title="12C90N"
                            render={(text, record) => {
                                return (
                                    <span>
                                        {parseInt(
                                            adminData?.countIn12C90N || 0
                                        ) -
                                            parseInt(
                                                adminData?.countOut12C90N || 0
                                            )}
                                    </span>
                                )
                            }}
                        />
                    </Table>
                </Col>
            </Row>
        </>
    )
}
