import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Row, Col, Avatar, Spin, Button } from 'antd'
import Axios from '@/Axios'
import { toCurrency, getUserInfo } from 'helpers'

const user = getUserInfo()

export default function HistoryCard(props) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Axios.get('get-top-revenue')
            .then((res) => {
                setData(res?.data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const getUserRevenues = () => {
        setLoading(true)
        Axios.get('get-users-revenue')
            .then((res) => {
                setData(res?.data)
                window.location.reload()
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Spin spinning={loading}>
            <Row gutter={[0, 16]} align="middle" justify="space-between">
                <Col sm={12} span={24}>
                    <span className="h3 hp-font-weight-600 hp-text-color-black-bg hp-text-color-dark-0 hp-d-block">
                        Xếp hạng doanh thu tháng {dayjs().month() + 1}
                        {user?.role < 1 && (
                            <Button size="small" onClick={getUserRevenues}>
                                Quét doanh thu
                            </Button>
                        )}
                    </span>
                </Col>
            </Row>

            <Row gutter={[12, 12]} className="hp-mt-24">
                {data.map((item, index) => (
                    <Col
                        key={index}
                        span={24}
                        className="hp-bg-black-0 hp-bg-dark-100 hp-border-radius-xxl hp-border-1 hp-border-color-black-10 hp-border-color-dark-80 hp-p-12">
                        <Row align="middle" justify="space-between">
                            <Col sm={12} span={24} className="hp-mb-sm-16">
                                <Row align="middle" wrap={false}>
                                    <Col>
                                        <div className="hp-mr-16">
                                            <Avatar size={40}>
                                                {index + 1}
                                            </Avatar>
                                        </div>
                                    </Col>

                                    <Col>
                                        <span className="hp-d-block h4">
                                            {item?.name}
                                        </span>

                                        <span className="hp-d-block hp-p1-body hp-mt-4">
                                            {item?.user_code}
                                        </span>
                                    </Col>
                                </Row>
                            </Col>

                            <Col
                                sm={6}
                                span={12}
                                className="hp-text-sm-left hp-text-right"
                                style={{ minHeight: 50 }}>
                                <span className="hp-d-block h4 hp-font-weight-400">
                                    {toCurrency(item?.revenue)}
                                </span>
                            </Col>

                            <Col
                                sm={6}
                                span={12}
                                className="hp-text-right"
                                style={{ minHeight: 50 }}>
                                {item.percent && (
                                    <span className="h4">{item.percent}</span>
                                )}
                            </Col>
                        </Row>
                    </Col>
                ))}
            </Row>
        </Spin>
    )
}
