import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Pagination,
    Select,
    Button,
    Table,
    Typography,
    Form,
    Spin,
    Modal,
    InputNumber,
    message,
    DatePicker
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import {
    EXTEND_PACK_HISTORY_PAGING,
    CREATE_EXTEND_PACK_HISTORY,
    UPDATE_EXTEND_PACK_HISTORY
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getUserInfo, formatDate } from 'helpers'
import { ArrowRightOutlined } from '@ant-design/icons'
import { DocumentUpload } from 'iconsax-react'
import ReportAdmin from './ReportAdminInput'
import Axios from '@/Axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { Title } = Typography

const { Column } = Table
const branches = JSON.parse(localStorage.getItem('@branches'))
const user = getUserInfo()
const extendPacks = JSON.parse(localStorage.getItem('@extendPacks'))

export default function Inventory({}) {
    const [data, setData] = useState([])
    const [totalData, setTotalData] = useState([])
    const [sumData, setSumData] = useState([])
    const [selectedPack, setSelectedPack] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSendModalOpen, setIsSendModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState({
        from_date: dayjs(),
        to_date: dayjs()
    })
    const [loading, setLoading] = useState(false)
    const [getPackCodeList] = useLazyQuery(EXTEND_PACK_HISTORY_PAGING)
    const [createPackCode] = useMutation(CREATE_EXTEND_PACK_HISTORY)
    const [updatePackCode] = useMutation(UPDATE_EXTEND_PACK_HISTORY)
    const [form] = Form.useForm()
    const [formSend] = Form.useForm()
    const [formAdd] = Form.useForm()

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
            title: 'SỐ LƯỢNG',
            key: 'amount',
            render: (text, record) => {
                return <span>{`${text > 0 ? '+' : ''}${text}`}</span>
            }
        },
        {
            title: 'NGÀY TẠO',
            render: (text, record) => {
                return <span>{`${formatDate(record?.created_at, false)}`}</span>
            }
        },
        {
            title: 'CHI NHÁNH',
            key: ['branch', 'display_name'],
            render: (text, record) => {
                return <span>{text || 'Kho Admin'}</span>
            }
        }
    ]

    const showModal = () => {
        setIsModalOpen(true)
    }

    useEffect(() => {
        setLoading(true)
        getPackCodeList({
            variables: {
                page,
                limit,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                const { data, total } = res?.data?.ExtendPackHistoryList
                console.log('res = ', res.data)
                setData(data)
                setTotalData(
                    res?.data?.ExtendPackStoreList?.data?.map((i) => {
                        return {
                            ...i,
                            display_name: i?.branch?.display_name || 'Kho Admin'
                        }
                    })
                )
                setTotal(total)
            })
            .finally(() => setLoading(false))
    }, [page, limit, filter])

    useEffect(() => {
        if (filter?.from_date && filter?.to_date) {
            setLoading(true)
            Axios.post('extend-pack/sum-pack-request', {
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            })
                .then((res) => {
                    setSumData(res?.data?.data)
                })
                .finally(() => setLoading(false))
        } else {
            setSumData([])
        }
    }, [filter])

    const onPageChange = (current, _pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (_page, pageSize) => {
        setLimit(pageSize)
    }

    const uniqueSum = [...new Set(sumData.map((item) => item?.display_name))]

    const filterHeader = (
        <Row gutter={[32, 32]}>
            <Col span={24}>
                <Row gutter={[8, 8]}>
                    <Col>
                        <Title level={5}>Chọn ngày: </Title>
                    </Col>
                    <Col span={6}>
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
                    <Col span={6}>
                        <DatePicker
                            style={{
                                width: '100%'
                            }}
                            disabledDate={(current) =>
                                current.isBefore(filter?.from_date)
                            }
                            format="DD-MM-YYYY"
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
                    <Col>
                        <Button
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={() => {
                                setIsSendModalOpen(true)
                            }}>
                            <span className="hp-ml-8">Chuyển gói</span>
                        </Button>
                    </Col>
                </Row>
            </Col>
            {sumData?.length ? (
                <Col span={24}>
                    <Table
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
                                        index={0}></Table.Summary.Cell>
                                    {extendPacks?.map((pack, index) => {
                                        const sum = sumData?.reduce(
                                            (acc, cur) =>
                                                cur?.pack_code === pack?.code
                                                    ? acc + parseInt(cur?.sum)
                                                    : acc,
                                            0
                                        )
                                        return (
                                            <Table.Summary.Cell
                                                index={index + 1}>
                                                <b style={{ fontSize: 18 }}>
                                                    {sum > 0 ? '+' : ''}
                                                    {sum}
                                                </b>
                                            </Table.Summary.Cell>
                                        )
                                    })}
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}>
                        <Column
                            title="Chi nhánh"
                            render={(text, record) => (
                                <span>{record || 'Kho Admin'}</span>
                            )}
                        />
                        {extendPacks?.map((pack) => {
                            return (
                                <Column
                                    title={pack?.code}
                                    render={(text, record) => {
                                        const sum = sumData?.find(
                                            (i) =>
                                                i?.display_name === record &&
                                                i?.pack_code === pack?.code
                                        )?.sum

                                        return (
                                            <span>
                                                {sum
                                                    ? `${
                                                          sum > 0 ? '+' : ''
                                                      }${sum}`
                                                    : ''}
                                            </span>
                                        )
                                    }}
                                />
                            )
                        })}
                    </Table>
                </Col>
            ) : null}
        </Row>
    )

    const sendPack = (values) => {
        const { pack_code, amount, branch_id, date } = values
        updatePackCode({
            variables: {
                pack_code,
                amount,
                branch_id,
                date: date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                if (res?.data?.updateExtendPackHistory?.pack_code) {
                    message.open({
                        content: 'Chuyển gói thành công',
                        type: 'success'
                    })

                    setIsSendModalOpen(false)
                }
            })
            .catch((error) =>
                message.open({
                    content:
                        error?.graphQLErrors[0]?.debugMessage || error?.message,
                    type: 'error'
                })
            )
    }

    const addPack = (values) => {
        const { amount } = values
        if (selectedPack) {
            updatePackCode({
                variables: {
                    id: selectedPack?.id,
                    amount,
                    branch_id: 0
                }
            })
                .then((res) => {
                    if (res?.data?.updateExtendPackHistory?.pack_code) {
                        message.open({
                            content: 'Thêm gói thành công',
                            type: 'success'
                        })
                        setIsAddModalOpen(false)
                    } else {
                        message.open({
                            content: 'Thêm gói thất bại',
                            type: 'error'
                        })
                    }
                })
                .catch((error) =>
                    message.open({
                        content:
                            error?.graphQLErrors[0]?.debugMessage ||
                            error?.message,
                        type: 'error'
                    })
                )
        }
    }

    const newPack = (values) => {
        const { pack_code, amount, date } = values

        setLoading(true)
        createPackCode({
            variables: {
                pack_code,
                amount,
                date: date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                if (res?.data?.createExtendPackHistory?.pack_code) {
                    setData([{ ...values, created_at: date }, ...data])
                    message.open({
                        content: 'Thêm gói thành công',
                        type: 'success'
                    })
                } else {
                    message.open({
                        content: 'Thêm gói thất bại',
                        type: 'error'
                    })
                }
            })
            .catch((err) =>
                message.open({
                    content: 'Thêm gói thất bại',
                    type: 'error'
                })
            )
            .finally(() => {
                setIsModalOpen(false)
                setLoading(false)
            })
    }

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Gia hạn"
                            breadCrumbActive="Danh sách gói"
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
                                                Nhập gói
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col span={24}>
                    <ReportAdmin filter={filter} />
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
                        )}>
                        {columns?.map((i) => (
                            <Column {...i} dataIndex={i?.key} />
                        ))}
                    </Table>
                </Col>
            </Row>
            <NewModal
                selectedPack={selectedPack}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                form={form}
                newPack={newPack}
                loading={loading}
            />
            <SendPackModal
                selectedPack={selectedPack}
                isModalOpen={isSendModalOpen}
                setIsModalOpen={setIsSendModalOpen}
                form={formSend}
                sendPack={sendPack}
                loading={loading}
            />
            <AddPackModal
                selectedPack={selectedPack}
                isModalOpen={isAddModalOpen}
                setIsModalOpen={setIsAddModalOpen}
                form={formAdd}
                addPack={addPack}
                loading={loading}
            />
        </>
    )
}

