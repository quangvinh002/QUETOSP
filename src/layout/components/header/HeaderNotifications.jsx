import React from "react";

import { useSelector } from "react-redux";

import { Button, Badge, Row, Col, Dropdown, Divider, Avatar } from "antd";
import { NotificationBing, TickCircle } from 'iconsax-react';

export default function HeaderNotifications() {
  const direction = useSelector(state => state.customise.direction)

  const notificationMenu = (
    <div className="hp-notification-dropdown hp-border-radius hp-border-color-black-40 hp-bg-black-0 hp-bg-dark-100 hp-border-color-dark-80 hp-pt-24 hp-pb-18 hp-px-24" style={{ marginTop: 23 }}>
      <Row wrap={false} align="middle" justify="space-between" className="hp-mb-16">
        <Col className="h5 hp-text-color-black-100 hp-text-color-dark-0 hp-mr-64">
          Notifications
        </Col>

        <Col className="hp-badge-text hp-font-weight-500 hp-text-color-black-80 hp-ml-24">
          4 New
        </Col>
      </Row>

      <Divider className="hp-mt-0 hp-mb-4" />

      <div className="hp-overflow-y-auto hp-px-10" style={{ maxHeight: 400, marginRight: -10, marginLeft: -10 }}>
        <Row className="hp-cursor-pointer hp-border-radius hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-py-12 hp-px-10" style={{ marginLeft: -10, marginRight: -10 }}>
          <Col className="hp-mr-12">
            <Avatar
              size={48}
              className="hp-d-flex-center-full"
            />
          </Col>

          <Col flex="1 0 0">
            <p className="hp-d-block hp-font-weight-500 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 hp-mb-4">
              Debi Cakar <span className="hp-text-color-black-60">commented on</span> Ecosystem and conservation
            </p>

            <span className="hp-d-block hp-badge-text hp-font-weight-500 hp-text-color-black-60 hp-text-color-dark-40">
              1m ago
            </span>
          </Col>
        </Row>

        <Row className="hp-cursor-pointer hp-border-radius hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-py-12 hp-px-10" style={{ marginLeft: -10, marginRight: -10 }}>
          <Col className="hp-mr-12">
            <Avatar
              size={48}
              className="hp-d-flex-center-full"
            />
          </Col>

          <Col flex="1 0 0">
            <p className="hp-d-block hp-font-weight-500 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 hp-mb-4">
              Edward Adams <span className="hp-text-color-black-60">invite you to</span> Prototyping
            </p>

            <span className="hp-d-block hp-badge-text hp-font-weight-500 hp-text-color-black-60 hp-text-color-dark-40">
              9h ago
            </span>
          </Col>
        </Row>

        <Row className="hp-cursor-pointer hp-border-radius hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-py-12 hp-px-10" style={{ marginLeft: -10, marginRight: -10 }}>
          <Col className="hp-mr-12">
            <Avatar
              size={48}
              className="hp-d-flex-center-full"
            />
          </Col>

          <Col flex="1 0 0">
            <p className="hp-d-block hp-font-weight-500 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 hp-mb-4">
              Richard Charles <span className="hp-text-color-black-60">mentioned you in</span> UX Basics Field
            </p>

            <span className="hp-d-block hp-badge-text hp-font-weight-500 hp-text-color-black-60 hp-text-color-dark-40">
              13h ago
            </span>
          </Col>
        </Row>

        <Row className="hp-cursor-pointer hp-border-radius hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-py-12 hp-px-10" style={{ marginLeft: -10, marginRight: -10 }}>
          <Col className="hp-mr-12">
            <Avatar
              size={48}
              icon={<TickCircle size={24} variant="Bold" className="hp-text-color-success-1" />}
              className="hp-d-flex-center-full hp-bg-success-4 hp-bg-dark-success"
            />
          </Col>

          <Col flex="1 0 0">
            <p className="hp-d-block hp-font-weight-500 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 hp-mb-4">
              <span className="hp-text-color-black-60">You swapped exactly</span> 0.230000 ETH <span className="hp-text-color-black-60">for</span> 28,031.99
            </p>

            <span className="hp-d-block hp-badge-text hp-font-weight-500 hp-text-color-black-60 hp-text-color-dark-40">
              17h ago
            </span>
          </Col>
        </Row>
      </div>
    </div>
  );

  return (
    <Col className="hp-d-flex-center">
      <Button
        ghost
        type="primary"
        className="hp-border-none hp-hover-bg-black-10 hp-hover-bg-dark-100"
        icon={
          <Dropdown overlay={notificationMenu} placement="bottomRight">
            <div className="hp-position-relative">
              <div className="hp-position-absolute" style={direction == "rtl" ? { left: -5, top: -5 } : { right: -5, top: -5 }}>
                <Badge
                  dot
                  status="processing"
                />
              </div>

              <NotificationBing size="22" className="hp-text-color-black-80 hp-text-color-dark-30" />
            </div>
          </Dropdown>
        }
      />
    </Col>
  );
};