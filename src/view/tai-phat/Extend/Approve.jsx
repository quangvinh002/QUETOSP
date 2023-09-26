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
    Input,
    message,
    Upload,
    DatePicker
} from 'antd'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import {
    EXTEND_PACK_REQUESTS,
    CREATE_EXTEND_REQUEST,
    UPDATE_EXTEND_REQUEST,
    DELETE_EXTEND_REQUESTS,
    UPLOAD_FILE_EXTEND
} from '@/constants'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getUserInfo, formatDate } from 'helpers'
import { DocumentUpload } from 'iconsax-react'
import { DeleteFilled, SyncOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { Column } = Table
const { Title } = Typography

const user = getUserInfo()
const extendPacks = JSON.parse(localStorage.getItem('@extendPacks'))

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
    const [getPackCodeList] = useLazyQuery(EXTEND_PACK_REQUESTS)
    const [createPackRequest] = useMutation(CREATE_EXTEND_REQUEST)
    const [updatePackRequest] = useMutation(UPDATE_EXTEND_REQUEST)
    const [deletePackRequest] = useMutation(DELETE_EXTEND_REQUESTS)
    const [uploadFileExtend] = useMutation(UPLOAD_FILE_EXTEND)
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
                                ? `sms:909&body=GH%20${record?.pack_code}%20${record?.phone_number}`
                                : `sms:909?body=GH%20${record?.pack_code}%20${record?.phone_number}`
                        }>
                        {text}
                    </a>
                ) : (
                    text
                )
        },
        {
            title: 'NGƯỜI TẠO',
            key: ['requestUser', 'name']
        },
        {
            title: 'NGÀY TẠO',
            render: (text, record) => {
                return <span>{`${formatDate(record?.created_at, false)}`}</span>
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
                ) : record?.status === 2 ? (
                    record?.approvedBy?.name
                ) : null
        },
        {
            title: 'KHÔNG DUYỆT',
            render: (text, record) =>
                record?.status === 1 ? (
                    user?.role < 3 ? (
                        <Button
                            danger
                            size="small"
                            onClick={() => {
                                deleteMultiple([record?.id])
                            }}>
                            Không duyệt
                        </Button>
                    ) : null
                ) : record?.status === 3 ? (
                    record?.approvedBy?.name
                ) : null
        },
        user?.role < 3
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
                    if (response?.data?.deleteExtendPackRequest) {
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
                limit,
                from_date: filter?.from_date?.local().format('YYYY-MM-DD'),
                to_date: filter?.to_date?.local().format('YYYY-MM-DD')
            }
        })
            .then((res) => {
                const { data, total } = res?.data?.ExtendPackRequestList
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

    const approvePack = (id, status) => {
        setLoading(true)
        updatePackRequest({
            variables: {
                id,
                status
            }
        })
            .then((res) => {
                if (res?.data?.updateExtendPackRequest?.pack_code) {
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
            .catch((error) => {
                message.open({
                    content:
                        error?.graphQLErrors[0]?.debugMessage || error?.message,
                    type: 'error'
                })
            })
            .finally(() => setLoading(false))
    }

    const newPack = (values) => {
        const { pack_code, phone_number } = values

        setLoading(true)
        createPackRequest({
            variables: {
                pack_code,
                phone_number
            }
        })
            .then((res) => {
                if (res?.data?.createExtendPackRequest?.pack_code) {
                    setData([
                        {
                            ...values,
                            created_at: new Date(),
                            requestUser: { name: user?.name }
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
            .catch((error) => {
                message.open({
                    content:
                        error?.graphQLErrors[0]?.debugMessage || error?.message,
                    type: 'error'
                })
            })
            .finally(() => {
                setIsModalOpen(false)
                setLoading(false)
                form.resetFields()
            })
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

            const successData = []
            const errorData = []
            const listData = data?.map((i) => {
                let phoneNumber = Object.values(i)[0]
                const code = Object.values(i)[1]
                const commission = Object.values(i)[2]
                const createdAt = Object.values(i)[3]

                phoneNumber =
                    phoneNumber.substring(0, 2) === '84'
                        ? '0' + phoneNumber.slice(2)
                        : phoneNumber

                if (!dayjs(createdAt, 'MM/DD/YYYY').isValid()) {
                    message.error(
                        'Định dạng ngày tháng năm không hợp lệ (tháng/ngày/năm)'
                    )
                    return false
                }

                if (parseInt(commission) > 0) {
                    successData.push({
                        phone_number: phoneNumber?.trim(),
                        code,
                        created_at: dayjs(createdAt)
                            ?.local()
                            .format('YYYY-MM-DD')
                    })
                } else {
                    errorData.push({
                        phone_number: phoneNumber?.trim(),
                        code,
                        created_at: dayjs(createdAt)
                            ?.local()
                            .format('YYYY-MM-DD')
                    })
                }

                return true
            })

            console.log('successData', successData)

            setLoading(true)
            uploadFileExtend({
                variables: {
                    successData,
                    errorData
                }
            })
                .then((res) => {
                    if (res?.data?.uploadExtendFile) {
                        message.success('Upload file thành công')
                        // window.location.reload()
                    } else {
                        message.error('Upload file thất bại')
                    }
                })
                .catch((err) => {
                    message.error('Upload file thất bại')
                })
                .finally(() => setLoading(false))
        }

        reader.readAsArrayBuffer(file)

        return false
    }

    const props = {
        accept: '.csv, .xls, .xlsx',
        showUploadList: false,
        beforeUpload(file, fileList) {
            if (file) {
                fileUpload(file)
            } else if (file.status === 'error') {
                message.error(`${file.name} file upload failed.`)
            }
        }
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
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
        </Row>
    )

    return (
        <>
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Gia hạn"
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
                                        style={{ marginRight: 10 }}
                                        onClick={showModal}>
                                        <DocumentUpload
                                            color="#fff"
                                            variant="Bulk"
                                        />
                                        <span className="hp-ml-8">
                                            Tạo yêu cầu
                                        </span>
                                    </Button>
                                    <Upload {...props}>
                                        <Button block>
                                            <DocumentUpload variant="Bulk" />
                                            <span className="hp-ml-8">
                                                Tải lên file excel
                                            </span>
                                        </Button>
                                    </Upload>
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
                        title={() => filterHeader}
                        pagination={false}
                        loading={loading}
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

const NewModal = ({ isModalOpen, setIsModalOpen, loading, form, newPack }) => (
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
                    rules={[{ required: true, message: 'Vui lòng nhập gói!' }]}>
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
