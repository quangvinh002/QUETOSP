import React, { useEffect, useState } from 'react'
import { Select, Button, Input, Spin, Form, Modal, message } from 'antd'
import { DIVIDE_SUBCRIPTIONS, ROLES } from '@/constants'
import { useMutation } from '@apollo/client'
import UserTable from '@/view/tai-phat/User/Users'

const DivideData = ({
    isOpen,
    onClose,
    loading,
    setLoading,
    selectedSubscriptions = []
}) => {
    const [divideSubcriptions] = useMutation(DIVIDE_SUBCRIPTIONS)
    const [data, setData] = useState([])
    const [selectedId, setSelectedId] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const divideData = () => {
        if (selectedRowKeys.length === 0) {
            message.open({
                content: 'Chưa chọn nhân viên',
                type: 'error'
            })
            return
        } else {
            console.log('selectedSubscriptions', selectedSubscriptions)
            console.log('selectedRowKeys', selectedRowKeys)

            divideSubcriptions({
                variables: {
                    assign_to_users: selectedRowKeys[0],
                    list: selectedSubscriptions
                }
            })
                .then((response) => {
                    if (response?.data?.divideSubscriptions?.id) {
                        message.open({
                            content: 'Cập nhật nhân viên thành công',
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
    }
    return (
        <Modal
            title={'Chia dữ liệu cho nhân viên'}
            open={isOpen}
            onCancel={onClose}
            footer={
                <Button type="primary" onClick={divideData}>
                    Chia dữ liệu
                </Button>
            }>
            <Spin size="large" spinning={loading}>
                <UserTable
                    selectionType="radio"
                    setSelectedId={setSelectedId}
                    data={data}
                    setData={setData}
                    selectedId={selectedId}
                    setTrue={() => {}}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                />
            </Spin>
        </Modal>
    )
}

export default DivideData
