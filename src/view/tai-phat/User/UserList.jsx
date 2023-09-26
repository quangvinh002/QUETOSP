import React, { useState } from 'react'
import { Row, Col, Button, message, Popconfirm } from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import { CREATE_USER, UPDATE_USER, DELETE_USERS } from '@/constants'
import { useMutation } from '@apollo/client'
import { DocumentUpload, Trash } from 'iconsax-react'
import { useBoolean } from 'ahooks'
import NewUserModal from './NewUserModal'
import UserTable from './Users'

export default function Inventory({}) {
    const [branches, setBranches] = useState([])
    const [data, setData] = useState()
    const [selectedId, setSelectedId] = useState()
    const [modalLoading, setModalLoading] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const [createUser] = useMutation(CREATE_USER)
    const [updateUser] = useMutation(UPDATE_USER)
    const [deleteUsers] = useMutation(DELETE_USERS)
    const [showModal, { setTrue, setFalse }] = useBoolean(false)

    const createNewUser = (values) => {
        setModalLoading(true)

        if (selectedId) {
            updateUser({
                variables: {
                    id: selectedId,
                    ...values
                }
            })
                .then((response) => {
                    if (response?.data?.updateUser?.id) {
                        message.open({
                            content: 'Cập nhật nhân viên thành công',
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
            createUser({
                variables: {
                    ...values
                }
            })
                .then((response) => {
                    if (response?.data?.createUser?.id) {
                        message.open({
                            content: 'Tạo mới nhân viên thành công',
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
            deleteUsers({
                variables: {
                    ids: selectedRowKeys
                }
            })
                .then((response) => {
                    if (response?.data?.deleteUsers) {
                        message.success('Xóa nhân viên thành công')
                    } else {
                        message.error('Xóa nhân viên thất bại')
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
                            breadCrumbActive="Danh sách tài khoản"
                        />
                        <Row justify="end">
                            <Button
                                type="primary"
                                onClick={setTrue}
                                style={{ marginRight: 10 }}>
                                <DocumentUpload color="#fff" variant="Bulk" />
                                <span className="hp-ml-8">
                                    Thêm mới nhân viên
                                </span>
                            </Button>
                            <Popconfirm
                                title="Xác nhận thao tác"
                                onConfirm={deleteMultiple}>
                                <Button danger>
                                    <Trash color="red" variant="Bulk" />
                                    <span className="hp-ml-8">Xóa</span>
                                </Button>
                            </Popconfirm>
                        </Row>
                    </Row>
                </Col>
                <Col span={24}>
                    <UserTable
                        setSelectedId={setSelectedId}
                        data={data}
                        setData={setData}
                        selectedId={selectedId}
                        setTrue={setTrue}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}
                    />
                </Col>
            </Row>
            <NewUserModal
                id={selectedId}
                isOpen={showModal}
                onClose={() => {
                    setSelectedId(null)
                    setFalse()
                }}
                onSubmit={createNewUser}
                loading={modalLoading}
                branches={branches}
                getById={(id) => {
                    const item = data?.find((i) => i?.id === id)
                    return item
                }}
            />
        </>
    )
}
