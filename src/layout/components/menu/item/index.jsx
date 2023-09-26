import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { Menu, Tag } from 'antd'

import navigation from '@/navigation'

const { SubMenu } = Menu

export default function MenuItem(props) {
    const { onClose } = props

    // Redux
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
        if (item.header) {
            return (
                <Menu.ItemGroup
                    key={index}
                    title={item.header}></Menu.ItemGroup>
            )
        }

        if (item.children) {
            return (
                <SubMenu key={item.id} icon={item.icon} title={item.title}>
                    {item.children.map((itemChildren, index) => {
                        if (!itemChildren.children) {
                            const childrenNavLink =
                                itemChildren.navLink.split('/')

                            return (
                                // Level 2
                                <Menu.Item
                                    key={itemChildren.id}
                                    className={
                                        splitLocationUrl ===
                                        childrenNavLink[
                                            childrenNavLink.length - 2
                                        ] +
                                            '/' +
                                            childrenNavLink[
                                                childrenNavLink.length - 1
                                            ]
                                            ? 'ant-menu-item-selected'
                                            : 'ant-menu-item-selected-in-active'
                                    }
                                    onClick={onClose}>
                                    {itemChildren.id === 'product-detail' ? (
                                        <Link
                                            to={itemChildren.navLink}
                                            onClick={() =>
                                                dispatch(
                                                    loadCurrentItem(products[0])
                                                )
                                            }>
                                            {itemChildren.title}
                                        </Link>
                                    ) : itemChildren.id.split('-')[0] ===
                                      'email' ? (
                                        <a
                                            href={itemChildren.navLink}
                                            target="_blank">
                                            {itemChildren.title}
                                        </a>
                                    ) : (
                                        <Link to={itemChildren.navLink}>
                                            {itemChildren.title}
                                        </Link>
                                    )}
                                </Menu.Item>
                            )
                        } else {
                            return (
                                // Level 3
                                <SubMenu
                                    key={itemChildren.id}
                                    title={itemChildren.title}>
                                    {itemChildren.children.map(
                                        (childItem, index) => {
                                            const childrenItemLink =
                                                childItem.navLink.split('/')

                                            return (
                                                <Menu.Item
                                                    key={childItem.id}
                                                    className={
                                                        splitLocationUrl ===
                                                        childrenItemLink[
                                                            childrenItemLink.length -
                                                                2
                                                        ] +
                                                            '/' +
                                                            childrenItemLink[
                                                                childrenItemLink.length -
                                                                    1
                                                            ]
                                                            ? 'ant-menu-item-selected'
                                                            : 'ant-menu-item-selected-in-active'
                                                    }
                                                    onClick={onClose}>
                                                    <Link
                                                        to={childItem.navLink}>
                                                        {childItem.title}
                                                    </Link>
                                                </Menu.Item>
                                            )
                                        }
                                    )}
                                </SubMenu>
                            )
                        }
                    })}
                </SubMenu>
            )
        } else {
            const itemNavLink = item.navLink ? item.navLink.split('/') : ''

            return (
                // Level 1
                <Menu.Item
                    key={item.id}
                    icon={item.icon}
                    onClick={onClose}
                    className={
                        splitLocation[splitLocation.length - 2] +
                            '/' +
                            splitLocation[splitLocation.length - 1] ===
                        itemNavLink[itemNavLink.length - 2] +
                            '/' +
                            itemNavLink[itemNavLink.length - 1]
                            ? 'ant-menu-item-selected'
                            : 'ant-menu-item-selected-in-active'
                    }
                    style={item.tag && { pointerEvents: 'none' }}>
                    {item.tag ? (
                        <a
                            href="#"
                            className="hp-d-flex hp-align-items-center hp-d-flex-between">
                            <span>{item.title}</span>
                            <Tag
                                className="hp-mr-0 hp-border-none hp-text-color-black-100 hp-bg-success-3 hp-border-radius-full hp-px-8"
                                style={{ marginRight: -14 }}>
                                {item.tag}
                            </Tag>
                        </a>
                    ) : (
                        <Link to={item.navLink}>{item.title}</Link>
                    )}
                </Menu.Item>
            )
        }
    })

    return (
        <Menu
            mode="inline"
            defaultOpenKeys={[
                splitLocation.length === 5
                    ? splitLocation[splitLocation.length - 3]
                    : null,
                splitLocation[splitLocation.length - 2]
            ]}
            theme={customise.theme == 'light' ? 'light' : 'dark'}
            className="hp-bg-black-20 hp-bg-dark-90">
            {menuItem}
        </Menu>
    )
}
