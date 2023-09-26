import React, { useState, useCallback } from 'react'
import { Row, Col, Button, Upload, Empty, Spin } from 'antd'
import { DocumentUpload, DocumentDownload } from 'iconsax-react'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import BreadCrumbs from '@/layout/components/content/breadcrumbs'
import InventoryItem from './item'
import exampleImg from '@/assets/images/loc-ngay-het-han.png'
import { useQuery } from '@apollo/client'
import { PACKS } from '@/constants'

const columns = ['STB', 'GÓI CƯỚC', 'NGÀY TRỪ CƯỚC', 'NGÀY HẾT HẠN']

export default function Inventory() {
    const [itemArray, setItemArray] = useState()
    const [fileName, setFileName] = useState()
    const { loading, data } = useQuery(PACKS)
    const packageList = data?.Packs

    const exportFile = useCallback(() => {
        const ws = XLSX.utils.json_to_sheet(itemArray)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Data')
        XLSX.writeFileXLSX(wb, fileName || 'TaiPhat.xlsx')
    }, [itemArray])

    return (
        <Spin spinning={loading} size="large">
            <Row gutter={[32, 32]} className="hp-ecommerce-app hp-mb-32">
                <Col span={24}>
                    <Row gutter={[32, 32]} justify="space-between">
                        <BreadCrumbs
                            breadCrumbParent="Quản lý"
                            breadCrumbActive="Tính ngày hết hạn"
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
                                                        const code =
                                                            Object.values(i)[1]
                                                        const startDate = dayjs(
                                                            Object.values(i)[2]
                                                        )

                                                        const findItem =
                                                            packageList?.find(
                                                                (p) =>
                                                                    p?.c ===
                                                                    code
                                                            )

                                                        const endDate = findItem
                                                            ? startDate?.add(
                                                                  findItem?.d,
                                                                  'day'
                                                              )
                                                            : null

                                                        return {
                                                            stb: Object.values(
                                                                i
                                                            )[0],
                                                            code: code,
                                                            start_date:
                                                                startDate.format(
                                                                    'DD/MM/YYYY'
                                                                ) || '',
                                                            end_date:
                                                                endDate?.format(
                                                                    'DD/MM/YYYY'
                                                                ) || ''
                                                        }
                                                    }
                                                )

                                                setItemArray(processedData)
                                            }

                                            reader.readAsArrayBuffer(file)

                                            return false
                                        }}>
                                        <Button type="primary">
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
                                {itemArray?.length && (
                                    <Col>
                                        <Button
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
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <h2>Nội dung file excel</h2>
                </Col>

                <Col span={24}>
                    <h5>Mẫu file tải lên</h5>
                    <img src={exampleImg} />
                </Col>

                <Col span={24} className="hp-ecommerce-app-inventory">
                    <div className="hp-inventory-container">
                        <div className="hp-inventory-header">
                            {columns?.map((c, index) => (
                                <div
                                    className="hp-inventory-header-item item-name"
                                    key={index}>
                                    <span className="hp-caption hp-text-uppercase">
                                        {c}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="hp-inventory-body">
                            {itemArray?.map((value, index) => (
                                <InventoryItem item={value} />
                            )) || (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Spin>
    )
}
