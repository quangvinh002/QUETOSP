import React from 'react'
import { Button, Tooltip } from 'antd'
import { Eye } from 'iconsax-react'

export default function InventoryItem({ item, action, toggleFileStatus }) {
    return (
        <div className="hp-inventory-body-row" key={item.id}>
            <div className="hp-d-flex hp-w-100">
                <div className="hp-inventory-body-row-item item-name">
                    <span>{item?.upload_by_user?.name}</span>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    <span>{item?.file_name}</span>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    <span>{item?.created_at}</span>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    {item?.total_assigns && `Đã chia: ${item?.total_assigns}`}
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            action(item?.id)
                        }}>
                        Chia dữ liệu ({item?.total_subscriptions || 0})
                    </Button>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    {item?.activated ? (
                        <Button
                            danger
                            size="small"
                            onClick={() => {
                                toggleFileStatus(item?.id, 0)
                            }}>
                            Tạm dừng lấy số
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                toggleFileStatus(item?.id, 1)
                            }}>
                            Tiếp tục lấy số
                        </Button>
                    )}

                    <a
                        href={`/admin/data/subscriptions?file_id=${item?.id}`}
                        target="_blank">
                        <Tooltip
                            title="Xem danh sách data của file tải lên"
                            placement="topRight">
                            <Eye
                                color="#FF8A65"
                                variant="Bulk"
                                onClick={() => {}}
                                style={{ cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </a>
                </div>
            </div>
        </div>
    )
}
