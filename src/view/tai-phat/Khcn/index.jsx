import React, { useState } from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    Form,
    Card,
    Divider,
    Select,
    Table,
    Spin,
    message,
    Tabs
} from 'antd'
import Axios from '@/Axios'
import { MirroringScreen } from 'iconsax-react'
import { formatDate } from 'helpers'

const packs = JSON.parse(localStorage.getItem('@packs'))
const { Column } = Table

export default function Inventory({}) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState()

    const onFinish = (values) => {
        setLoading(true)
        const params = {
            ...values
        }

        Axios.post('khcn', params)
            .then((res) => {
                if (res?.error) {
                    message.error('Lỗi API, vui lòng liên hệ nhà cung cấp')
                    return
                }
                return res?.data?.data
            })
            .then((data) => {
                setData(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            {/* <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs breadCrumbActive="Tra cứu KHCN" />
                    </Row>
                </Col> */}

            {/* <Col span={24}>
                    <h2>Tra cứu KHCN</h2>
                </Col> */}

            <Spin spinning={loading}>
                <Card>
                    <Form
                        labelCol={{
                            span: 8
                        }}
                        wrapperCol={{
                            span: 16
                        }}
                        onFinish={onFinish}>
                        <Row gutter={[8, 8]}>
                            <Col flex="1">
                                <Form.Item
                                    label="Số thuê bao"
                                    name="phone_number"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your phone!'
                                        }
                                    ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col flex="1">
                                <Form.Item label="Mã gói cước" name="code">
                                    <Select
                                        allowClear
                                        showSearch
                                        style={{
                                            width: '100%'
                                        }}
                                        placeholder="Mã gói cước"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={(packs || []).map((d) => ({
                                            value: d.code,
                                            label: d.code
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col></Col>
                        </Row>

                        <Form.Item label="Tra cứu">
                            <Button type="primary" htmlType="submit">
                                <MirroringScreen color="#fff" variant="Bulk" />
                                <span className="hp-ml-8">Tra cứu</span>
                            </Button>
                        </Form.Item>
                    </Form>

                    <KHCNResult data={data} loading={loading} />
                </Card>
            </Spin>
        </>
    )
}

export const KHCNResult = ({ data, loading }) => {
    const items = [
        {
            key: '1',
            label: `Lịch sử gói cước`,
            children: (
                <Table size="small" dataSource={data?.pckHistories}>
                    <Column
                        title="Mã gói cước"
                        dataIndex="pckCode"
                        width={200}
                        render={(text, record) => (
                            <span
                                style={{
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word'
                                }}>
                                {text}
                            </span>
                        )}
                    />
                    <Column
                        title="Hình thức"
                        dataIndex="pckType"
                        width={200}
                        render={(text, record) => (
                            <span
                                style={{
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word'
                                }}>
                                {text}
                            </span>
                        )}
                    />
                    <Column
                        dataIndex="startDate"
                        title="Ngày bắt đầu"
                        width={200}
                        render={(text, record) => (
                            <span
                                style={{
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word'
                                }}>
                                {text}
                            </span>
                        )}
                    />
                    <Column
                        dataIndex="endDate"
                        title="Ngày kết thúc"
                        width={200}
                        render={(text, record) => (
                            <span
                                style={{
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word'
                                }}>
                                {text}
                            </span>
                        )}
                    />
                </Table>
            )
        },
        {
            key: '2',
            label: `Đối tượng chương trình`,
            children: (
                <Table size="small" dataSource={data?.packageObjects}>
                    <Column title="Gói cước" dataIndex="code" />
                    <Column title="Cú pháp" dataIndex="subSyntax" />
                    <Column
                        dataIndex="fromDate"
                        title="Ngày bắt đầu"
                        render={(text, record) => <span>{text}</span>}
                    />
                    <Column
                        dataIndex="endDKKMDate"
                        title="Ngày kết thúc"
                        render={(text, record) => <span>{text}</span>}
                    />
                </Table>
            )
        }
    ]
    return (
        <Spin spinning={loading}>
            <Divider orientation="left">Thông tin gói cước</Divider>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Số TB:
                        <Input value={data?.isdn} readOnly width="100%" />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Chế độ vip:
                        <Input value={data?.vipMode} readOnly width="100%" />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Gói cước hiện tại:
                        <Input value={data?.pckCodes} readOnly width="100%" />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Loại thuê bao:
                        <Input value={data?.subType} readOnly width="100%" />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Tài khoản chính:
                        <Input
                            value={data?.unitsAvailable}
                            readOnly
                            width="100%"
                        />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Ngày kích hoạt:
                        <Input value={data?.activeDate} readOnly width="100%" />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Hình thức thanh toán:
                        <Input value={data?.payType} readOnly width="100%" />
                    </label>
                </Col>
                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Hạn mức CVQT Data:
                        <Input
                            placeholder="API không hiển thị"
                            readOnly
                            width="100%"
                        />
                    </label>
                </Col>

                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Tên khách hàng:
                        <Input value={data?.custName} readOnly width="100%" />
                    </label>
                </Col>

                <Col span={12}>
                    <label style={{ fontWeight: 600 }}>
                        Hạn mức trong nước:
                        <Input
                            placeholder="API không hiển thị"
                            readOnly
                            width="100%"
                        />
                    </label>
                </Col>

                <Col span={24}>
                    <Tabs defaultActiveKey="1" type="card" items={items} />
                </Col>
            </Row>
        </Spin>
    )
}
