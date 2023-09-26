import React from 'react'

import { Col, Row } from 'antd'

export default function Footer() {
  return (
    <Col span={24} className="hp-py-32">
      <p className="hp-mb-8 hp-p1-body hp-text-color-black-60">
        COPYRIGHT ©2022 NAD, All rights Reserved
      </p>

      <Row align="middle" justify="center" gutter="16">
        <Col>
          <a className="hp-p1-body hp-text-color-black-80 hp-hover-text-color-primary-1">Privacy Policy</a>
        </Col>

        <Col>
          <a className="hp-p1-body hp-text-color-black-80 hp-hover-text-color-primary-1">Term of use</a>
        </Col>
      </Row>
    </Col>
  )
}
