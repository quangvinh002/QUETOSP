import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Pagination,
    Select,
    Button,
    Table,
    Tag,
    Typography,
    Form,
    Spin,
    Modal,
    Input,
    message
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import {
    CALL_STATUS,
    PACK_CODE_REQUESTS,
    CREATE_PACK_REQUEST,
    UPDATE_PACK_REQUEST,
    DELETE_PACK_REQUESTS
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getUserInfo, formatDate } from 'helpers'
import { DocumentUpload } from 'iconsax-react'
import {
    CheckOutlined,
    RollbackOutlined,
    DeleteFilled,
    SyncOutlined
} from '@ant-design/icons'

const { Title } = Typography

const { Column } = Table
const packs = JSON.parse(localStorage.getItem('@packs'))
const user = getUserInfo()

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone'
    }

    if (/android/i.test(userAgent)) {
        return 'Android'
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS'
    }

    return 'unknown'
}

export default function Inventory({}) {
    const [data, setData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState()
    const [loading, setLoading] = useState(false)
    const [getPackCodeList] = useLazyQuery(PACK_CODE_REQUESTS)
    const [createPackRequest] = useMutation(CREATE_PACK_REQUEST)
    const [updatePackRequest] = useMutation(UPDATE_PACK_REQUEST)
    const [deletePackRequest] = useMutation(DELETE_PACK_REQUESTS)
    const [form] = Form.useForm()

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'GÓI',
            key: 'pack_code',
            sorter: (a, b) => a.pack_code - b.pack_code,
            sortDirections: ['descend']
        },
        {
            title: 'SĐT',
            key: 'phone_number',
            render: (text, record) =>
                user?.role < 3 ? (
                    <a
                        href={
                            getMobileOperatingSystem() === 'iOS'
                                ? `sms:999&body=DKT%20${record?.pack_code}%20${record?.phone_number}`
                                : `sms:999?body=DKT%20${record?.pack_code}%20${record?.phone_number}`
                        }>
                        {text}
                    </a>
                ) : (
                    text
                )
        },
        {
            title: 'LOẠI',
            key: ['type'],
            render: (text, record) =>
                text === 1 ? (
                    <Tag color="processing">Nâng cấp</Tag>
                ) : (
                    <Tag color="error">Gia hạn</Tag>
                )
        },
        {
            title: 'NGƯỜI TẠO',
            key: ['requestUser', 'name']
        },
        {
            title: 'NGÀY TẠO',
            render: (text, record) => {
                return <span>{`${formatDate(record?.created_at)}`}</span>
            }
        },
        {
            title: 'DUYỆT',
            render: (text, record) =>
                record?.status === 1 ? (
                    user?.role < 3 ? (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                approvePack(record?.id, 2)
                            }}>
                            Duyệt
                        </Button>
                    ) : null
                ) : (
                    record?.approvedBy?.name
                )
        },
        {
            title: 'KHÔNG DUYỆT',
            render: (text, record) =>
                record?.status === 1 && user?.role < 3 ? (
                    <Button
                        danger
                        size="small"
                        onClick={() => {
                            deleteMultiple([record?.id])
                        }}>
                        Không duyệt
                    </Button>
                ) : null
        },
        user?.role < 2
            ? {
                  title: 'XÓA',
                  render: (text, record) => (
                      <Button
                          danger
                          icon={<DeleteFilled />}
                          size="small"
                          onClick={() => {
                              deleteMultiple([record?.id])
                          }}
                      />
                  )
              }
            : null
    ]

    const deleteMultiple = (ids) => {
        if (ids) {
            setLoading(true)
            deletePackRequest({
                variables: {
                    ids
                }
            })
                .then((response) => {
                    if (response?.data?.deletePackRequest) {
                        message.success('Xóa yêu cầu thành công')

                        const _data = [...data]
                        const newData = _data.filter(
                            (item) => !ids.includes(item?.id)
                        )
                        setData(newData)
                    } else {
                        message.error('Xóa yêu cầu thất bại')
                    }
                })
                .catch((err) => {
                    message.error(err?.message)
                })
                .finally(() => setLoading(false))
        } else {
            message.error('Vui lòng chọn dòng cần xóa')
        }
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const getData = () => {
        setLoading(true)
        getPackCodeList({
            variables: {
                page,
                limit
            }
        })
            .then((res) => {
                const { data, total } = res?.data?.PackCodeRequestList
                setData(data)
                setTotal(total)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData()
    }, [page, limit, filter])

    const onPageChange = (current, _pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (_page, pageSize) => {
        setLimit(pageSize)
    }

    const filterHeader = (
        <Row gutter={[32, 32]}>
            <Col span={24}>
                <Row gutter={[8, 8]}>
                    <Col span={6}>
                        <Title level={5}>Mã gói cước</Title>
                        <Select
                            allowClear
                            showSearch
                            style={{
                                width: '100%'
                            }}
                            placeholder="Mã gói cước"
                            optionFilterProp="children"
                            onChange={(value) => {
                                setFilter({ ...filter, code: value })
                            }}
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={(packs || []).map((d) => ({
                                value: d.code,
                                label: d.code
                            }))}
                        />
                    </Col>
                    <Col span={6}>
                        <Title level={5}>Loại thuê bao</Title>
                        <Select
                            style={{
                                width: '100%'
                            }}
                            onChange={(value) => {
                                setFilter({ ...filter, phone_type: value })
                            }}
                            placeholder="Loại thuê bao"
                            options={[
                                { value: '', label: 'Tất cả' },
                                { value: 'TT', label: 'TT' },
                                { value: 'TS', label: 'TS' },
                                { value: 'MQ', label: 'MQ' },
                                { value: 'MC', label: 'MC' },
                                { value: 'M365', label: 'M365' },
                                { value: 'QS', label: 'QS' },
                                { value: 'MZ', label: 'MZ' }
                            ]}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[8, 8]}>
                    <Col span={6}>
                        <Title level={5}>Trạng thái chia</Title>
                        <Select
                            style={{
                                width: '100%'
                            }}
                            onChange={(value) => {
                                setFilter({
                                    ...filter,
                                    assign_status: parseInt(value)
                                })
                            }}
                            defaultValue="Tất cả"
                            options={[
                                {
                                    value: null,
                                    label: 'Tất cả'
                                },
                                {
                                    value: 0,
                                    label: 'Chưa chia'
                                },
                                {
                                    value: 1,
                                    label: 'Đã chia'
                                }
                            ]}
                        />
                    </Col>
                    <Col span={6}>
                        <Title level={5}>Trạng thái gọi</Title>
                        <Select
                            style={{
                                width: '100%'
                            }}
                            onChange={(value) => {
                                setFilter({
                                    ...filter,
                                    status: parseInt(value)
                                })
                            }}
                            defaultValue="Tất cả"
                            options={[
                                {
                                    value: null,
                                    label: 'Tất cả'
                                },
                                ...CALL_STATUS
                            ]}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )

    const approvePack = (id, status) => {
        setLoading(true)
        updatePackRequest({
            variables: {
                id,
                status
            }
        })
            .then((res) => {
                if (res?.data?.updatePackRequest?.pack_code) {
                    message.open({
                        content: 'Cập nhật thông tin thành công',
                        type: 'success'
                    })

                    const _data = [...data]
                    const index = _data.findIndex((d) => d?.id === id)
                    if (index > -1) {
                        _data[index].status = status
                        setData(_data)
                    }
                }
            })
            .catch((error) =>
                message.open({
                    content:
                        error?.graphQLErrors[0]?.debugMessage || error?.message,
                    type: 'error'
                })
            )
            .finally(() => setLoading(false))
    }

    const newPack = (values) => {
        const { pack_code, type, phone_number } = values

        setLoading(true)
        createPackRequest({
            variables: {
                pack_code,
                type: parseInt(type),
                phone_number
            }
        })
            .then((res) => {
                if (res?.data?.createPackRequest?.pack_code) {
                    setData([res?.data?.createPackRequest, ...data])
                    message.open({
                        content: 'Tạo yêu cầu thành công',
                        type: 'success'
                    })
                } else {
                    message.open({
                        content: 'Tạo yêu cầu thất bại',
                        type: 'error'
                    })
                }
            })
            .catch((err) =>
                message.open({
                    content: 'Tạo yêu cầu thất bại',
                    type: 'error'
                })
            )
            .finally(() => {
                setIsModalOpen(false)
                setLoading(false)
                form.resetFields()
            })
    }

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Chuyển code"
                            breadCrumbActive="Danh sách yêu cầu"
                        />
                        <Col span={24} md={12}>
                            <Row
                                gutter={[16, 16]}
                                justify="end"
                                className="hp-ecommerce-app-inventory-events">
                                <Col>
                                    <Button
                                        onClick={getData}
                                        shape="circle"
                                        icon={
                                            <SyncOutlined
                                                spin={loading}
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        }
                                    />
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            showModal()
                                        }}>
                                        <DocumentUpload
                                            color="#fff"
                                            variant="Bulk"
                                        />
                                        <span className="hp-ml-8">
                                            Tạo yêu cầu
                                        </span>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Table
                        size="small"
                        bordered
                        dataSource={data}
                        scroll={{
                            x: '100%'
                        }}
                        pagination={false}
                        loading={loading}
                        // title={() => filterHeader}
                        footer={() => (
                            <Pagination
                                pageSize={limit}
                                showSizeChanger
                                onShowSizeChange={onShowSizeChange}
                                total={total}
                                onChange={onPageChange}
                                pageSizeOptions={['50', '100', '500', '1000']}
                            />
                        )}>
                        {columns?.map((i) => (
                            <Column {...i} dataIndex={i?.key} />
                        ))}
                    </Table>
                </Col>
            </Row>
            <NewModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                form={form}
                newPack={newPack}
                loading={loading}
            />
        </>
    )
}

const NewModal = ({ isModalOpen, setIsModalOpen, loading, form, newPack }) => {
    return (
        <Modal
            title="Tạo yêu cầu"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}>
            <Spin size="large" spinning={loading}>
                <Form
                    form={form}
                    onFinish={newPack}
                    layout="vertical"
                    initialValues={{ remember: true }}>
                    <Form.Item
                        name="pack_code"
                        label="Tên gói :"
                        rules={[
                            { required: true, message: 'Vui lòng nhập gói!' }
                        ]}>
                        <Select placeholder="Chọn gói">
                            <Option value="6C90N">6C90N</Option>
                            <Option value="12C90N">12C90N</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="type" label="Loại gói :">
                        <Select placeholder="Loại gói">
                            <Option value="1">Nâng cấp</Option>
                            <Option value="2">Gia hạn</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại :"
                        name="phone_number"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số đt!'
                            }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Tạo yêu cầu
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
