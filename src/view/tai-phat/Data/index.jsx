import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Button,
    Upload,
    message,
    Table,
    Tag,
    Spin,
    Modal,
    InputNumber,
    Form,
    Pagination,
    Alert,
    List,
    Typography,
    Popconfirm
} from 'antd'
import {
    PauseOutlined,
    CaretRightOutlined,
    CloseCircleFilled
} from '@ant-design/icons'
import { DocumentUpload, Eye } from 'iconsax-react'
import * as XLSX from 'xlsx'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import exampleImg from '@/assets/images/upload-thue-bao.jpeg'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import {
    CREATE_FILE_UPLOAD,
    FILE_UPLOADEDS,
    BRANCHES,
    UPDATE_FILE_UPLOAD,
    DELETE_FILE_UPLOAD
} from '@/constants'
import DivideData from './DivideMultipleUsersModal'
import { useBoolean } from 'ahooks'
import { getUserInfo, formatDate } from 'helpers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const { Paragraph } = Typography
const { Column } = Table

const userInfo = getUserInfo()

export default function Inventory({ history }) {
    const [isLoading, setIsLoading] = useState(false)
    const [getData] = useLazyQuery(FILE_UPLOADEDS)
    const [createfileUpload] = useMutation(CREATE_FILE_UPLOAD)
    const [updateFileUpload] = useMutation(UPDATE_FILE_UPLOAD)
    const [deleteFileUpload] = useMutation(DELETE_FILE_UPLOAD)
    const [visibleModal, setVisibleModal] = useState(false)
    const [divideRate, setDivideRate] = useState([])
    const [
        visibleDivideModal,
        { setTrue: openDivideModal, setFalse: closeDivideModal }
    ] = useBoolean(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [selectedId, setSelectedId] = useState()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [total, setTotal] = useState(0)
    const [data, setData] = useState()
    const [duplicateDatas, setDuplicateDatas] = useState()
    const [wrongDateFormat, setWrongDateFormat] = useState()

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'TÊN FILE',
            key: 'file_name',
            render: (text) => (
                <p
                    style={{
                        whiteSpace: 'nowrap',
                        maxWidth: '20ch',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }}>
                    {text}
                </p>
            )
        },

        {
            title: 'NHÂN VIÊN',
            key: 'total_assigns',
            render: (text, record) => (
                <Button
                    style={{ width: 150 }}
                    type="primary"
                    size="small"
                    onClick={() => {
                        divideMultiple(record?.id)
                    }}>
                    {`Chia data: ${text || 0}`}
                </Button>
            )
        },
        {
            title: 'DỮ LIỆU',
            key: 'total_subscriptions',
            render: (text, record) =>
                record?.total_active_subscriptions ===
                record?.total_subscriptions ? (
                    <Tag color="#108ee9">Đã lấy hết số</Tag>
                ) : (
                    <Tag>{`Tổng: ${record?.total_active_subscriptions}/${record?.total_subscriptions}`}</Tag>
                )
        },
        {
            title: 'LẤY SỐ',
            key: 'activated',
            render: (text, record) =>
                text ? (
                    <Popconfirm
                        title="Xác nhận thao tác"
                        onConfirm={() => {
                            toggleFileStatus(record?.id, 0)
                        }}>
                        <Button
                            danger
                            type="primary"
                            icon={<PauseOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                ) : (
                    <Popconfirm
                        title="Xác nhận thao tác"
                        onConfirm={() => {
                            toggleFileStatus(record?.id, 1)
                        }}>
                        <Button
                            type="primary"
                            icon={<CaretRightOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                )
        },
        {
            title: '',
            key: 'id',
            render: (text, record) => (
                <Popconfirm
                    title="Xác nhận xóa file này?"
                    onConfirm={() => {
                        removeFile(record?.id)
                    }}>
                    <Button
                        danger
                        type="text"
                        icon={<CloseCircleFilled />}
                        size="small"
                    />
                </Popconfirm>
            )
        },
        {
            title: '',
            key: 'delete',
            render: (text, record) => (
                <a
                    href={`/admin/data/subscriptions?file_id=${record?.id}`}
                    target="_blank">
                    <Eye
                        color="#FF8A65"
                        variant="Bulk"
                        style={{ cursor: 'pointer' }}
                    />
                </a>
            )
        },
        {
            title: 'NGƯỜI UPLOAD',
            key: ['upload_by_user', 'name'],
            render: (text) => <Tag>{text}</Tag>
        },
        {
            title: 'THỜI GIAN UPLOAD',
            key: 'created_at',
            render: (text) => <Tag>{formatDate(text)}</Tag>
        }
    ]

    useEffect(() => {
        setIsLoading(true)
        getData({
            variables: {
                page,
                limit
            }
        })
            .then((res) => {
                const { data, total } = res?.data?.FileUploadHistories
                setData(data)
                setTotal(total)
            })
            .finally(() => setIsLoading(false))
    }, [page, limit])

    const onPageChange = (current, _pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (_page, pageSize) => {
        setLimit(pageSize)
    }

    const openModal = () => {
        setVisibleModal(true)
    }

    const closeModal = () => {
        setVisibleModal(false)
    }

    const fileUpload = (file) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            var workbook = XLSX.read(e.target.result)
            var first_ws = workbook.Sheets[workbook.SheetNames[0]]
            const data = XLSX.utils.sheet_to_json(first_ws, {
                raw: false,
                dateNF: 'MM/DD/YYYY',
                header: 0,
                defval: ''
            })

            const wrongList = []
            const listData = data?.map((i) => {
                const phoneNumber = Object.values(i)[0]
                const packCode = Object.values(i)[1]
                const firstRegisterDate = dayjs(
                    Object.values(i)[2],
                    'MM/DD/YYYY'
                ).isValid()
                    ? dayjs(Object.values(i)[2]).format('YYYY-MM-DD').toString()
                    : wrongList.push(phoneNumber)

                const phone_type = Object.values(i)[4]
                const expired_date = dayjs(
                    Object.values(i)[3],
                    'MM/DD/YYYY'
                ).isValid()
                    ? dayjs(Object.values(i)[3]).format('YYYY-MM-DD').toString()
                    : wrongList.push(phoneNumber)

                return {
                    phone_number: phoneNumber,
                    phone_type: phone_type,
                    code: packCode,
                    first_register_date: firstRegisterDate,
                    expired_date: expired_date
                }
            })
            setIsLoading(true)

            if (wrongList?.length) {
                setWrongDateFormat(wrongList)
                message.error('Ngày tháng không đúng định dạng')
                setIsLoading(false)
                closeModal()
                return
            }
            //Check Duplicate Items
            const shuffleData = listData?.sort(function () {
                return Math.random() - 0.5
            })
            createfileUpload({
                variables: {
                    file_name: file?.name,
                    list: shuffleData,
                    divideRate
                }
            })
                .then((res) => {
                    if (res?.data?.createFileUploadedHistory) {
                        const { id, duplicateDatas } =
                            res?.data?.createFileUploadedHistory
                        if (id) {
                            setDuplicateDatas([])
                            message.success('Upload file thành công')
                        } else if (duplicateDatas?.length) {
                            setDuplicateDatas(duplicateDatas)
                            message.error('Data bị trùng vui lòng kiểm tra lại')
                        }
                    } else {
                        message.error('Upload file thất bại 1')
                    }
                })
                .catch((err) => {
                    const errors = err.graphQLErrors
                        .filter((error) =>
                            error.debugMessage?.includes('Duplicate entry')
                        )
                        ?.map((e) => e.debugMessage.match(/'([^']+)'/)[1])

                    setDuplicateDatas(errors)
                })
                .finally(() => {
                    setIsLoading(false)
                    closeModal()
                })
        }

        reader.readAsArrayBuffer(file)

        return false
    }

    const divideMultiple = (fileId) => {
        setSelectedId(fileId)
        openDivideModal()
    }

    const toggleFileStatus = (id, activated) => {
        updateFileUpload({
            variables: {
                id,
                activated
            }
        })
            .then((res) => {
                if (res?.data?.updateFileUploadedHistory) {
                    message.success('Cập nhật file thành công')
                } else {
                    message.error('Cập nhật file thất bại')
                }
            })
            .catch((err) => message.error('Cập nhật file thất bại'))
    }

    const removeFile = (id) => {
        deleteFileUpload({
            variables: {
                id
            }
        })
            .then((res) => {
                if (res?.data?.deleteFileUploadedHistory) {
                    message.success('Xoá file thành công')
                } else {
                    message.error('Xoá file thất bại')
                }
            })
            .catch((err) => message.error('Xoá file thất bại'))
    }

    return (
        <>
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                {/* <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Quản lý"
                            breadCrumbActive="Thêm data"
                        />

                        <Col span={24} md={12}>
                            <Row
                                gutter={[16, 16]}
                                justify="end"
                                className="hp-ecommerce-app-inventory-events">
                                <Col>
                                    <Button type="primary" onClick={openModal}>
                                        <DocumentUpload
                                            color="#fff"
                                            variant="Bulk"
                                        />
                                        <span className="hp-ml-8">
                                            Tải lên file excel
                                        </span>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col> */}
                {duplicateDatas?.length || wrongDateFormat?.length ? (
                    <Col span={24}>
                        <Alert
                            closable
                            message={
                                duplicateDatas?.length
                                    ? 'Data bị trùng'
                                    : 'Số điện thoại không đúng định dạng'
                            }
                            description={
                                <List
                                    grid={{
                                        gutter: 16,
                                        xs: 1,
                                        sm: 2,
                                        md: 4,
                                        lg: 4,
                                        xl: 6,
                                        xxl: 3
                                    }}
                                    dataSource={
                                        duplicateDatas || wrongDateFormat
                                    }
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Paragraph copyable>
                                                {item}
                                            </Paragraph>
                                        </List.Item>
                                    )}
                                />
                            }
                            type="error"
                            showIcon
                        />
                    </Col>
                ) : null}
                <Col span={24}>
                    <h5>Mẫu file tải lên (định dạng THÁNG / NGÀY / NĂM)</h5>
                    <img src={exampleImg} />
                    <Button type="primary" onClick={openModal}>
                        <DocumentUpload color="#fff" variant="Bulk" />
                        <span className="hp-ml-8">Tải lên file excel</span>
                    </Button>
                </Col>

                <Col span={24} className="hp-ecommerce-app-inventory">
                    <Table
                        size="small"
                        bordered
                        dataSource={data}
                        scroll={{
                            x: '100%'
                        }}
                        pagination={false}
                        loading={isLoading}
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
            <ModalUpload
                isOpen={visibleModal}
                onClose={closeModal}
                fileUpload={fileUpload}
                loading={isLoading}
                setDivideRate={setDivideRate}
                divideRate={divideRate}
            />
            <DivideData
                isOpen={visibleDivideModal}
                onClose={closeDivideModal}
                loading={modalLoading}
                setLoading={setModalLoading}
                fileId={selectedId}
            />
        </>
    )
}

