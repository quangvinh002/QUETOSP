import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Pagination,
    Select,
    Button,
    Table,
    DatePicker,
    Typography,
    Form,
    Spin,
    Modal,
    InputNumber,
    message
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import {
    TOPUP_REQUESTS,
    CREATE_TOPUP,
    UPDATE_TOPUP,
    DELETE_TOPUP,
    currencyFormatter,
    CHANNELS,
    toCurrency
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getUserInfo, formatDate } from 'helpers'
import { DocumentUpload } from 'iconsax-react'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import FilterItem from 'layout/components/FilterItem'
dayjs.extend(utc)

const { Title } = Typography
const { Column } = Table
const branches = JSON.parse(localStorage.getItem('@branches'))
const discount = localStorage.getItem('@discount')
const user = getUserInfo()

export default function Inventory({}) {
    const [data, setData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalDiscountOpen, setIsModalDiscountOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState({
        from_date: dayjs().subtract(3, 'day'),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [getList] = useLazyQuery(TOPUP_REQUESTS)
    const [createTopup] = useMutation(CREATE_TOPUP)
    const [updateTopup] = useMutation(UPDATE_TOPUP)
    const [deleteTopup] = useMutation(DELETE_TOPUP)
    const [form] = Form.useForm()
    const [formDiscount] = Form.useForm()

    useEffect(() => {
        setLoading(true)
        Axios.get('chiet-khau')
            .then((res) => {
                formDiscount.setFieldsValue({
                    discount: res?.data?.discount
                })
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (discount) {
            formDiscount.setFieldsValue({
                discount
            })
        } else {
            formDiscount.resetFields()
        }
    }, [discount])

    const columns = [
        {
            title: 'STT',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'NGÀY TẠO',
            render: (text, record) => {
                return <span>{`${formatDate(record?.created_at, false)}`}</span>
            }
        },
        {
            title: 'CHI NHÁNH',
            key: ['branch', 'display_name']
        },
        {
            title: 'KÊNH NẠP',
            key: ['type'],
            render(text, record) {
                return text === 1 ? 'Mặc định' : 'EZ'
            }
        },
        {
            title: 'SỐ TIỀN',
            key: 'amount',
            render: (text, record) => toCurrency(text)
        },
        user?.role < 3 && {
            title: 'DUYỆT',
            render: (text, record) =>
                record?.status === 1 ? (
                    user?.role < 2 ? (
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
        user?.role < 3 && {
            title: 'KHÔNG DUYỆT',
            render: (text, record) =>
                record?.status === 1 && user?.role < 2 ? (
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
        user?.role < 3 && {
            title: 'XÓA',
            render: (text, record) =>
                user?.role < 2 ? (
                    <Button
                        type="danger"
                        size="small"
                        onClick={() => {
                            deleteMultiple([record?.id])
                        }}>
                        X
                    </Button>
                ) : null
        }
    ]

    const deleteMultiple = (ids) => {
        if (ids) {
            setLoading(true)
            deleteTopup({
                variables: {
                    ids
                }
            })
                .then((response) => {
                    if (response?.data?.deleteTopupRequest) {
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

    const showDiscountModal = () => {
        setIsModalDiscountOpen(true)
    }

    const getData = () => {
        setLoading(true)
        getList({
            variables: {
                ...filter,
                page,
                limit,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                if (res?.data?.TopupRequestList) {
                    const { data, total } = res?.data?.TopupRequestList
                    setData(data)
                    setTotal(total)
                } else {
                    setData([])
                    setTotal(0)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData()
    }, [page, limit])

    const onPageChange = (current, _pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (_page, pageSize) => {
        setLimit(pageSize)
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <FilterItem title="Chi nhánh">
                <Select
                    size="small"
                    allowClear
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    placeholder="Chi nhánh"
                    optionFilterProp="children"
                    onChange={(value) => {
                        setFilter({ ...filter, branch_id: value })
                    }}
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    options={branches?.map((d) => ({
                        value: d.id,
                        label: d?.display_name || d?.name
                    }))}
                />
            </FilterItem>
            <FilterItem title="Kênh nạp">
                <Select
                    size="small"
                    allowClear
                    showSearch
                    style={{
                        width: '100%'
                    }}
                    onChange={(value) => {
                        setFilter({ ...filter, channel: value })
                    }}
                    placeholder="Kênh nạp"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    options={CHANNELS}
                />
            </FilterItem>
            <FilterItem title="Từ ngày">
                <DatePicker
                    size="small"
                    style={{
                        width: '100%'
                    }}
                    format="DD-MM-YYYY"
                    placeholder="Từ ngày"
                    value={filter?.from_date}
                    onChange={(date, dateString) => {
                        setFilter({
                            ...filter,
                            from_date: date
                        })
                    }}
                />
            </FilterItem>

            <FilterItem title="Đến ngày">
                <DatePicker
                    size="small"
                    style={{
                        width: '100%'
                    }}
                    format="DD-MM-YYYY"
                    disabledDate={(current) =>
                        current.isBefore(filter?.from_date)
                    }
                    placeholder="Đến ngày"
                    value={filter?.to_date}
                    onChange={(date, dateString) => {
                        setFilter({
                            ...filter,
                            to_date: date
                        })
                    }}
                />
            </FilterItem>
            <FilterItem>
                <Button type="primary" onClick={getData} size="small">
                    Tìm kiếm
                </Button>
            </FilterItem>
        </Row>
    )
    const approvePack = (id, status) => {
        setLoading(true)
        updateTopup({
            variables: {
                id,
                status
            }
        })
            .then((res) => {
                if (res?.data?.updateTopupRequest?.id) {
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
        setLoading(true)
        createTopup({
            variables: {
                ...values,
                created_at: values?.date?.local().format('YYYY-MM-DD'),
                amount: parseInt(values?.amount)
            }
        })
            .then((res) => {
                if (res?.data?.createTopupRequest?.id) {
                    setData([values, ...data])
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

    const editDiscount = (values) => {
        const params = {
            discount: values.discount
        }
        Axios.post('config/discount', params)
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                if (data) {
                    message.open({
                        content: 'Đăng ký thành công',
                        type: 'success'
                    })

                    localStorage.setItem('@discount', values.discount)
                } else {
                    message.error(data?.message || 'Api lỗi xử lý !')
                }
            })
            .finally(() => {
                setIsModalDiscountOpen(false)
                formDiscount.resetFields()
            })
    }

    const sumOfAmount = data?.reduce((acc, cur) => acc + cur?.amount, 0)

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Tiền nạp"
                            breadCrumbActive="Danh sách tiền nạp"
                        />
                        {user?.role === 2 && (
                            <Button
                                type="primary"
                                onClick={showModal}
                                size="small">
                                <DocumentUpload color="#fff" variant="Bulk" />
                                <span className="hp-ml-8">Tạo tiền nạp</span>
                            </Button>
                        )}
                        {user?.role < 2 && (
                            <Button
                                size="small"
                                type="primary"
                                onClick={showDiscountModal}>
                                Sửa chiết khấu
                            </Button>
                        )}
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
                        title={() => filterHeader}
                        footer={() => (
                            <Pagination
                                pageSize={limit}
                                showSizeChanger
                                onShowSizeChange={onShowSizeChange}
                                total={total}
                                onChange={onPageChange}
                                pageSizeOptions={['50', '100', '500', '1000']}
                            />
                        )}
                        summary={() => (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell
                                        index={0}
                                        colSpan={4}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500
                                            }}>
                                            {toCurrency(sumOfAmount)}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={2}
                                        colSpan={2}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
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
            <DiscountModal
                isModalOpen={isModalDiscountOpen}
                setIsModalOpen={setIsModalDiscountOpen}
                form={formDiscount}
                onFinish={editDiscount}
                loading={loading}
            />
        </>
    )
}

const NewModal = ({ isModalOpen, setIsModalOpen, loading, form, newPack }) => {
    return (
        <Modal
            title="Tạo tiền nạp"
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
                        label="Số tiền :"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số tiền!'
                            }
                        ]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            {...currencyFormatter}
                        />
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
                    <Form.Item label="Kênh nạp" name="type">
                        <Select
                            allowClear
                            showSearch
                            style={{
                                width: '100%'
                            }}
                            placeholder="Kênh nạp"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={[
                                { label: 'Mặc định', value: 1 },
                                { label: 'EZ', value: 2 }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Ngày nhập: " name="date">
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Tạo mới
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}

const DiscountModal = ({
    isModalOpen,
    setIsModalOpen,
    loading,
    form,
    onFinish
}) => {
    return (
        <Modal
            title="Chiết khấu"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}>
            <Spin size="large" spinning={loading}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ remember: true }}>
                    <Form.Item
                        label="Chiết khấu :"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập chiết khấu!'
                            }
                        ]}>
                        <InputNumber style={{ width: '100%' }} addonAfter="%" />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
