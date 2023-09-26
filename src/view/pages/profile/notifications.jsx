import React from "react";

import { Row, Col, Divider, Switch } from "antd";

export default function NotificationsProfile() {
  const colTextClass = "hp-caption hp-text-color-black-80 hp-text-color-dark-30";
  const switchClass = "hp-mt-sm-8 hp-ml-sm-0 hp-ml-8";
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";

  return (
    <Row>
      <Col span={24}>
        <h2>Notification Settings</h2>
        <p className="hp-p1-body hp-mb-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          sodales sit amet nunc et vehicula. Mauris sed lectus nisi.
        </p>
      </Col>

      <Divider className={dividerClass} />

      <Col span={24}>
        <h3>Contact</h3>

        <div className="hp-profile-notifications hp-mt-24">
          <Row align="middle" justify="space-between">
            <Col sm={15} span={24} className={colTextClass}>
              System Notification
            </Col>

            <Switch className={switchClass} defaultChecked />
          </Row>

          <Row className="hp-mt-18" align="middle" justify="space-between">
            <Col sm={15} span={24} className={colTextClass}>
              Mail notification
            </Col>

            <Switch className={switchClass} />
          </Row>

          <Row className="hp-mt-18" align="middle" justify="space-between">
            <Col sm={15} span={24} className={colTextClass}>
              Notify me by email about sales and latest news
            </Col>

            <Switch className={switchClass} />
          </Row>

          <Row className="hp-mt-18" align="middle" justify="space-between">
            <Col sm={15} span={24} className={colTextClass}>
              Email me about tips on using account
            </Col>

            <Switch className={switchClass} defaultChecked />
          </Row>
        </div>
      </Col>
    </Row>
  );
}
