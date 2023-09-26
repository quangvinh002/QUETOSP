import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useSelector } from 'react-redux';

import { Layout, Row, Col } from "antd";
import { motion } from 'framer-motion/dist/framer-motion';

import MenuLogo from "./logo";
import MenuFooter from "./footer";
import MenuItem from "./item";
import MenuMobile from "./mobile";

const { Sider } = Layout;

export default function Sidebar(props) {
    const { visible, setVisible } = props;

    // Redux
    const customise = useSelector(state => state.customise)

    // Collapsed
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (customise.sidebarCollapsed) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [customise])

    // Location
    const location = useLocation();

    // Mobile Sidebar
    const onClose = () => {
        setVisible(false);
    };

    // Menu
    function toggle() {
        setCollapsed(!collapsed);
    }

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={316}
            className="hp-sidebar hp-bg-black-20 hp-bg-color-dark-90 hp-border-right-1 hp-border-color-black-40 hp-border-color-dark-80"
        >
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                className="hp-d-flex hp-h-100"
                style={{ flexDirection: 'column' }}
            >
                <Row align="bottom" justify="space-between">
                    <Col>
                        {collapsed === false ? <MenuLogo onClose={onClose} /> : ""}
                    </Col>

                    {
                        customise.sidebarCollapseButton && (
                            collapsed === false ? (
                                <Col className="hp-pr-0">
                                    <div className="hp-cursor-pointer" onClick={toggle}>
                                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3" />
                                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3" />
                                        </svg>
                                    </div>
                                </Col>
                            ) : (
                                <Col span={24} className="hp-d-flex-full-center">
                                    <div className="hp-cursor-pointer" onClick={toggle}>
                                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3" />
                                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3" />
                                        </svg>
                                    </div>
                                </Col>
                            )
                        )
                    }

                    {collapsed && (
                        <Col span={24} className="hp-mt-12 hp-d-flex-full-center">
                            <MenuLogo onClose={onClose} small={true} />
                        </Col>
                    )}
                </Row>

                <MenuItem onClose={onClose} />

                <MenuFooter onClose={onClose} collapsed={collapsed} />

                <MenuMobile onClose={onClose} visible={visible} />
            </motion.div>
        </Sider>
    );
};
