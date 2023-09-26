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
    PAY_DEBT_REQUESTS,
    CREATE_PAY_DEBT,
    UPDATE_PAY_DEBT,
    DELETE_PAY_DEBT,
    currencyFormatter,
    toCurrency
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getUserInfo, formatDate } from 'helpers'
import { DocumentUpload } from 'iconsax-react'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { Title } = Typography

const { Column } = Table
const branches = JSON.parse(localStorage.getItem('@branches'))
const user = getUserInfo()

export default function Inventory({}) {
    const [data, setData] = useState([])
    const [sumData, setSumData] = useState([])
    const [payDebtData, setPayDebtData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState({
        from_date: dayjs().subtract(7, 'day'),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [getList] = useLazyQuery(PAY_DEBT_REQUESTS)
    const [createPayDebt] = useMutation(CREATE_PAY_DEBT)
    const [updatePayDebt] = useMutation(UPDATE_PAY_DEBT)
    const [deletePayDebt] = useMutation(DELETE_PAY_DEBT)

    const [form] = Form.useForm()
    const uniqueSum = [...new Set(sumData.map((item) => item?.display_name))]
    const columns = [
        {
            title: 'STT',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'CHI NHÁNH',
            key: ['branch', 'display_name']
        },
        {
            title: 'NGƯỜI TẠO',
            key: ['user', 'name']
        },
        {
            title: 'NGÀY THANH TOÁN',
            render: (text, record) => {
                return <span>{`${formatDate(record?.created_at)}`}</span>
            }
        },
        {
            title: 'TIỀN ĐÃ THANH TOÁN',
            key: 'amount',
            render: (text, record) => toCurrency(text)
        },
        {
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
                    record?.approved?.name
                )
        },
        {
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
        }
    ]

    useEffect(() => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('pack-request/report-pay-debt', {
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD'),
                branch_id: filter?.branch_id
            })
                .then((res) => {
                    setSumData(res?.data?.data)
                    setPayDebtData(res?.data?.pay_debt_revenue)
                })
                .finally(() => setLoading(false))
        } else {
            setSumData([])
        }
    }, [filter])

    const deleteMultiple = (ids) => {
        if (ids) {
            setLoading(true)
            deletePayDebt({
                variables: {
                    ids
                }
            })
                .then((response) => {
                    if (response?.data?.deletePayDebtRequest) {
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

    useEffect(() => {
        setLoading(true)
        getList({
            variables: {
                ...filter,
                page,
                limit
            }
        })
            .then((res) => {
                if (res?.data?.PayDebtRequestList) {
                    const { data, total } = res?.data?.PayDebtRequestList
                    setData(data)
                    setTotal(total)
                } else {
                    setData([])
                    setTotal(0)
                }
            })
            .finally(() => setLoading(false))
    }, [page, limit, filter])

    const onPageChange = (current, _pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (_page, pageSize) => {
        setLimit(pageSize)
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Chi nhánh</Title>
                <Select
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
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Từ ngày</Title>
                <DatePicker
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
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Đến ngày</Title>
                <DatePicker
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
            </Col>

            <Col span={24}>
                <Table
                    loading={loading}
                    size="small"
                    bordered
                    dataSource={uniqueSum}
                    scroll={{
                        x: '100%'
                    }}
                    pagination={false}
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell
                                    index={0}
                                    colSpan={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfLoan)}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfRevenue)}
                                    </span>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}>
                                        {toCurrency(sumOfLoan - sumOfRevenue)}
                                    </span>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}>
                    <Column
                        title="Chi nhánh"
                        render={(text, record) => (
                            <span>{record || 'Tổng'}</span>
                        )}
                    />
                    <Column
                        title="Tổng nợ"
                        render={(text, record) => {
                            const branchReveneus = sumData?.filter(
                                (i) => i?.display_name === record
                            )

                            const sum = branchReveneus?.reduce(
                                (a, b) => a + b?.revenue,
                                0
                            )

                            return <span>{toCurrency(sum)}</span>
                        }}
                    />
                    <Column
                        title="Đã thanh toán"
                        render={(text, record) => {
                            const branchReveneus = payDebtData?.filter(
                                (i) => i?.display_name === record
                            )

                            const sum = branchReveneus?.reduce(
                                (a, b) => a + b?.sum,
                                0
                            )

                            return <span>{toCurrency(sum)}</span>
                        }}
                    />
                    <Column
                        title="Còn lại"
                        render={(text, record) => {
                            const branchReveneus = sumData?.filter(
                                (i) => i?.display_name === record
                            )

                            const sumTotal = branchReveneus?.reduce(
                                (a, b) => a + b?.revenue,
                                0
                            )

                            const branchPays = payDebtData?.filter(
                                (i) => i?.display_name === record
                            )

                            const sumPay = branchPays?.reduce(
                                (a, b) => a + b?.sum,
                                0
                            )

                            return <span>{toCurrency(sumTotal - sumPay)}</span>
                        }}
                    />
                </Table>
            </Col>
        </Row>
    )
    const approvePack = (id, status) => {
        setLoading(true)
        updatePayDebt({
            variables: {
                id,
                status
            }
        })
            .then((res) => {
                if (res?.data?.updatePayDebtRequest?.id) {
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
        const { amount, created_at } = values

        setLoading(true)
        createPayDebt({
            variables: {
                amount: parseInt(amount),
                created_at: created_at.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                if (res?.data?.createPayDebtRequest?.id) {
                    setData([
                        {
                            ...values,
                            created_at: new Date(),
                            requestUser: {
                                name: user?.name
                            }
                        },
                        ...data
                    ])
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

    const sumOfAmount = data?.reduce((acc, cur) => acc + cur?.amount, 0)
    const sumOfLoan = sumData?.reduce((acc, cur) => acc + cur?.revenue, 0)
    const sumOfRevenue = payDebtData?.reduce(
        (acc, cur) => acc + parseInt(cur?.sum),
        0
    )

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Chuyển code"
                            breadCrumbActive="Danh sách yêu cầu"
                        />
                        {user?.role < 3 && (
                            <Col span={24} md={12}>
                                <Row
                                    gutter={[16, 16]}
                                    justify="end"
                                    className="hp-ecommerce-app-inventory-events">
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={showModal}>
                                            <DocumentUpload
                                                color="#fff"
                                                variant="Bulk"
                                            />
                                            <span className="hp-ml-8">
                                                Tạo lệnh chuyển tiền
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
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
        </>
    )
}

const NewModal = ({ isModalOpen, setIsModalOpen, loading, form, newPack }) => {
    return (
        <Modal
            title="Tạo lệnh chuyển tiền"
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

                    <Form.Item label="Ngày :" name="created_at">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Tạo lệnh chuyển tiền
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
