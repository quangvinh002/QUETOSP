import React, { useState } from 'react'

import { Row, Col, Divider, Form, Input, Button, Spin, message } from 'antd'
import { CHANGE_PASSWORD } from '@/constants'
import { useMutation } from '@apollo/client'

export default function PasswordProfile() {
  const dividerClass = 'hp-border-color-black-40 hp-border-color-dark-80'
  const [loading, setLoading] = useState(false)
  const [updatePassword] = useMutation(CHANGE_PASSWORD)

  const onSubmit = (values) => {
    setLoading(true)

    if (values?.password) {
      updatePassword({
        variables: values
      })
        .then((response) => {
          if (response?.data?.updateUser?.id) {
            message.open({
              content: 'Cập nhật mật khẩu thành công',
              type: 'success'
            })
          }
        })
        .catch((err) => {
          message.open({
            content: err?.message,
            type: 'error'
          })
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <Row>
      <Col span={24}>
        <h2>Đổi mật khẩu</h2>
        <p className="hp-p1-body hp-mb-0"></p>

        <Divider className={dividerClass} />
      </Col>

      <Col xxl={5} xl={10} md={15} span={24}>
        <Spin spinning={loading}>
          <Form layout="vertical" name="basic" onFinish={onSubmit}>
            <Form.Item
              label={
                <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                  Mật khẩu mới :
                </span>
              }
              name="password"
            >
              <Input placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  )
}
