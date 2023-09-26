import React, { useEffect, useState } from 'react'
import { Select, Button, Input, Spin, Form, Modal, message } from 'antd'
import { TOGGLE_USER, ROLES, USER_TYPES, RESET_PASSWORD } from '@/constants'
import { useMutation } from '@apollo/client'

const branches = JSON.parse(localStorage.getItem('@branches'))

const AddNew = ({ id = null, getById, isOpen, onClose, onSubmit, loading }) => {
    const [form] = Form.useForm()
    const [toggleUser] = useMutation(TOGGLE_USER)
    const [resetPwd] = useMutation(RESET_PASSWORD)
    const [activated, setActivated] = useState(1)

    useEffect(() => {
        if (id) {
            const _data = getById(id)
            form.setFieldsValue({ ..._data, branch_id: _data?.branch?.id })
            setActivated(_data?.activated)
        } else {
            form.resetFields()
            setActivated(1)
        }
    }, [id])

    const changeUserStatus = (_activated) => {
        toggleUser({
            variables: {
                id,
                activated: _activated
            }
        })
            .then((response) => {
                if (response?.data?.updateUser?.id) {
                    message.open({
                        content: 'Cập nhật nhân viên thành công',
                        type: 'success'
                    })
                    setActivated(_activated)
                }
            })
            .catch((err) => {
                message.open({
                    content: err?.message,
                    type: 'error'
                })
            })
    }

    const resetPassword = () => {
        resetPwd({
            variables: {
                id,
                password: '123456'
            }
        })
            .then((response) => {
                if (response?.data?.updateUser?.id) {
                    message.open({
                        content: 'Reset mật khẩu thành công',
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
    }

    return (
        <Modal
            title={id ? 'Cập nhật thông tin' : 'Thêm mới nhân viên'}
            open={isOpen}
            onCancel={onClose}
            footer={null}>
            <Spin size="large" spinning={loading}>
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <Form.Item
                        label="Họ tên :"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!'
                            },
                            {
                                min: 6,
                                message: 'Độ dài tối thiểu 6 ký tự'
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mã NV :" name="user_code">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ca làm :" name="type">
                        <Select
                            style={{
                                width: '100%'
                            }}
                            options={USER_TYPES}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email :"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!'
                            },
                            {
                                min: 6,
                                message: 'Độ dài tối thiểu 6 ký tự'
                            }
                        ]}>
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại :"
                        name="phone"
                        rules={[
                            {
                                min: 6,
                                message: 'Độ dài tối thiểu 6 ký tự'
                            }
                        ]}>
                        <Input type="number" allowClear />
                    </Form.Item>

                    <Form.Item
                        label="Username :"
                        name="username"
                        rules={[
                            {
                                min: 6,
                                message: 'Độ dài tối thiểu 6 ký tự'
                            }
                        ]}>
                        <Input readOnly />
                    </Form.Item>

                    <Form.Item label="Line gọi :" name="line_call">
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item label="Chi nhánh :" name="branch_id">
                        <Select
                            allowClear
                            showSearch
                            style={{
                                width: '100%'
                            }}
                            placeholder=""
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={(branches || []).map((d) => ({
                                value: d.id,
                                label: d?.display_name || d?.name
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Cấp bậc :" name="role">
                        <Select
                            style={{
                                width: '100%'
                            }}
                            options={(ROLES || []).map((d, index) => ({
                                value: index,
                                label: d
                            }))}
                        />
                    </Form.Item>
                    <Form.Item className="hp-mt-16 hp-mb-8">
                        <Button block type="primary" htmlType="submit">
                            {id ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
                {id ? (
                    activated === 1 ? (
                        <Button
                            block
                            outline
                            onClick={() => changeUserStatus(0)}>
                            Khóa tài khoản
                        </Button>
                    ) : (
                        <Button
                            block
                            outline
                            onClick={() => changeUserStatus(1)}>
                            Mở khóa tài khoản
                        </Button>
                    )
                ) : null}

                <Button
                    block
                    danger
                    outline
                    onClick={resetPassword}
                    style={{ marginTop: 10 }}>
                    Reset mật khẩu
                </Button>
            </Spin>
        </Modal>
    )
}

export default AddNew