const NewModal = ({
    selectedPack,
    isModalOpen,
    setIsModalOpen,
    loading,
    form,
    newPack
}) => {
    return (
        <Modal
            title={selectedPack ? 'Cập nhật gói' : 'Thêm gói'}
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
                        label="Loại gói :"
                        rules={[
                            { required: true, message: 'Vui lòng nhập gói!' }
                        ]}>
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
                            options={(extendPacks || []).map((d) => ({
                                value: d?.code,
                                label: d?.code
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng :"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng!'
                            }
                        ]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) =>
                                value?.replace(/\$\s?|(,*)/g, '')
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Ngày nhập: " name="date">
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    {user?.role < 2 && (
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Thêm gói
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Spin>
        </Modal>
    )
}

const SendPackModal = ({
    isModalOpen,
    setIsModalOpen,
    loading,
    form,
    sendPack
}) => {
    return (
        <Modal
            title="Chuyển gói"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}>
            <Spin size="large" spinning={loading}>
                <Form
                    form={form}
                    onFinish={sendPack}
                    layout="vertical"
                    initialValues={{ remember: true }}>
                    <Form.Item
                        name="pack_code"
                        label="Loại gói :"
                        rules={[
                            { required: true, message: 'Vui lòng nhập gói!' }
                        ]}>
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
                            options={(extendPacks || []).map((d) => ({
                                value: d?.code,
                                label: d?.code
                            }))}
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

                    <Form.Item
                        label="Số lượng :"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng!'
                            }
                        ]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) =>
                                value?.replace(/\$\s?|(,*)/g, '')
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Ngày nhập: " name="date">
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    {user?.role < 2 && (
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Chuyển gói
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Spin>
        </Modal>
    )
}

const AddPackModal = ({
    selectedPack,
    isModalOpen,
    setIsModalOpen,
    loading,
    form,
    addPack
}) => {
    return (
        <Modal
            title={`Cộng gói ${selectedPack?.pack_code}`}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}>
            <Spin size="large" spinning={loading}>
                <Form
                    form={form}
                    onFinish={addPack}
                    layout="vertical"
                    initialValues={{ remember: true }}>
                    <Form.Item
                        label="Số lượng :"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng!'
                            }
                        ]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) =>
                                value?.replace(/\$\s?|(,*)/g, '')
                            }
                        />
                    </Form.Item>
                    {user?.role < 2 && (
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Cộng gói
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Spin>
        </Modal>
    )
}
