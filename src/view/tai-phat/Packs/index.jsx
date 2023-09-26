import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Button,
    Input,
    Form,
    Modal,
    Spin,
    message,
    InputNumber,
    Pagination,
    Typography,
    Table
} from 'antd'
import { DocumentUpload } from 'iconsax-react'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    PACKS_PAGING,
    CREATE_PACK,
    UPDATE_PACK,
    DELETE_PACK,
    currencyFormatter
} from '@/constants'
import { toCurrency } from 'helpers'

const user = JSON.parse(localStorage.getItem('@current_user'))
const { Title } = Typography
const { Search, TextArea } = Input

export default function Inventory({}) {
    const [filter, setFilter] = useState()
    const [data, setData] = useState()
    const [selectedPack, setSelectedPack] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [getPacks, { loading }] = useLazyQuery(PACKS_PAGING)
    const [createNewPack, { loading: modalLoading }] = useMutation(CREATE_PACK)
    const [updatePack, { loading: modalUpdateLoading }] =
        useMutation(UPDATE_PACK)
    const [deletePack] = useMutation(DELETE_PACK)
    const [form] = Form.useForm()

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'CODE',
            render: (item, record) => record?.code
        },
        {
            title: 'SỐ NGÀY',
            render: (item, record) => record?.duration
        },
        {
            title: 'GIÁ GỐC',
            render: (item, record) => toCurrency(record?.price || 0)
        },
        {
            title: 'SỐ TIỀN HOÀN',
            render: (item, record) => toCurrency(record?.amount || 0)
        },
        user?.role < 3
            ? {
                  title: 'DOANH THU THẬT',
                  render: (item, record) => toCurrency(record?.revenue || 0)
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
            variables: {
                ...filter,
                page,
                limit
            }
        }).then((res) => {
            setData(res?.data?.Packs?.data)
            setTotal(res?.data?.Packs?.total)
        })
    }, [page, limit, filter])

    const showModal = () => {
        setIsModalOpen(true)
    }

    const newPack = (values) => {
        const variables = {
            ...values,
            duration: parseInt(values?.duration || 0),
            amount: parseInt(values?.amount || 0),
            price: parseInt(values?.price || 0),
            revenue: parseInt(values?.revenue || 0)
        }
        if (selectedPack) {
            updatePack({
                variables
            }).then((res) => {
                if (res?.data?.updatePack?.code) {
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
                if (res?.data?.createPack?.code) {
                    setData([{ ...values }, ...data])
                    message.open({
                        content: 'Đăng ký thành công',
                        type: 'success'
                    })
                    setIsModalOpen(false)
                }
            })
        }
    }

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Tìm gói cước</Title>
                <Search
                    allowClear
                    style={{
                        width: '100%'
                    }}
                    placeholder="Gói cước"
                    onSearch={(value) => {
                        setFilter({
                            ...filter,
                            search: value
                        })
                    }}
                />
            </Col>
        </Row>
    )

    return (
        <Spin spinning={loading} size="large">
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Quản lý"
                            breadCrumbActive="Mời gói cước"
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
                                                Thêm gói cước
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Col>

                <Col span={24}>
                    <h2>Danh sách gói cước</h2>
                </Col>

                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        title={() => filterHeader}
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
                        footer={() => (
                            <Pagination
                                pageSize={limit}
                                showSizeChanger
                                onShowSizeChange={onShowSizeChange}
                                showTotal={(total) => `Tổng: ${total}`}
                                total={total}
                                onChange={onPageChange}
                                pageSizeOptions={['50', '100', '500', '1000']}
                            />
                        )}
                    />
                </Col>
            </Row>
            <Modal
                title={selectedPack ? 'Cập nhật gói cước' : 'Thêm gói cước'}
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
                            label="Gói cước :"
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
                            label="Số ngày :"
                            name="duration"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your duration!'
                                }
                            ]}>
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label="Giá gốc :" name="price">
                            <InputNumber
                                style={{ width: '100%' }}
                                {...currencyFormatter}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Số tiền hoàn :"
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your amount!'
                                }
                            ]}>
                            <InputNumber
                                style={{ width: '100%' }}
                                {...currencyFormatter}
                            />
                        </Form.Item>
                        {user?.role < 3 && (
                            <Form.Item label="Doanh thu thật :" name="revenue">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    {...currencyFormatter}
                                />
                            </Form.Item>
                        )}
                        <Form.Item label="Mô tả :" name="description">
                            <TextArea style={{ width: '100%' }} />
                        </Form.Item>
                        {user?.role < 2 && (
                            <>
                                <Form.Item>
                                    <Button
                                        block
                                        type="primary"
                                        htmlType="submit">
                                        {selectedPack
                                            ? 'Cập nhật gói cước'
                                            : 'Thêm gói cước'}
                                    </Button>
                                </Form.Item>
                                {selectedPack && (
                                    <Form.Item>
                                        <Button
                                            block
                                            type="danger"
                                            onClick={() => {
                                                deletePack({
                                                    variables: {
                                                        code: selectedPack?.code
                                                    }
                                                }).then((res) => {
                                                    if (res?.data?.deletePack) {
                                                        const newData =
                                                            data?.filter(
                                                                (i) =>
                                                                    i?.code !==
                                                                    selectedPack?.code
                                                            )
                                                        setData(newData)
                                                        message.open({
                                                            content:
                                                                'Xóa gói thành công',
                                                            type: 'success'
                                                        })
                                                        setIsModalOpen(false)
                                                    }
                                                })
                                            }}>
                                            Xóa gói cước
                                        </Button>
                                    </Form.Item>
                                )}
                            </>
                        )}
                    </Form>
                </Spin>
            </Modal>
        </Spin>
    )
}
