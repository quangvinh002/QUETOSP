import React, { useEffect, useState } from 'react'
import {
    Pagination,
    Table,
    Tag,
    Row,
    Input,
    Col,
    Select,
    Typography,
    Button,
    Switch
} from 'antd'
import {
    USERS,
    ROLES,
    colors,
    USER_TYPES,
    USER_ACTIVE_TYPES
} from '@/constants'
import { useLazyQuery } from '@apollo/client'
import { DocumentDownload } from 'iconsax-react'
import { useBoolean } from 'ahooks'
import Axios from '@/Axios'

const { Column } = Table
const { Title } = Typography

const branches = JSON.parse(localStorage.getItem('@branches'))
const userInfo = JSON.parse(localStorage.getItem('@current_user'))

export default function Inventory({
    data,
    setData,
    setSelectedId,
    setTrue,
    selectionType = 'checkbox',
    selectedRowKeys,
    setSelectedRowKeys,
    isHide = false,
    showAll = false,
    extendFilter = {}
}) {
    const [filter, setFilter] = useState({})
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50)
    const [total, setTotal] = useState(0)
    const [userCode, setUserCode] = useState()

    const [getUsers] = useLazyQuery(USERS)
    const [loading, setLoading] = useState(false)
    const [selectAll, { toggle: toggleSelectAll }] = useBoolean(false)

    const columns = [
        {
            title: 'STT',
            width: '80px',
            render: (item, record, index) => limit * (page - 1) + (index + 1)
        },
        {
            title: 'HỌ TÊN',
            key: 'name',
            sorter: (a, b) => a.name - b.name,
            sortDirections: ['descend'],
            render: (text) => <Tag>{text}</Tag>
        },
        { title: 'Mã NV', key: 'user_code' },
        {
            title: 'Ca',
            key: 'type',
            render: (text, record) =>
                text ? (
                    <Tag color={colors[text]}>
                        {USER_TYPES.find((i) => i.value === text)?.label}
                    </Tag>
                ) : null
        },
        { title: 'LINE', key: 'line_call' },
        { title: 'SĐT', key: 'phone' },
        {
            title: 'EMAIL',
            key: 'email',
            sorter: (a, b) => a.email - b.email,
            sortDirections: ['descend']
        },
        { title: 'Username', key: 'username' },
        {
            title: 'CHI NHÁNH',
            key: ['branch', 'display_name'],
            render: (text, record) =>
                text ? <Tag color="purple">{text}</Tag> : null
        },
        {
            title: 'CẤP BẬC',
            key: 'role',
            render: (text, record) => (
                <Tag color={colors[text]}>{ROLES[text]}</Tag>
            )
        },
        {
            title: 'TRẠNG THÁI',
            key: 'activated',
            render: (_, record) =>
                record?.activated ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="volcano">Đã khóa</Tag>
                )
        }
    ]

    useEffect(() => {
        const windowUrl = window.location.search
        const params = new URLSearchParams(windowUrl)
        const branchId = params.get('branch_id')
        if (branchId) {
            setFilter({
                ...filter,
                branch_id: parseInt(branchId)
            })
        }
    }, [window.location.search])

    useEffect(() => {
        setLoading(true)
        getUsers({
            variables: {
                page,
                limit: selectAll || showAll ? 0 : limit,
                ...extendFilter,
                ...filter
            }
        })
            .then((res) => {
                const { Users } = res?.data
                setData(Users?.data)
                setTotal(Users?.total)
            })
            .finally(() => setLoading(false))
    }, [page, limit, filter, selectAll])

    const onPageChange = (current, pageSize) => {
        setPage(current)
    }

    const onShowSizeChange = (page, pageSize) => {
        setLimit(pageSize)
    }

    const exportExcel = () => {
        setLoading(true)
        const link = document.createElement('a')
        link.target = '_blank'
        link.download = 'DS Nhân viên.xlsx'

        Axios.post('export/users', filter, {
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
        <Row gutter={[8, 8]}>
            {userInfo?.role < 2 && (
                <>
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
                    {!isHide && (
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Title level={5}>Cấp bậc</Title>
                            <Select
                                style={{
                                    width: '100%'
                                }}
                                onChange={(value) => {
                                    setFilter({ ...filter, role: value })
                                }}
                                placeholder="Cấp bậc"
                                options={ROLES?.map((i, index) => {
                                    return { value: index, label: i }
                                })}
                                allowClear
                            />
                        </Col>
                    )}
                </>
            )}

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Mã NV (enter để lọc)</Title>
                <Input
                    style={{
                        width: '100%'
                    }}
                    value={userCode}
                    onChange={(e) => {
                        setUserCode(e.target.value)
                    }}
                    onPressEnter={(e) => {
                        setFilter({ ...filter, user_code: userCode })
                    }}
                    allowClear
                />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Ca</Title>
                <Select
                    style={{
                        width: '100%'
                    }}
                    onChange={(value) => {
                        setFilter({ ...filter, type: value })
                    }}
                    placeholder="Ca"
                    options={USER_TYPES}
                    allowClear
                />
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>Trạng thái hoạt động</Title>
                <Select
                    style={{
                        width: '100%'
                    }}
                    onChange={(value) => {
                        setFilter({ ...filter, activated: value })
                    }}
                    placeholder="Trạng thái hoạt động"
                    options={USER_ACTIVE_TYPES}
                    allowClear
                />
            </Col>
            {!isHide && (
                <>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Title level={5}>Tải về</Title>
                        <Button
                            onClick={exportExcel}
                            style={{
                                width: '100%'
                            }}>
                            <DocumentDownload variant="Bulk" />
                            <span className="hp-ml-8">Tải Excel</span>
                        </Button>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Title level={5}>Xem tất cả</Title>
                        <Switch
                            checkedChildren="Xem tất cả"
                            unCheckedChildren="Xem tất cả"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                        />
                    </Col>
                </>
            )}
        </Row>
    )

    return (
        <Table
            size="small"
            bordered
            dataSource={data}
            scroll={{
                x: '100%'
            }}
            pagination={false}
            loading={loading}
            onRow={(record, rowIndex) => {
                return {
                    onClick: (event) => {
                        setSelectedId(record?.id)
                        setTrue()
                    }
                }
            }}
            rowKey={(record) => record.id}
            rowSelection={{
                selectedRowKeys,
                type: selectionType,
                onChange: setSelectedRowKeys
            }}
            title={() => filterHeader}
            footer={() => (
                <Pagination
                    pageSize={selectAll || showAll ? total : limit}
                    showSizeChanger
                    onShowSizeChange={onShowSizeChange}
                    showTotal={(total) => `Tổng: ${total}`}
                    total={total}
                    onChange={onPageChange}
                    pageSizeOptions={['50', '100', '500', '1000']}
                />
            )}>
            {columns?.map((i) => (
                <Column {...i} dataIndex={i?.key} />
            ))}
        </Table>
    )
}
