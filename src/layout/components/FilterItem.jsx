import React from 'react'
import { Row, Col, Typography } from 'antd'

const { Title } = Typography

export default ({ title, children }) => (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <Row>
            <Col>
                <Title level={5} style={{ marginRight: 10 }}>
                    {title}
                </Title>
            </Col>
            <Col flex="auto">{children}</Col>
        </Row>
    </Col>
)
