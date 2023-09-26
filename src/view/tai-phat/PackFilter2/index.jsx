import React, { useState, useCallback } from 'react'
import { Row, Col, Button, Upload, Table, Typography, Spin } from 'antd'
import { DocumentUpload, DocumentDownload } from 'iconsax-react'
import * as XLSX from 'xlsx'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import Axios from '@/Axios'

const { Column } = Table
const { Title } = Typography

export default function Inventory() {
    const [itemArray, setItemArray] = useState([])
    const [fileName, setFileName] = useState()
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)

    const exportFile = useCallback(() => {
        const ws = XLSX.utils.json_to_sheet(itemArray)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Data')
        XLSX.writeFileXLSX(wb, fileName || 'TaiPhat.xlsx')
    }, [itemArray])

    const columns = [
        {
            title: 'SĐT',
            render: (text, record) => record?.phoneNumber
        },
        {
            title: 'Code',
            render: (text, record) => record?.code
        },
        {
            title: 'Ngày kích hoạt',
            render: (text, record) => record?.activeDate
        },
        {
            title: 'Ngày đăng ký',
            render: (text, record) => record?.startDate
        },
        {
            title: 'Ngày hết hạn',
            render: (text, record) => record?.endDate
        },
        {
            title: '',
            render: (text, record) => record?.status
        }
    ]

    const scanPackCode = async (phones) => {
        phones?.map(async (item) => {
            await Axios.post('khcn', {
                phone_number: item?.phoneNumber
            })
                .then((res) => {
                    return res?.data?.data
                })
                .then((data) => {
                    const pack = data?.pckHistories?.[0]
                    setProgress((prev) => prev + 1)
                    setItemArray((prev) => [
                        ...prev,
                        {
                            phoneNumber: item?.phoneNumber,
                            code: pack?.pckCode,
                            activeDate: data?.activeDate,
                            startDate: pack?.startDate,
                            endDate: pack?.endDate,
                            status: 'Thành công'
                        }
                    ])
                })
        })
    }

    const scanPackCode2 = async (phones) => {
        phones?.map(async (item) => {
            await Axios.post(
                `https://hochiminh.mobifone.vn/sf/api/khcn/program-obj?username=test_khcn&password=khcn@mbfkv2&isdn=${item?.phoneNumber}&direction=I&fromDate=01/06/2022&code=`
            )
                .then((res) => {
                    return res?.data?.data
                })
                .then((data) => {
                    const pack = data?.pckHistories?.[0]
                    setProgress((prev) => prev + 1)
                    setItemArray((prev) => [
                        ...prev,
                        {
                            phoneNumber: item?.phoneNumber,
                            code: pack?.pckCode,
                            activeDate: data?.activeDate,
                            startDate: pack?.startDate,
                            endDate: pack?.endDate,
                            status: 'Thành công'
                        }
                    ])
                })
        })
    }

    const filterHeader = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Title level={5}>
                    Đang quét {progress} / {total}
                </Title>
            </Col>
        </Row>
    )

    return process.env.REACT_APP_ENV === 'clone' ? (
        <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
            <Col span={24}>
                <Row gutter={[32, 32]} justify="space-between">
                    <BreadCrumbs
                        breadCrumbParent="Quản lý"
                        breadCrumbActive="Lọc gói cước"
                    />

                    <Col span={24} md={12}>
                        <Spin spinning={loading}>
                            <Row
                                gutter={[16, 16]}
                                justify="end"
                                className="hp-ecommerce-app-inventory-events">
                                <Col>
                                    <Upload
                                        accept=".xls, .xlsx"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            const reader = new FileReader()
                                            setFileName(file?.name)

                                            reader.onload = (e) => {
                                                var workbook = XLSX.read(
                                                    e.target.result
                                                )
                                                var first_ws =
                                                    workbook.Sheets[
                                                        workbook.SheetNames[0]
                                                    ]
                                                const data =
                                                    XLSX.utils.sheet_to_json(
                                                        first_ws,
                                                        {
                                                            raw: false,
                                                            dateNF: 'MM/DD/YYYY',
                                                            header: 0,
                                                            defval: ''
                                                        }
                                                    )

                                                const processedData = data?.map(
                                                    (i) => {
                                                        const phoneNumber =
                                                            Object.values(i)[0]

                                                        return {
                                                            phoneNumber
                                                        }
                                                    }
                                                )
                                                setTotal(processedData?.length)
                                                if (
                                                    process.env
                                                        .REACT_APP_ENV ===
                                                    'prod'
                                                ) {
                                                    scanPackCode(processedData)
                                                } else {
                                                    scanPackCode2(processedData)
                                                }
                                            }

                                            reader.readAsArrayBuffer(file)

                                            return false
                                        }}>
                                        <Button type="primary" size="small">
                                            <DocumentUpload
                                                color="#fff"
                                                variant="Bulk"
                                            />
                                            <span className="hp-ml-8">
                                                Tải lên file excel
                                            </span>
                                        </Button>
                                    </Upload>
                                </Col>
                                {itemArray?.length ? (
                                    <Col>
                                        <Button
                                            size="small"
                                            type="secondary"
                                            onClick={exportFile}>
                                            <DocumentDownload
                                                color="#FF8A65"
                                                variant="Bulk"
                                            />
                                            <span className="hp-ml-8">
                                                Tải kết quả
                                            </span>
                                        </Button>
                                    </Col>
                                ) : null}
                            </Row>
                        </Spin>
                    </Col>
                </Row>
            </Col>

            <Col span={24} className="hp-ecommerce-app-inventory">
                <Table
                    dataSource={itemArray}
                    title={() => filterHeader}
                    pagination={false}>
                    {columns?.map((i) => (
                        <Column {...i} />
                    ))}
                </Table>
            </Col>
        </Row>
    ) : (
        <Col span={24}>
            <a href="https://locgoi.vienthongtaiphat.com/admin/loc-goi-cuoc-2">
                <h2>Đến trang lọc gói cước</h2>
            </a>
        </Col>
    )
}
