import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { Menu, Row, Col, Tag } from 'antd'
import { ArrowDown2 } from 'iconsax-react'

import navigation from '@/navigation'

const { SubMenu } = Menu

export default function MenuHorizontal(props) {
    const { onClose } = props

    // Redux
    const products = useSelector((state) => state.ecommerce.products)
    const customise = useSelector((state) => state.customise)
    const dispatch = useDispatch()

    // Location
    const location = useLocation()
    const { pathname } = location

    const splitLocation = pathname.split('/')

    // Menu
    const splitLocationUrl =
        splitLocation[splitLocation.length - 2] +
        '/' +
        splitLocation[splitLocation.length - 1]

    const menuItem = navigation.map((item, index) => {
        return item.subMenu ? (
            <SubMenu
                key={item.id}
                title={
                    <Row
                        key={item.header}
                        align="middle"
                        className="menu-item hp-px-12 hp-py-4 hp-border-radius">
                        <Col>{item.header}</Col>

                        <Col className="hp-d-flex-align-center hp-ml-6">
                            <ArrowDown2 size="8" />
                        </Col>
                    </Row>
                }
                className={
                    splitLocation[1] == item.id && 'ant-menu-submenu-selected'
                }>
                {item.subMenu.map((value, index) =>
                    value.children ? (
                        // Level 2
                        <SubMenu
                            key={value.id}
                            icon={value.icon}
                            title={value.title}>
                            {value.children.map((childItem, index) =>
                                childItem.children ? (
                                    <SubMenu
                                        key={childItem.id}
                                        icon={childItem.icon}
                                        title={childItem.title}>
                                        {
                                            // Level 3
                                            childItem.children ? (
                                                childItem.children.map(
                                                    (childItem1, index) => (
                                                        <Menu.Item
                                                            key={childItem1.id}
                                                            className={
                                                                splitLocationUrl ===
                                                                childItem1.navLink.split(
                                                                    '/'
                                                                )[
                                                                    childItem1.navLink.split(
                                                                        '/'
                                                                    ).length - 2
                                                                ] +
                                                                    '/' +
                                                                    childItem1.navLink.split(
                                                                        '/'
                                                                    )[
                                                                        childItem1.navLink.split(
                                                                            '/'
                                                                        )
                                                                            .length -
                                                                            1
                                                                    ]
                                                                    ? 'ant-menu-item-selected'
                                                                    : 'ant-menu-item-selected-in-active'
                                                            }
                                                            onClick={onClose}>
                                                            <Link
                                                                to={
                                                                    childItem1.navLink
                                                                }>
                                                                {
                                                                    childItem1.title
                                                                }
                                                            </Link>
                                                        </Menu.Item>
                                                    )
                                                )
                                            ) : (
                                                <Menu.Item key={childItem.id}>
                                                    <Link
                                                        to={childItem.navLink}>
                                                        {childItem.title}
                                                    </Link>
                                                </Menu.Item>
                                            )
                                        }
                                    </SubMenu>
                                ) : (
                                    <Menu.Item
                                        key={childItem.id}
                                        className={
                                            splitLocationUrl ===
                                            childItem.navLink.split('/')[
                                                childItem.navLink.split('/')
                                                    .length - 2
                                            ] +
                                                '/' +
                                                childItem.navLink.split('/')[
                                                    childItem.navLink.split('/')
                                                        .length - 1
                                                ]
                                                ? 'ant-menu-item-selected'
                                                : 'ant-menu-item-selected-in-active'
                                        }
                                        onClick={onClose}>
                                        {childItem.id === 'product-detail' ? (
                                            <Link to={childItem.navLink}>
                                                {childItem.title}
                                            </Link>
                                        ) : childItem.id.split('-')[0] ===
                                          'email' ? (
                                            <a
                                                href={childItem.navLink}
                                                target="_blank">
                                                {childItem.title}
                                            </a>
                                        ) : (
                                            <Link to={childItem.navLink}>
                                                {childItem.title}
                                            </Link>
                                        )}
                                    </Menu.Item>
                                )
                            )}
                        </SubMenu>
                    ) : (
                        // Level 1
                        <Menu.Item
                            key={value.id}
                            icon={value.icon}
                            onClick={onClose}
                            className={
                                splitLocation[splitLocation.length - 2] +
                                    '/' +
                                    splitLocation[splitLocation.length - 1] ===
                                    value.navLink &&
                                value.navLink.split('/')[
                                    value.navLink.split('/').length - 2
                                ] +
                                    '/' +
                                    value.navLink &&
                                value.navLink.split('/')[
                                    value.navLink.split('/').length - 1
                                ]
                                    ? 'ant-menu-item-selected'
                                    : 'ant-menu-item-selected-in-active'
                            }
                            style={value.tag && { pointerEvents: 'none' }}>
                            {value.tag ? (
                                <a
                                    href="#"
                                    className="hp-d-flex hp-align-items-center hp-d-flex-between">
                                    <span>{value.title}</span>
                                    <Tag
                                        className="hp-ml-4 hp-mr-0 hp-border-none hp-text-color-black-100 hp-bg-success-3 hp-border-radius-full hp-px-8"
                                        style={{ marginRight: -14 }}>
                                        {value.tag}
                                    </Tag>
                                </a>
                            ) : (
                                <Link to={value.navLink}>{value.title}</Link>
                            )}
                        </Menu.Item>
                    )
                )}
            </SubMenu>
        ) : (
            <Menu.Item key={item.header}>
                <Link to={item.navLink}>{item.header}</Link>
            </Menu.Item>
        )
    })

    return (
        <Menu
            mode="horizontal"
            theme={customise.theme == 'light' ? 'light' : 'dark'}>
            {menuItem}
        </Menu>
    )
}
