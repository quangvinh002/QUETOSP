import React, { useState, useCallback } from 'react'
import { Row, Col, Button, Upload, Table } from 'antd'
import { DocumentUpload, DocumentDownload } from 'iconsax-react'
import * as XLSX from 'xlsx'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import Axios from '@/Axios'

const { Column } = Table

export default function Inventory() {
    const [itemArray, setItemArray] = useState([])
    const [fileName, setFileName] = useState()
    const [loading, setLoading] = useState(false)

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

    const scanPackCode = (phones) => {
        setLoading(true)

        Axios.post('scan-pack-code', { phones })
            .then((res) => {
                return res?.data?.data
            })
            .then((data) => {
                setItemArray(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
            <Col span={24}>
                <Row gutter={[32, 32]} justify="space-between">
                    <BreadCrumbs
                        breadCrumbParent="Quản lý"
                        breadCrumbActive="Lọc gói cước"
                    />

                    <Col span={24} md={12}>
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

                                            scanPackCode(processedData)
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
                    </Col>
                </Row>
            </Col>

            {/* <Col span={24}>
                    <h2>Lọc gói cước</h2>
                </Col> */}

            <Col span={24} className="hp-ecommerce-app-inventory">
                <Table dataSource={itemArray} loading={loading}>
                    {columns?.map((i) => (
                        <Column {...i} />
                    ))}
                </Table>
            </Col>
        </Row>
    )
}
