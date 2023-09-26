import React, { useEffect, useState } from 'react'
import {
    List,
    Button,
    Input,
    Spin,
    Form,
    Modal,
    message,
    InputNumber
} from 'antd'
import { DIVIDE_SUBCRIPTIONS_TO_USERS, FILE_UPLOADED } from '@/constants'
import { useMutation, useLazyQuery } from '@apollo/client'
import UserTable from '@/view/tai-phat/User/Users'
import { useBoolean } from 'ahooks'

const DivideData = ({ isOpen, onClose, loading, fileId }) => {
    const [divideFileToUsers] = useMutation(DIVIDE_SUBCRIPTIONS_TO_USERS)
    const [getFileDetail] = useLazyQuery(FILE_UPLOADED)
    const [data, setData] = useState([])
    const [selectedId, setSelectedId] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [lastStep, { setTrue, setFalse }] = useBoolean(false)

    useEffect(() => {
        if (fileId) {
            getFileDetail({
                variables: {
                    id: fileId
                }
            })
                .then((response) => {
                    if (response?.data?.FileUploadHistory?.id) {
                        const { total_assigns, assigns } =
                            response?.data?.FileUploadHistory
                        if (total_assigns > 0) {
                            const selectedUsers = []
                            assigns?.forEach((assign) => {
                                selectedUsers?.push(assign?.user_id)
                            })

                            setSelectedRowKeys(selectedUsers)
                        }
                    }
                })
                .catch((err) => {
                    message.open({
                        content: err?.message,
                        type: 'error'
                    })
                })
        }
    }, [fileId])

    const selectMultiple = () => {
        const selected = data.filter((item) =>
            selectedRowKeys.includes(item.id)
        )

        if (selected?.length) {
            setSelectedUsers(selected)
            setTrue()
        } else {
            message.open({
                content: 'Chưa chọn nhân viên',
                type: 'error'
            })
        }
    }

    const divideData = () => {
        if (!fileId) {
            message.open({
                content: 'Chưa chọn file',
                type: 'error'
            })
            return
        }

        const list = selectedUsers.map((item) => {
            return item?.id
        })

        divideFileToUsers({
            variables: {
                fileId,
                list
            }
        })
            .then((response) => {
                if (response?.data?.divideFileToUsers?.id) {
                    message.open({
                        content: 'Cập nhật thành công',
                        type: 'success'
                    })

                    // window.location.reload()
                    // setSelectedUsers([])
                    // setFalse()
                    // onClose()
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
            width={'100%'}
            title={'Chia dữ liệu cho nhân viên'}
            open={isOpen}
            onCancel={() => {
                setSelectedUsers([])
                setFalse()
                onClose()
            }}
            footer={
                lastStep ? (
                    <Button type="primary" onClick={divideData}>
                        Chia dữ liệu
                    </Button>
                ) : (
                    <Button type="primary" onClick={selectMultiple}>
                        Chia dữ liệu
                    </Button>
                )
            }>
            <Spin size="large" spinning={loading}>
                {lastStep ? (
                    <List
                        size="small"
                        bordered
                        dataSource={selectedUsers}
                        renderItem={(item) => (
                            <List.Item>{item?.name}</List.Item>
                        )}
                    />
                ) : (
                    <UserTable
                        setSelectedId={setSelectedId}
                        data={data}
                        setData={setData}
                        selectedId={selectedId}
                        setTrue={() => {}}
                        selectedRowKeys={selectedRowKeys}
                        setSelectedRowKeys={setSelectedRowKeys}
                        isHide={true}
                        showAll={true}
                        extendFilter={{ role: 3, activated: 1 }}
                    />
                )}
            </Spin>
        </Modal>
    )
}

export default DivideData
