import React from 'react'
import { Link } from 'react-router-dom'

import { Divider, Avatar, Row, Col } from 'antd'
import { RiSettings3Line } from 'react-icons/ri'
import { getAcronym, getUserInfo } from 'helpers'

const userInfo = getUserInfo()

export default function MenuFooter(props) {
    return props.collapsed === false ? (
        <Row
            className="hp-sidebar-footer hp-bg-color-dark-90"
            align="middle"
            justify="space-between">
            <Divider className="hp-border-color-black-40 hp-border-color-dark-70 hp-mt-0" />

            <Col>
                <Row align="middle">
                    <Avatar
                        style={{ backgroundColor: '#87d068' }}
                        size={48}
                        className="hp-bg-info-4 hp-mr-8">
                        {getAcronym(userInfo?.name)}
                    </Avatar>
                    <div className="hp-mt-6">
                        <span
                            className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body"
                            style={{ lineHeight: 1 }}>
                            {userInfo?.name}
                        </span>

                        <Link
                            to="/pages/profile/personel-information"
                            className="hp-badge-text hp-text-color-dark-30 hp-font-weight-400"
                            onClick={props.onClose}>
                            {userInfo?.email}
                        </Link>
                    </div>
                </Row>
            </Col>

            <Col>
                <Link
                    to="/pages/profile/personel-information"
                    onClick={props.onClose}>
                    <RiSettings3Line
                        className="remix-icon hp-text-color-black-100 hp-text-color-dark-0"
                        size={24}
                    />
                </Link>
            </Col>
        </Row>
    ) : (
        <Row
            className="hp-sidebar-footer hp-bg-color-dark-90"
            align="middle"
            justify="center">
            <Col>
                <Link
                    to="/pages/profile/personel-information"
                    onClick={props.onClose}>
                    <Avatar size={48} className="hp-bg-info-4">
                        123
                    </Avatar>
                </Link>
            </Col>
        </Row>
    )
}
