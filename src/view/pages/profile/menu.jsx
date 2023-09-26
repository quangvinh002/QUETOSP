import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { Col, Avatar, Badge, Menu } from 'antd'
import { User, Activity, PasswordCheck } from 'iconsax-react'
import { getAcronym } from 'helpers'
const userInfo = JSON.parse(localStorage.getItem('@current_user'))

export default function MenuProfile(props) {
    const menuIconClass = 'remix-icon hp-mr-8'

    function menuFooterItem() {
        if (props.footer !== 'none') {
            return (
                <div className="hp-profile-menu-footer">
                    {/* <img src={menuImg} alt="Profile Image" /> */}
                </div>
            )
        }
    }

    const location = useLocation()
    const { pathname } = location
    const splitLocation = pathname.split('/')

    // Redux
    const customise = useSelector((state) => state.customise)

    return (
        <Col flex="240px" className="hp-profile-menu hp-py-24">
            <div className="hp-w-100">
                <div className="hp-mt-md-16 hp-text-center">
                    <Badge count={''}>
                        <Avatar size={80}>{getAcronym(userInfo?.name)}</Avatar>
                    </Badge>

                    <h3 className="hp-mt-24 hp-mb-4">{userInfo?.name}</h3>
                    <a href="mailto:dolores@yoda.com" className="hp-p1-body">
                        {userInfo?.email}
                    </a>
                </div>

                <Menu
                    mode="inline"
                    className="hp-w-100 hp-profile-menu-body"
                    theme={customise.theme == 'light' ? 'light' : 'dark'}>
                    <Menu.Item
                        key="1"
                        icon={<User set="curved" className={menuIconClass} />}
                        className={`
              hp-mb-16 hp-pl-24 hp-pr-32
              ${
                  splitLocation[splitLocation.length - 1] ===
                  'personel-information'
                      ? 'ant-menu-item-selected'
                      : 'ant-menu-item-selected-in-active'
              }
            `}
                        onClick={props.onCloseDrawer}>
                        <Link to="/pages/profile/personel-information">
                            Personal Information
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        key="3"
                        icon={
                            <Activity set="curved" className={menuIconClass} />
                        }
                        className={`
              hp-mb-16 hp-pl-24 hp-pr-32
              ${
                  splitLocation[splitLocation.length - 1] === 'activity'
                      ? 'ant-menu-item-selected'
                      : 'ant-menu-item-selected-in-active'
              }
            `}
                        onClick={props.onCloseDrawer}>
                        <Link to="/pages/profile/activity">
                            Activity Monitor
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        key="5"
                        icon={
                            <PasswordCheck
                                size="32"
                                color="#FF8A65"
                                variant="Bulk"
                            />
                        }
                        className={`
              hp-mb-16 hp-pl-24 hp-pr-32
              ${
                  splitLocation[splitLocation.length - 1] === 'password-change'
                      ? 'ant-menu-item-selected'
                      : 'ant-menu-item-selected-in-active'
              }
            `}
                        onClick={props.onCloseDrawer}>
                        <Link to="/pages/profile/password-change">
                            Password Change
                        </Link>
                    </Menu.Item>
                </Menu>
            </div>

            {menuFooterItem()}
        </Col>
    )
}
