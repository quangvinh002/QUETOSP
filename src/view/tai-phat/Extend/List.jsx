import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    Form,
    Table,
    Modal,
    Spin,
    message,
    InputNumber,
    Popconfirm
} from 'antd'
import { DocumentUpload } from 'iconsax-react'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    EXTEND_PACKS,
    CREATE_EXTEND_PACK,
    UPDATE_EXTEND_PACK,
    DELETE_EXTEND_PACK,
    currencyFormatter
} from '@/constants'
import { toCurrency } from 'helpers'

const user = JSON.parse(localStorage.getItem('@current_user'))

export default function Inventory({}) {
    const [data, setData] = useState([])
    const [selectedPack, setSelectedPack] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [getPacks, { loading }] = useLazyQuery(EXTEND_PACKS)
    const [createNewPack, { loading: modalLoading }] =
        useMutation(CREATE_EXTEND_PACK)
    const [updatePack, { loading: modalUpdateLoading }] =
        useMutation(UPDATE_EXTEND_PACK)
    const [deleteExtendPack] = useMutation(DELETE_EXTEND_PACK)
    const [form] = Form.useForm()

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => index + 1
        },
        {
            title: 'CODE',
            key: 'code',
            render: (item, record) => record?.code
        },
        {
            title: 'DOANH THU',
            key: 'revenue',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a?.revenue - b?.revenue,
            render: (item, record) => toCurrency(record?.revenue)
        },
        user?.role < 3
            ? {
                  title: 'DOANH THU THẬT',
                  key: 'revenue',
                  render: (item, record) => toCurrency(record?.real_revenue)
              }
            : {}
    ]

    useEffect(() => {
        if (selectedPack) {
            form.setFieldsValue({ ...selectedPack })
        } else {
            form.resetFields()
        }
    }, [selectedPack])

    useEffect(() => {
        getPacks({
            variables: {}
        }).then((res) => {
            setData(res?.data?.ExtendPackList)
        })
    }, [])

    const remove = (code) => {
        deleteExtendPack({
            variables: {
                code
            }
        })
            .then((res) => {
                if (res?.data?.deleteExtendPack) {
                    const updated = data?.filter((i) => i?.code !== code)
                    setData(updated)
                    message.success('Xoá gói thành công')
                    setIsModalOpen(false)
                } else {
                    message.error('Xoá gói thất bại')
                }
            })
            .catch((err) => message.error('Xoá gói thất bại'))
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const newPack = (values) => {
        const variables = {
            ...values,
            revenue: parseInt(values?.revenue),
            real_revenue: parseInt(values?.real_revenue)
        }

        if (selectedPack) {
            updatePack({
                variables
            }).then((res) => {
                if (res?.data?.updateExtendPack?.code) {
                    const updated = [...data]
                    updated[
                        updated.findIndex((item) => item.code === values.code)
                    ] = values
                    setData(updated)

                    message.open({
                        content: 'Cập nhật thông tin thành công',
                        type: 'success'
                    })
                    setIsModalOpen(false)
                }
            })
        } else {
            createNewPack({
                variables
            }).then((res) => {
                if (res?.data?.createExtendPack?.code) {
                    setData(
                        Array.isArray(data)
                            ? [{ ...values }, ...data]
                            : [values]
                    )
                    message.open({
                        content: 'Đăng ký thành công',
                        type: 'success'
                    })
                    setIsModalOpen(false)
                }
            })
        }
    }

    return (
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Gia hạn"
                            breadCrumbActive="Danh sách gói gia hạn"
                        />

                        {user?.role < 2 && (
                            <Col span={24} md={12}>
                                <Row
                                    gutter={[16, 16]}
                                    justify="end"
                                    className="hp-ecommerce-app-inventory-events">
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                setSelectedPack(null)
                                                showModal()
                                            }}>
                                            <DocumentUpload
                                                color="#fff"
                                                variant="Bulk"
                                            />
                                            <span className="hp-ml-8">
                                                Thêm gói
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Col>

                <Col span={24}>
                    <h2>Danh sách gói gia hạn</h2>
                </Col>

                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        dataSource={data}
                        columns={columns}
                        pagination={false}
                        loading={loading}
                        scroll={{ y: 500, x: '100%' }}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setSelectedPack(record)
                                    showModal()
                                }
                            }
                        }}
                    />
                </Col>
            </Row>
            <Modal
                title={
                    selectedPack ? 'Cập nhật gói gia hạn' : 'Thêm gói gia hạn'
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}>
                <Spin
                    size="large"
                    spinning={modalLoading || modalUpdateLoading}>
                    <Form
                        form={form}
                        onFinish={newPack}
                        layout="vertical"
                        initialValues={{ remember: true }}>
                        <Form.Item
                            label="Gói :"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your code!'
                                }
                            ]}>
                            <Input disabled={selectedPack} />
                        </Form.Item>

                        <Form.Item
                            label="Doanh thu :"
                            name="revenue"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your revenue!'
                                }
                            ]}>
                            <InputNumber
                                style={{ width: '100%' }}
                                {...currencyFormatter}
                            />
                        </Form.Item>
                        {user?.role < 3 ? (
                            <Form.Item
                                label="Doanh thu thật :"
                                name="real_revenue">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    {...currencyFormatter}
                                />
                            </Form.Item>
                        ) : null}
                        {user?.role < 3 && (
                            <>
                                <Form.Item>
                                    <Button
                                        block
                                        type="primary"
                                        htmlType="submit">
                                        {selectedPack
                                            ? 'Cập nhật gói gia hạn'
                                            : 'Thêm gói gia hạn'}
                                    </Button>
                                </Form.Item>
                                {selectedPack ? (
                                    <Form.Item>
                                        <Popconfirm
                                            title="Xác nhận xóa gói này?"
                                            onConfirm={() => {
                                                remove(selectedPack?.code)
                                            }}>
                                            <Button block danger>
                                                Xóa
                                            </Button>
                                        </Popconfirm>
                                    </Form.Item>
                                ) : null}
                            </>
                        )}
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}
