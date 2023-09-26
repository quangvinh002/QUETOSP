import React, { useState, useEffect } from 'react'
import { Card, List, Spin } from 'antd'
import Axios from '@/Axios'

const d = new Date()

const LogKHCN = () => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Axios.get('report/log-rank-khcn')
            .then((res) => {
                setData(res?.data?.data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
    return (
        <Card
            title={`Thống kê số lượt tra cứu KHCN tháng ${
                d.getMonth() + 1
            }/${d.getFullYear()}`}
            hoverable>
            <Spin spinning={loading}>
                <List
                    pagination={{
                        position: 'bottom',
                        align: 'center'
                    }}
                    size="small"
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <a href="#">
                                        {item.name} ({item.display_name})
                                    </a>
                                }
                                description={`Số lượt tra cứu: ${item.count} lần`}
                            />
                        </List.Item>
                    )}
                />
            </Spin>
        </Card>
    )
}
export default LogKHCN
