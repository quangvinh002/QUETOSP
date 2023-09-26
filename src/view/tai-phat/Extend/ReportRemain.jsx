import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Typography, DatePicker } from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const { Title } = Typography

const { Column } = Table
const extendPacks = JSON.parse(localStorage.getItem('@extendPacks'))

export default function Inventory({}) {
    const [sumData, setSumData] = useState([])
    const [filter, setFilter] = useState({
        from_date: dayjs(),
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
                })
                .finally(() => setLoading(false))
        } else {
            setSumData([])
        }
    }, [filter])

    const uniqueSum = [...new Set(sumData.map((item) => item?.display_name))]

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
                            breadCrumbParent="Gia hạn"
                            breadCrumbActive="Danh sách gói"
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
                                    {extendPacks?.map((pack, index) => {
                                        const sum = sumData?.reduce(
                                            (acc, cur) =>
                                                cur?.pack_code === pack?.code
                                                    ? acc + parseInt(cur?.sum)
                                                    : acc,
                                            0
                                        )
                                        return (
                                            <Table.Summary.Cell
                                                index={index + 1}>
                                                <b style={{ fontSize: 18 }}>
                                                    {sum > 0 ? '+' : ''}
                                                    {sum}
                                                </b>
                                            </Table.Summary.Cell>
                                        )
                                    })}
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
                        {extendPacks?.map((pack) => {
                            return (
                                <Column
                                    title={pack?.code}
                                    render={(text, record) => {
                                        const sum = sumData?.find(
                                            (i) =>
                                                i?.display_name === record &&
                                                i?.pack_code === pack?.code
                                        )?.sum

                                        return (
                                            <span>
                                                {sum
                                                    ? `${
                                                          sum > 0 ? '+' : ''
                                                      }${sum}`
                                                    : ''}
                                            </span>
                                        )
                                    }}
                                />
                            )
                        })}
                    </Table>
                </Col>
            </Row>
        </>
    )
}
