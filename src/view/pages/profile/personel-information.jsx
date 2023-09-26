import React, { useState } from 'react'

import {
  Row,
  Col,
  Spin
} from 'antd'

import ChangePassword from './password-change'
import { useQuery } from '@apollo/client'
import { USER, ROLES } from '@/constants'

export default function InfoProfile() {
  const listTitle = 'hp-p1-body'
  const listResult =
    'hp-mt-sm-4 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0'

  const { data, loading } = useQuery(USER)
  const user = data?.User

  return (
    <Spin spinning={loading}>
      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>Thông tin cá nhân</h3>
        </Col>

        {/* <Col md={12} span={24} className="hp-profile-action-btn hp-text-right">
          <Button type="primary" ghost onClick={contactModalShow}>
            Đổi thông tin
          </Button>
        </Col> */}

        <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-120"
        >
          <ul>
            <li>
              <span className={listTitle}>Họ tên</span>
              <span className={listResult}>{user?.name}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Email</span>
              <span className={listResult}>{user?.email}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Số điện thoại</span>
              {user?.phone}
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Chi nhánh</span>
              <span className={listResult}>{user?.branch?.display_name}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Phân quyền</span>
              <span className={listResult}>{ROLES[user?.role]}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Ngày tạo</span>
              <span className={listResult}>{user?.created_at}</span>
            </li>
          </ul>
        </Col>
      </Row>
      <ChangePassword />
    </Spin>
  )
}
