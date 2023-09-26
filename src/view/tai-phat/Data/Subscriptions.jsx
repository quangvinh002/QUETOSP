import React, { useEffect, useState, useRef } from 'react'
import {
    Row,
    Col,
    Pagination,
    Select,
    Button,
    Table,
    Card,
    Tag,
    DatePicker,
    Typography,
    Form,
    Input,
    message,
    Spin,
    Modal,
    Tooltip
} from 'antd'
import { useBoolean } from 'ahooks'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import {
    SUBCRIPTIONS,
    GET_RANDOM_SUBCRIPTION,
    UPDATE_SUBSCRIPTION,
    CALL_STATUS,
    colors,
    CALL_INPUT_STATUS
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import Countdown from 'react-countdown'
import DivideData from './DivideUsersModal'
import { getUserInfo, formatDate } from 'helpers'
import Axios from '@/Axios'
import { DocumentDownload, InfoCircle } from 'iconsax-react'
import { KHCNResult } from '@/view/tai-phat/Khcn'

const timeOut = 15000
const { Title, Paragraph } = Typography
const { TextArea, Search } = Input
const { Column } = Table
const packs = JSON.parse(localStorage.getItem('@packs'))

const user = getUserInfo()

export default function Inventory({}) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [countDown, setCountDown] = useState(Date.now() + timeOut)
    const [currentSubscription, setCurrentSubscription] = useState()
    const [filter, setFilter] = useState({})
    const [data, setData] = useState()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [getSubscriptions] = useLazyQuery(SUBCRIPTIONS)
    const [getSubscription] = useLazyQuery(GET_RANDOM_SUBCRIPTION)
    const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION)
    const [selectAll, { toggle: toggleSelectAll }] = useBoolean(false)
    const [isUpdated, { setTrue, setFalse }] = useBoolean(true)
    const [visibleModal, { setTrue: openModal, setFalse: closeModal }] =
        useBoolean(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [selected, setSelected] = useState()
    const [note, setNote] = useState()
    const [loadingPickNumber, setLoadingPickNumber] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedPack, setSelectedPack] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNext, setIsNext] = useState(true)

    const [loadingKHCN, setLoadingKHCN] = useState(false)
    const [dataKHCN, setDataKHCN] = useState()
    const [form] = Form.useForm()

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'SỐ ĐT',
            key: 'phone_number',
            render: (text) => (
                <Paragraph copyable style={{ whiteSpace: 'nowrap' }}>
                    {text}
                </Paragraph>
            )
        },
        {
            title: 'TRẠNG THÁI GỌI',
            key: 'status',
            render: (_, record) => {
                const index = CALL_STATUS.findIndex(
                    (item) => item.value === record?.status
                )
                return (
                    <Tag color={colors[index]}>{CALL_STATUS[index]?.label}</Tag>
                )
            }
        },
        { title: 'GHI CHÚ', key: 'user_note' },
        { title: 'GÓI CƯỚC', key: 'code' },
        {
            title: 'NGÀY ĐĂNG KÝ',
            key: 'first_register_date',
            render: (text) =>
                text ? <Tag>{formatDate(text, false)}</Tag> : null
        },
        {
            title: 'NGÀY HẾT HẠN',
            key: 'first_expired_date',
            render: (text) =>
                text ? <Tag>{formatDate(text, false)}</Tag> : null
        },
        {
            title: 'NGÀY LẤY SỐ',
            key: 'assigned_date',
            render: (text) => (text ? <Tag>{formatDate(text)}</Tag> : null)
        },
        // {
        //     title: 'LOẠI',
        //     key: 'phone_type',
        //     sorter: (a, b) => a.phone_type - b.phone_type,
        //     sortDirections: ['descend']
        // },
        // {
        //     title: 'CHU KỲ',
        //     key: 'period'
        // },
        // {
        //     title: 'ĐĂNG KÝ LẦN ĐẦU',
        //     key: 'first_register_date',
        //     render: (text) => <Tag>{text}</Tag>
        // },
        {
            title: 'NHÂN VIÊN',
            key: ['assigned_to_user', 'name'],
            render: (text) => (text ? <Tag>{text}</Tag> : null)
        },
        {
            title: 'CHI NHÁNH',
            key: ['branch', 'display_name'],
            render: (text) => (text ? <Tag>{text}</Tag> : null)
        }
    ]

    useEffect(() => {
        if (selectedPack) {
            form.setFieldsValue({ ...selectedPack })
        } else {
            form.resetFields()
        }
    }, [selectedPack])

    useEffect(() => {
        const windowUrl = window.location.search
        const params = new URLSearchParams(windowUrl)
        const fileId = params.get('file_id')
        if (fileId) {
            setFilter({
                ...filter,
                file_id: parseInt(fileId)
            })
        }
    }, [window.location.search])

    useEffect(() => {
        const windowUrl = window.location.search
        const params = new URLSearchParams(windowUrl)
        const fileId = params.get('file_id')

        setLoading(true)
        getSubscriptions({
            variables: {
                ...filter,
                file_id: fileId ? parseInt(fileId) : filter?.file_id,
                page,
                limit: selectAll ? 0 : limit
            }
        })
            .then((res) => {
                const { data, total } = res?.data?.Subscriptions
                setData(data)
                setTotal(total)
            })
            .finally(() => setLoading(false))
    }, [page, limit, filter, selectAll])

    const onPageChange = (current, _pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (_page, pageSize) => {
        setLimit(pageSize)
    }

    const divideSubscriptions = () => {
        if (selectedRowKeys?.length) {
            openModal()
        } else {
            message.error('Vui lòng chọn thuê bao trước khi chia')
        }
    }

    const updateFormData = (values) => {
        updateData(values, selectedPack)
    }

    const updateStaffData = (values) => {
        updateData(values, currentSubscription)
    }

    const updateData = (values, pack) => {
        if (
            !pack?.phone_number ||
            values?.status === undefined ||
            values?.status === null
        ) {
            message.error('Lỗi ! Vui lòng thử lại')
            return
        }
        const { phone_number, code } = pack
        updateSubscription({
            variables: {
                phone_number,
                code,
                ...values
            }
        })
            .then((res) => {
                if (res?.data?.updateSubscription?.phone_number) {
                    setData([{ ...res?.data?.updateSubscription }, ...data])
                    message.success('Cập nhật trạng thái cuộc gọi thành công')
                    setTrue()
                }
            })
            .finally(() => {
                setIsNext(true)
                setSelected(null)
            })
    }

    const exportExcel = () => {
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'Data.xlsx'

        Axios.post('export/subscriptions', filter, {
            responseType: 'blob'
        })
            .then((res) => {
                link.href = URL.createObjectURL(new Blob([res.data]))
                link.click()
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const filterHeader = (
        <>
            <Row gutter={[8, 8]}>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Title level={5}>Đăng ký lần đầu</Title>
                    <DatePicker
                        style={{
                            width: '100%'
                        }}
                        onChange={(_date, dateString) => {
                            setFilter({
                                ...filter,
                                register_date: dateString
                            })
                        }}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Title level={5}>Ngày hết hạn</Title>
                    <DatePicker
                        style={{
                            width: '100%'
                        }}
                        onChange={(_date, dateString) => {
                            setFilter({
                                ...filter,
                                expired_date: dateString
                            })
                        }}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
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
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
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
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
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
                {user?.role < 3 ? (
                    <>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Title level={5}>Lọc gói cước KHCN</Title>
                            <Select
                                allowClear
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Mã gói cước"
                                optionFilterProp="children"
                                onChange={(value) => {
                                    setFilter({
                                        ...filter,
                                        khcn_code: value
                                    })
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
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Title level={5}>Tải về</Title>
                            <Button onClick={exportExcel} type="primary">
                                <DocumentDownload variant="Bulk" />
                                <span className="hp-ml-8">Tải Excel</span>
                            </Button>
                        </Col>
                    </>
                ) : null}
            </Row>
            {/* <Col span={6}>
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
                    </Col> */}

            {/* <Col span={6}>
                        <Title level={5}>Chọn toàn bộ dữ liệu</Title>
                        <Switch
                            checkedChildren="Chọn tất cả"
                            unCheckedChildren="Chọn tất cả"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                        />
                    </Col>
                    {user?.role < 3 && (
                        <Col span={6}>
                            <Title level={5}></Title>
                            <Button
                                type="primary"
                                onClick={divideSubscriptions}>
                                Chia dữ liệu
                            </Button>
                        </Col>
                    )} */}
            <h5 style={{ marginTop: 10 }}>
                Số dòng đã chọn: {selectedRowKeys?.length}/{total}
            </h5>
        </>
    )

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <Button
                    disabled={!isNext}
                    type="primary"
                    onClick={() => {
                        if (isUpdated) {
                            setCountDown((_prev) => Date.now() + timeOut)
                            setIsNext(false)
                            setLoadingPickNumber(true)
                            getSubscription()
                                .then((res) => {
                                    const data = res?.data?.Subscription
                                    if (data) {
                                        setCurrentSubscription(data)
                                        setNote('')
                                    } else {
                                        setCurrentSubscription(null)

                                        message.error(
                                            'Không tìm được số phù hợp'
                                        )
                                    }
                                })
                                .finally(() => {
                                    setLoadingPickNumber(false)
                                })

                            setFalse()
                        } else {
                            message.error('Chưa cập nhật trạng thái cuộc gọi')
                        }
                    }}>
                    Lấy số
                </Button>
            )
        } else {
            // Render a countdown
            return (
                <span>
                    Lấy số tiếp theo sau 15 giây {minutes}:{seconds}
                </span>
            )
        }
    }

    return (
        <>
            <Row gutter={[8, 8]}>
                {/* <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Quản lý"
                            breadCrumbActive="Danh sách thuê bao"
                        />
                    </Row>
                </Col> */}
                <Spin spinning={loadingPickNumber}>
                    <Col span={24}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Card
                                    title={
                                        <Countdown
                                            date={countDown}
                                            key={countDown}
                                            renderer={renderer}
                                        />
                                    }
                                    style={{ borderRadius: 7 }}>
                                    <Form layout="vertical">
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Form.Item label="Số thuê bao :">
                                                    <Search
                                                        placeholder="Số thuê bao"
                                                        readOnly
                                                        value={
                                                            currentSubscription?.phone_number
                                                        }
                                                        onSearch={() => {
                                                            setLoadingKHCN(true)
                                                            const params = {
                                                                phone_number:
                                                                    currentSubscription?.phone_number
                                                            }

                                                            Axios.post(
                                                                'khcn',
                                                                params
                                                            )
                                                                .then((res) => {
                                                                    if (
                                                                        res?.error
                                                                    ) {
                                                                        message.error(
                                                                            'Lỗi API, vui lòng liên hệ nhà cung cấp'
                                                                        )
                                                                        return
                                                                    }
                                                                    return res
                                                                        ?.data
                                                                        ?.data
                                                                })
                                                                .then(
                                                                    (data) => {
                                                                        setDataKHCN(
                                                                            data
                                                                        )
                                                                    }
                                                                )
                                                                .finally(() => {
                                                                    setLoadingKHCN(
                                                                        false
                                                                    )
                                                                })
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Tài khoản chính :">
                                                    <Input
                                                        placeholder="Tài khoản chính"
                                                        readOnly
                                                        value={
                                                            currentSubscription?.balance
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Loại thuê bao :">
                                                    <Input
                                                        placeholder="Loại thuê bao"
                                                        readOnly
                                                        value={
                                                            currentSubscription?.phone_type
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Gói cước :">
                                                    <Input
                                                        placeholder="Gói cước"
                                                        readOnly
                                                        value={
                                                            currentSubscription?.code
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item label="Ngày đăng ký :">
                                                    <Input
                                                        placeholder="Ngày hết hạn"
                                                        readOnly
                                                        value={
                                                            currentSubscription?.first_register_date
                                                                ? formatDate(
                                                                      currentSubscription?.first_register_date,
                                                                      false
                                                                  )
                                                                : null
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Ngày hết hạn :">
                                                    <Input
                                                        placeholder="Ngày hết hạn"
                                                        readOnly
                                                        value={
                                                            currentSubscription?.first_expired_date
                                                                ? formatDate(
                                                                      currentSubscription?.first_expired_date,
                                                                      false
                                                                  )
                                                                : null
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title="Kết quả gọi"
                                    style={{ borderRadius: 7 }}>
                                    <Row gutter={[8, 8]}>
                                        <Col>
                                            <Tooltip title="Những số không chọn trạng thái sẽ bị thu hồi lại">
                                                <Title level={5}>
                                                    Trạng thái gọi
                                                </Title>
                                            </Tooltip>

                                            <Select
                                                style={{
                                                    width: '100%'
                                                }}
                                                placeholder="Chọn trạng thái"
                                                value={selected}
                                                onChange={(value) => {
                                                    setSelected(value)
                                                }}
                                                options={CALL_INPUT_STATUS}
                                            />
                                        </Col>
                                        <Col>
                                            <Title level={5}>Ghi chú</Title>
                                            <TextArea
                                                rows={2}
                                                placeholder="Ghi chú"
                                                value={note}
                                                onChange={(e) => {
                                                    setNote(e.target.value)
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Button
                                                type="primary"
                                                onClick={() =>
                                                    updateStaffData({
                                                        status: selected,
                                                        user_note: note
                                                    })
                                                }>
                                                Cập nhật
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={24}>
                                <KHCNResult
                                    data={dataKHCN}
                                    loading={loadingKHCN}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Spin>
                <Col span={24}>
                    <Table
                        size="small"
                        rowKey={(record) =>
                            `${record?.phone_number},${record?.code}`
                        }
                        rowSelection={{
                            onChange: (newSelectedRowKeys) => {
                                setSelectedRowKeys(newSelectedRowKeys)
                            }
                        }}
                        bordered
                        dataSource={data}
                        scroll={{
                            x: '100%'
                        }}
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    setSelectedPack(record)
                                    setIsModalOpen(true)
                                }
                            }
                        }}
                        pagination={false}
                        loading={loading}
                        title={() => filterHeader}
                        footer={() =>
                            selectAll ? null : (
                                <Pagination
                                    pageSize={limit}
                                    showSizeChanger
                                    onShowSizeChange={onShowSizeChange}
                                    total={total}
                                    onChange={onPageChange}
                                    pageSizeOptions={[
                                        '50',
                                        '100',
                                        '500',
                                        '1000'
                                    ]}
                                />
                            )
                        }>
                        {columns?.map((i) => (
                            <Column {...i} dataIndex={i?.key} />
                        ))}
                    </Table>
                </Col>
            </Row>
            <DivideData
                isOpen={visibleModal}
                onClose={closeModal}
                loading={modalLoading}
                setLoading={setModalLoading}
                selectedSubscriptions={selectedRowKeys}
            />
            <Modal
                title={selectedPack ? 'Cập nhật' : 'Thêm'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}>
                <Spin size="large" spinning={modalLoading}>
                    <Form
                        form={form}
                        onFinish={updateFormData}
                        layout="vertical"
                        initialValues={{ remember: true }}>
                        <Form.Item label="Trạng thái :" name="status">
                            <Select
                                style={{
                                    width: '100%'
                                }}
                                placeholder="Chọn trạng thái"
                                options={CALL_STATUS}
                            />
                        </Form.Item>

                        <Form.Item label="Ghi chú :" name="user_note">
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    )
}