const ModalUpload = ({
    isOpen,
    onClose,
    fileUpload,
    loading,
    setDivideRate,
    divideRate
}) => {
    const { data } = useQuery(BRANCHES)

    const branches =
        userInfo?.role === 2
            ? data?.Branches?.filter((i) => i?.id === userInfo?.branch_id)
            : data?.Branches

    useEffect(() => {
        if (data?.Branches) {
            const list = data?.Branches?.map((i) => {
                return {
                    id: i?.id,
                    rate: 0
                }
            })
            setDivideRate(list)
        }
    }, [data?.Branches])

    const validateBeforeUpload = (file) => {
        const isAnyEmpty = divideRate.some((item) => item?.rate < 0)

        if (isAnyEmpty) {
            message.open({
                content: 'Chưa nhập tỷ lệ chia',
                type: 'error'
            })
            return
        }

        const totalRate = divideRate.reduce((acc, item) => acc + item.rate, 0)
        if (totalRate !== 100) {
            message.open({
                content: 'Tổng tỷ lệ chia phải bằng 100',
                type: 'error'
            })
            return
        }
        fileUpload(file)
    }
    return (
        <Modal
            title="Upload file data"
            open={isOpen}
            onCancel={onClose}
            footer={
                <Upload
                    accept=".xls, .xlsx"
                    showUploadList={false}
                    action={null}
                    beforeUpload={validateBeforeUpload}>
                    <Button type="primary">
                        <DocumentUpload color="#fff" variant="Bulk" />
                        <span className="hp-ml-8">Tải lên file excel</span>
                    </Button>
                </Upload>
            }>
            <Spin size="large" spinning={loading}>
                {branches?.map((i) => {
                    const findItem = divideRate?.find(
                        (item) => item?.id === i?.id
                    )
                    const isValid = findItem?.rate > -1

                    return (
                        <Form.Item
                            hasFeedback
                            validateStatus={isValid ? 'success' : 'error'}>
                            <InputNumber
                                prefix={i?.name + ': '}
                                addonAfter="%"
                                style={{
                                    width: '100%'
                                }}
                                min={0}
                                max={100}
                                onChange={(value) => {
                                    const list = divideRate?.map((item) => {
                                        if (item?.id === i?.id) {
                                            return {
                                                id: item?.id,
                                                rate: value
                                            }
                                        }
                                        return item
                                    })
                                    setDivideRate(list)
                                }}
                            />
                        </Form.Item>
                    )
                })}
            </Spin>
        </Modal>
    )
}
