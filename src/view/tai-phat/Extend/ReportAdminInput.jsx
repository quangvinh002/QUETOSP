import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import { formatDate } from 'helpers'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const extendPacks = JSON.parse(localStorage.getItem('@extendPacks'))

export default function Inventory({ filter }) {
    const [sumData, setSumData] = useState([])
    const [loading, setLoading] = useState(false)

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'NGÀY',
            render: (text, record) => <span>{formatDate(record, false)}</span>
        },
        {
            title: 'GÓI',
            children: extendPacks?.map((pack) => {
                return {
                    title: pack?.code,
                    render: (item, record) => {
                        const records = sumData?.filter(
                            (i) =>
                                i?.date === record &&
                                i?.pack_code === pack?.code
                        )

                        const total = records?.reduce(
                            (total, item) => total + parseInt(item?.total),
                            0
                        )

                        return total
                    }
                }
            })
        },
        {
            title: 'TỔNG GÓI',
            render: (text, record) => {
                const records6C90N = sumData?.filter((i) => i?.date === record)

                const total6C90N = records6C90N?.reduce(
                    (total, item) => total + parseInt(item?.total),
                    0
                )

                return total6C90N
            }
        }
    ]

    useEffect(() => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('extend-pack/report-admin-input', {
                ...filter,
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

    const sumOfAmount = sumData?.reduce(
        (acc, cur) => acc + parseInt(cur?.total || 0),
        0
    )

    const distinctData = [...new Set(sumData.map((item) => item?.date))]

    return (
        <Table
            size="small"
            bordered
            dataSource={distinctData || []}
            pagination={false}
            loading={loading}
            columns={columns}
            scroll={{ y: 500, x: '100%' }}
            summary={() => (
                <Table.Summary fixed="top">
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>TỔNG</Table.Summary.Cell>
                        {extendPacks?.map((pack, index) => {
                            const sum = sumData?.reduce(
                                (acc, cur) =>
                                    cur?.pack_code === pack?.code
                                        ? acc + parseInt(cur?.total || 0)
                                        : acc,
                                0
                            )

                            return (
                                <Table.Summary.Cell index={index + 2}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {sum}
                                    </span>
                                </Table.Summary.Cell>
                            )
                        })}
                        <Table.Summary.Cell index={extendPacks?.length + 3}>
                            <span
                                style={{
                                    fontSize: 16,
                                    fontWeight: 500
                                }}>
                                {sumOfAmount}
                            </span>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                </Table.Summary>
            )}
        />
    )
}
