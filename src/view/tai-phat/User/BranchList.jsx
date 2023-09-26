import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Pagination,
    Popconfirm,
    Button,
    Input,
    Table,
    Spin,
    Form,
    Modal,
    message
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import {
    BRANCHES as GET_ALL,
    CREATE_BRANCH as CREATE,
    UPDATE_BRANCH as UPDATE,
    DELETE_BRANCHES as DELETE
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import { DocumentUpload, Trash, Eye } from 'iconsax-react'
import { useBoolean } from 'ahooks'

const { Column } = Table
const userInfo = JSON.parse(localStorage.getItem('@current_user'))

export default function Inventory({}) {
    const [filter, setFilter] = useState({})
    const [data, setData] = useState()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [selectedId, setSelectedId] = useState()
    const [modalLoading, setModalLoading] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const [getAll, { loading }] = useLazyQuery(GET_ALL)
    const [createNew] = useMutation(CREATE)
    const [updateData] = useMutation(UPDATE)
    const [deleteList] = useMutation(DELETE)
    const [showModal, { setTrue, setFalse }] = useBoolean(false)

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'TÊN CHI NHÁNH',
            key: 'name',
            sorter: (a, b) => a.name - b.name,
            sortDirections: ['descend']
        },
        { title: 'SỐ NHÂN VIÊN', key: 'total_members' },
        { title: 'SỐ DATA HIỆN CÓ', key: 'total_subscriptions' },
        userInfo?.role < 2
            ? {
                  title: 'XEM NV',
                  render: (text, record) => (
                      <a
                          href={`/admin/user/list?branch_id=${record?.id}`}
                          target="_blank">
                          <Eye
                              color="#FF8A65"
                              variant="Bulk"
                              onClick={() => {}}
                              style={{ cursor: 'pointer' }}
                          />
                      </a>
                  )
              }
            : null
    ]

    useEffect(() => {
        getAll({
            variables: {}
        }).then((res) => {
            setData(res?.data?.Branches)
        })
    }, [])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const submitFormData = (values) => {
        setModalLoading(true)

        if (selectedId) {
            updateData({
                variables: {
                    ...values,
                    id: selectedId,
                    total_members: parseInt(values?.total_members)
                }
            })
                .then((response) => {
                    if (response?.data?.updateBranch?.id) {
                        message.open({
                            content: 'Cập nhật chi nhánh thành công',
                            type: 'success'
                        })

                        setFalse()
                    }
                })
                .catch((err) => {
                    message.open({
                        content: err?.message,
                        type: 'error'
                    })
                })
                .finally(() => setModalLoading(false))
        } else {
            createNew({
                variables: {
                    ...values,
                    total_members: parseInt(values?.total_members)
                }
            })
                .then((response) => {
                    if (response?.data?.createBranch?.id) {
                        message.open({
                            content: 'Tạo mới chi nhánh thành công',
                            type: 'success'
                        })

                        setFalse()
                    }
                })
                .catch((err) => {
                    message.open({
                        content: err?.message,
                        type: 'error'
                    })
                })
                .finally(() => setModalLoading(false))
        }
    }

    const deleteMultiple = () => {
        if (selectedRowKeys?.length) {
            deleteList({
                variables: {
                    ids: selectedRowKeys
                }
            })
                .then((response) => {
                    if (response?.data?.deleteBranches) {
                        message.success('Xóa chi nhánh thành công')
                    } else {
                        message.error('Xóa chi nhánh thất bại')
                    }
                })
                .catch((err) => {
                    message.error(err?.message)
                })
        } else {
            message.error('Vui lòng chọn dòng cần xóa')
        }
    }

    return (
        <>
            <Row gutter={[32, 32]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Quản lý"
                            breadCrumbActive="Danh sách chi nhánh"
                        />
                        {userInfo?.role < 2 && (
                            <Row justify="end">
                                <Button
                                    type="primary"
                                    onClick={setTrue}
                                    style={{ marginRight: 10 }}>
                                    <DocumentUpload
                                        color="#fff"
                                        variant="Bulk"
                                    />
                                    <span className="hp-ml-8">
                                        Thêm mới chi nhánh
                                    </span>
                                </Button>
                                <Popconfirm
                                    title="Xác nhận thao tác"
                                    onConfirm={deleteMultiple}>
                                    <Button danger onClick={deleteMultiple}>
                                        <Trash color="red" variant="Bulk" />
                                        <span className="hp-ml-8">Xóa</span>
                                    </Button>
                                </Popconfirm>
                            </Row>
                        )}
                    </Row>
                </Col>
                <Col span={24}>
                    <Table
                        bordered
                        dataSource={data}
                        scroll={{
                            x: '100%'
                        }}
                        pagination={false}
                        loading={loading}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    setSelectedId(record?.id)
                                    setTrue()
                                }
                            }
                        }}
                        rowKey={(record) => record.id}
                        rowSelection={{
                            onChange: setSelectedRowKeys
                        }}
                        // title={() => filterHeader}
                        footer={() => (
                            <Pagination
                                pageSize={limit}
                                showSizeChanger
                                onShowSizeChange={onShowSizeChange}
                                total={total}
                                onChange={onPageChange}
                            />
                        )}>
                        {columns?.map((i) => (
                            <Column {...i} dataIndex={i?.key} />
                        ))}
                    </Table>
                </Col>
            </Row>
            <AddNew
                id={selectedId}
                isOpen={showModal}
                onClose={() => {
                    setSelectedId(null)
                    setFalse()
                }}
                onSubmit={submitFormData}
                loading={modalLoading}
                getById={(id) => {
                    const item = data?.find((i) => i?.id === id)
                    return item
                }}
            />
        </>
    )
}

const AddNew = ({ id = null, getById, isOpen, onClose, onSubmit, loading }) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (id) {
            const _data = getById(id)
            form.setFieldsValue({ ..._data })
        } else {
            form.resetFields()
        }
    }, [id])

    return (
        <Modal
            title={id ? 'Cập nhật thông tin' : 'Thêm mới chi nhánh'}
            open={isOpen}
            onCancel={onClose}
            footer={null}>
            <Spin size="large" spinning={loading}>
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <Form.Item
                        label="Tên chi nhánh :"
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

                    <Form.Item label="Số nhân viên :" name="total_members">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item className="hp-mt-16 hp-mb-8">
                        <Button block type="primary" htmlType="submit">
                            {id ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
