import React from 'react'

export default function InventoryItem({ item }) {
    return (
        <div className="hp-inventory-body-row" key={item.id}>
            <div className="hp-d-flex hp-w-100">
                <div className="hp-inventory-body-row-item item-name">
                    <span>{item.stb}</span>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    <span>{item.code}</span>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    <span>{item.start_date}</span>
                </div>

                <div className="hp-inventory-body-row-item item-name">
                    <span>{item.end_date}</span>
                </div>
            </div>
        </div>
    )
}
