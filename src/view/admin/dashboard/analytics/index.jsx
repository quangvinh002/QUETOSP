import React, { useState, useEffect } from 'react'

import { Row, Col, Card, Spin, DatePicker } from 'antd'
import HistoryCard from './historyCard'
import Logs from './logKHCN'
import { Area } from '@ant-design/plots'
import { getUserInfo } from 'helpers'
import Axios from '@/Axios'
import moment from 'moment'
import 'moment/locale/vi'
import locale from 'antd/es/date-picker/locale/vi_VN'

moment.updateLocale('vi', {
    monthsShort: [
        'Th 1',
        'Th 2',
        'Th 3',
        'Th 4',
        'Th 5',
        'Th 6',
        'Th 7',
        'Th 8',
        'Th 9',
        'Th 10',
        'Th 11',
        'Th 12'
    ]
})

const userInfo = getUserInfo()

export default function Analytics() {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        setLoading(true)
        Axios.get(`get-chart-data/${month}/${year}`)
            .then((res) => {
                setData(res?.data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [month, year])

    const config = {
        xField: 'Date',
        yField: 'scales',
        xAxis: {
            range: [0, 1],
            tickCount: 5
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
            }
        }
    }

    const onChange = (date, dateString) => {
        setMonth(date.month() + 1)
        setYear(date.year())
    }

    return (
        <Spin spinning={loading}>
            <Row gutter={[32, 32]} className="hp-mb-32">
                <Col flex="1" className="hp-overflow-hidden">
                    {process.env.REACT_APP_ENV ? (
                        'Hệ thống riêng dùng để lọc gói'
                    ) : (
                        <Row gutter={[32, 32]}>
                            {/* <Col span={24}>
                            <h1 className="hp-mb-0">Trang tổng quan</h1>
                        </Col> */}

                            <Col span={24}>
                                <HistoryCard />
                            </Col>
                            <Col>
                                <DatePicker
                                    locale={locale}
                                    onChange={onChange}
                                    picker="month"
                                    style={{ marginLeft: 20, width: '100%' }}
                                    placeholder="Chọn tháng xuất báo cáo"
                                />
                            </Col>
                            <Col span={24}>
                                <Card title={<>Báo cáo Bình Tân</>} hoverable>
                                    <Area
                                        {...config}
                                        data={
                                            data?.CN18?.map((i) => {
                                                return {
                                                    Date: `${i?.day}/${i?.month}`,
                                                    scales: i?.revenue / 1000
                                                }
                                            }) || []
                                        }
                                    />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="Báo cáo Gò Vấp" hoverable>
                                    <Area
                                        {...config}
                                        data={
                                            data?.CN17?.map((i) => {
                                                return {
                                                    Date: `${i?.day}/${i?.month}`,
                                                    scales: i?.revenue / 1000
                                                }
                                            }) || []
                                        }
                                    />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="Báo cáo Cai Lậy" hoverable>
                                    <Area
                                        {...config}
                                        data={
                                            data?.CN19?.map((i) => {
                                                return {
                                                    Date: `${i?.day}/${i?.month}`,
                                                    scales: i?.revenue / 1000
                                                }
                                            }) || []
                                        }
                                    />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="Báo cáo Mỹ Tho" hoverable>
                                    <Area
                                        {...config}
                                        data={
                                            data?.CN21?.map((i) => {
                                                return {
                                                    Date: `${i?.day}/${i?.month}`,
                                                    scales: i?.revenue / 1000
                                                }
                                            }) || []
                                        }
                                    />
                                </Card>
                            </Col>
                            {userInfo?.role < 3 && (
                                <Col span={24}>
                                    <Logs />
                                </Col>
                            )}
                        </Row>
                    )}
                </Col>
            </Row>
        </Spin>
    )
}
