import React, { useState } from 'react'
import { Row, Col, Form, Input, Button, message, Spin } from 'antd'
import Axios from '@/Axios'
import LeftContent from '../leftContent'

export default function Login({ history }) {
    const [loading, setLoading] = useState(false)

    const onSubmit = (values) => {
        setLoading(true)
        Axios.post('login', values)
            .then((res) => {
                if (res?.data?.token) {
                    localStorage.setItem('@token', res?.data?.token)
                    localStorage.setItem(
                        '@current_user',
                        JSON.stringify(res?.data?.user_info)
                    )
                    localStorage.setItem(
                        '@packs',
                        JSON.stringify(res?.data?.packs)
                    )
                    localStorage.setItem(
                        '@branches',
                        JSON.stringify(res?.data?.branches)
                    )
                    localStorage.setItem(
                        '@extendPacks',
                        JSON.stringify(res?.data?.extendPacks)
                    )

                    window.location.href = 'admin/dashboard'
                } else {
                    message.error(
                        res?.data?.error || 'Sai tài khoản hoặc mật khẩu'
                    )
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Row gutter={[32, 0]} className="hp-authentication-page">
            <LeftContent />

            <Col lg={12} span={24} className="hp-py-sm-0 hp-py-md-64">
                <Row className="hp-h-100" align="middle" justify="center">
                    <Col
                        xxl={11}
                        xl={15}
                        lg={20}
                        md={20}
                        sm={24}
                        className="hp-px-sm-8 hp-pt-24 hp-pb-48">
                        <h1 className="hp-mb-sm-0">Đăng nhập</h1>
                        <Spin spinning={loading} size="large">
                            <Form
                                onFinish={onSubmit}
                                layout="vertical"
                                initialValues={{ remember: true }}
                                className="hp-mt-sm-16 hp-mt-32">
                                <Form.Item
                                    label="Tài khoản :"
                                    className="hp-mb-16"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your username!'
                                        }
                                    ]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu :"
                                    className="hp-mb-8"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your password!'
                                        }
                                    ]}>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item className="hp-mt-16 hp-mb-8">
                                    <Button
                                        block
                                        type="primary"
                                        htmlType="submit">
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
