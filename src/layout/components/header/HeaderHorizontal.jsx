import React, { useEffect, useRef, useState } from 'react'

import { useSelector } from 'react-redux'

import { Layout, Button, Row, Col } from 'antd'
import { RiCloseLine, RiMenuFill } from 'react-icons/ri'
import { SearchNormal1 } from 'iconsax-react'

import HeaderUser from './HeaderUser'
import HeaderNotifications from './HeaderNotifications'
import MenuLogo from '../menu/logo'
import MenuMobile from '../menu/mobile'
import HeaderLanguages from './HeaderLanguages'

const { Header } = Layout

export default function HeaderHorizontal(props) {
    const { visible, setVisible } = props

    const [searchHeader, setSearchHeader] = useState(false)

    // Redux
    const customise = useSelector((state) => state.customise)

    // Header Class
    const [headerClass, setHeaderClass] = useState()

    useEffect(() => {
        if (customise.navigationFull) {
            setHeaderClass(' hp-header-full')
        } else if (customise.navigationBg) {
            setHeaderClass(' hp-header-bg')
        } else {
            setHeaderClass('')
        }
    }, [customise])

    // Mobile Sidebar
    const onClose = () => {
        setVisible(false)
    }

    // Focus
    const inputFocusRef = useRef(null)
    const inputFocusProp = {
        ref: inputFocusRef
    }

    // Mobile Sidebar
    const showDrawer = () => {
        setVisible(true)
        setSearchHeader(false)
    }

    // Children
    const headerChildren = () => {
        return (
            <Row
                className="hp-w-100 hp-position-relative"
                align="middle"
                justify="space-between">
                <Col>
                    <MenuLogo />

                    <Col className="hp-mobile-sidebar-button">
                        <Button
                            className="hp-mobile-sidebar-button"
                            type="text"
                            onClick={showDrawer}
                            icon={
                                <RiMenuFill
                                    size={24}
                                    className="remix-icon hp-text-color-black-80"
                                />
                            }
                        />
                    </Col>
                </Col>
                <Col>
                    <Row align="middle">
                        <HeaderLanguages />

                        <Col className="hp-mr-sm-0 hp-mr-4 hp-d-flex-center">
                            {!searchHeader ? (
                                <Button
                                    ghost
                                    type="primary"
                                    className="hp-border-none hp-hover-bg-black-10 hp-hover-bg-dark-100"
                                    icon={
                                        <SearchNormal1
                                            set="curved"
                                            className="hp-text-color-black-80 hp-text-color-dark-30"
                                        />
                                    }
                                    onClick={() => searchClick()}
                                />
                            ) : (
                                <Button
                                    ghost
                                    type="primary"
                                    className="hp-border-none hp-hover-bg-black-10 hp-hover-bg-dark-100"
                                    icon={
                                        <RiCloseLine
                                            size={24}
                                            className="hp-text-color-black-80 hp-text-color-dark-30"
                                        />
                                    }
                                    onClick={() => setSearchHeader(false)}
                                />
                            )}
                        </Col>

                        <HeaderNotifications />

                        <HeaderUser />
                    </Row>
                </Col>
            </Row>
        )
    }

    return (
        <Header className={'hp-header-horizontal' + headerClass}>
            <Row justify="center" className="hp-w-100">
                <Col span={24}>{headerChildren()}</Col>
            </Row>

            <MenuMobile onClose={onClose} visible={visible} />
        </Header>
    )
}
